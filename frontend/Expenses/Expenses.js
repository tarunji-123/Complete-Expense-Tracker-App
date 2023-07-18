var form = document.getElementById('my-form');
var item = document.getElementById('items');
var item2 = document.getElementById('items2');

var amountInput = document.getElementById('amount');
var descInput = document.getElementById('desc');
var categoryInput = document.getElementById('category');

form.addEventListener("submit",addExpense);
window.addEventListener('load',showExpense);

function addExpense(e){
    e.preventDefault();

    const amount = amountInput.value;
    const desc = descInput.value;
    const category = categoryInput.value;

    if(amount !=="" && desc !== "" && category !==""){
        let exp = {
            amount,
            desc,
            category
        };
        const token = localStorage.getItem('token');
        axios
        .post('http://localhost:5000/expenses/add-exp',exp,{
            headers:{
                'Authorization':token
            }
        })
        .then((response)=>{
            console.log(response.data);
            showExpense();
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    form.reset();
}

function showExpense(){
    item.innerHTML = "";
    const token = localStorage.getItem('token');
    console.log(token);
    axios
    .get("http://localhost:5000/expenses/get-exp",{headers: {"Authorization": token}})
    .then((response)=>{
        console.log(response.data.allExpenses);
        response.data.allExpenses.forEach((expData)=> {
            item.innerHTML += `
            <li class= "fw-bold fs-5 my-1"> 
            ${expData.amount}-
            ${expData.desc}-
            ${expData.category}
            <input type="button" class="btn btn-danger" value = "Delete" onclick = "deleteExpense('${expData.id}')">
            </li>`;
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

function deleteExpense(id){
    console.log('delete fxn run');
    axios
    .delete(`http://localhost:5000/expenses/delete-exp/${id}`)
    .then((response)=>{
        console.log(response.data);
        showExpense();
        console.log(response.data);
    })
    .catch((err)=>{
        console.log(err);
    })
}

document.getElementById('rzp-button1').onclick= async function (e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/purchase/premiummembership',{headers : {"Authorization": token}});
    console.log(response);

    console.log("key",response.data.key_id);
    console.log("order_id",response.data.order.id);
    var options = {
        // "key":'rzp_test_kL1qrGVRGjqWvz',
        "key" : response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:5000/purchase/updatetransactionstatus',{
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
            }, {headers : {"Authorization" : token}})
            alert ('You are a Premium User now')
            document.getElementById('rzp-button1').remove();
            document.querySelector('.card-header').innerHTML += '<div><p class="m-0"> You are a premium user</p> <button class="btn btn-outline-info" onclick="showLeaderBoard()">Show leaderboard</button></div>';

        }
    }

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed',function(response){
        console.log(response);
        alert('Something went wrong');
    });
}

function showLeaderBoard(){
    item2.innerHTML = ``;
    axios
    .get('http://localhost:5000/premium/showLeaderBoard')
    .then((response)=>{
        console.log(response);
        console.log(response.data);
        console.log("heyyeyeye");
    })
}