var form = document.getElementById('my-form');
var item = document.getElementById('items');
var item2 = document.getElementById('items2');
var rzpBtn = document.getElementById('rzp-button1')

var amountInput = document.getElementById('amount');
var descInput = document.getElementById('desc');
var categoryInput = document.getElementById('category');

const expensesPreferenceDropdown = document.getElementById('expensesPreference');

var premiumMessageShown = false;

form.addEventListener("submit",addExpense);
window.addEventListener('load',showExpense);
window.addEventListener('load', checkPremiumUser);

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

function showPremiumMessage(){
    rzpBtn.style.visibility ="hidden";
    document.querySelector('.card-header').innerHTML += '<div><p class="m-0"> You are a premium user</p> <button class="btn btn-outline-info" onclick="showLeaderBoard()">Show leaderboard</button></div>';
    // localStorage.setItem('isadmin',true);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function saveExpensePreference(expensePreference) {
    localStorage.setItem('expensesPreference', expensePreference);
    showExpense()
}

expensesPreferenceDropdown.addEventListener('change', function () {
    const selectedValue = expensesPreferenceDropdown.value;
    saveExpensePreference(selectedValue);
});

function showExpense(page){

    item.innerHTML = "";
    const token = localStorage.getItem('token');
    console.log(token);
    
    const expensePreference = localStorage.getItem('expensesPreference');

    const pagesize = expensePreference ? parseInt(expensePreference) : 5;
    if (!page || page < 1) {
        page = 1;
    }
    
    axios.get(`http://localhost:5000/expenses/get-exp?page=${page}&pagesize=${pagesize}`,{headers: {"Authorization": token},
    })
    .then((response)=>{

    console.log(response.data.allExpenses);
    const{currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage} = response.data;
    response.data.allExpenses.forEach((expData)=>{
        item.innerHTML += `
        <li class= "fw-bold fs-5 my-1"> 
        ${expData.amount}-
        ${expData.desc}-
        ${expData.category}
        <input type="button" class="btn btn-danger"value = "Delete" onclick = "deleteExpense('${expData.id}','${expData.amount}')">
        </li>`;
    })
    
    showPagination({currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage})

    if(premiumMessageShown == true){
        showLeaderBoard();
    }
    
    })
    .catch((err)=>console.log(err));
    
    
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
}) {
    
    const button = document.getElementById('pagination');
    let buttonsHTML = []; // Create an array to store the pagination buttons

    if (hasPreviousPage) {
        console.log("hasPreviousPage")
        buttonsHTML.push(`<button class="btn btn-primary" onclick="showExpense(${previousPage})">Previous Page</button>`);
    }

    if (hasNextPage) {
        console.log("hasNextPage")
        buttonsHTML.push(`<button class="btn btn-primary" onclick="showExpense(${nextPage})">Next Page</button>`);
    }

    button.innerHTML = buttonsHTML.join(' ');
}


function deleteExpense(id,amount){
    
    const amount1 = amount;
    console.log(amount1);
    console.log('delete fxn run');
    const token = localStorage.getItem('token');
    axios
    .delete(`http://localhost:5000/expenses/delete-exp/${id}?amount=${amount}`,{headers : {"Authorization": token}})
    .then((response)=>{
        console.log(response.data);
        showExpense();
        // showLeaderBoard();
        console.log(response.data);
    })
    .catch((err)=>{
        console.log(err);
    })
}

function checkPremiumUser() {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    const isPremiumUser = decodeToken.isPremiumUser;
    console.log("ispremiumUser ==>",isPremiumUser);
    console.log(premiumMessageShown,"-->premiumMessageSHown")

    if (isPremiumUser && !premiumMessageShown) {
        console.log("inside if condition");
      showPremiumMessage();
      premiumMessageShown = true; // Set the flag to true
    }
    // showLeaderBoard();
}

document.getElementById('rzp-button1').onclick= async function (e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/purchase/premiummembership',{headers : {"Authorization": token}});
    console.log(response);

    console.log("key",response.data.key_id);
    console.log("order_id",response.data.order.id);
    var options = {
        "key" : response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            const res = await axios.post('http://localhost:5000/purchase/updatetransactionstatus',{
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
            }, {headers : {"Authorization" : token}})
            console.log(res);
            alert ('You are a Premium User now')
            showPremiumMessage();
            localStorage.setItem('token', res.data.token);

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

async function showLeaderBoard(){
    console.log("hello leaderBoard");
    const token = localStorage.getItem('token');
    const userLeaderBoardArray =  await axios.get('http://localhost:5000/premium/showLeaderBoard',{headers : {"Authorization": token}});
    console.log(userLeaderBoardArray);


    var leaderBoardItem = document.getElementById('items2');
    leaderBoardItem.innerHTML = '';
    leaderBoardItem.innerHTML += `<h1> Leader Board </h1>`
    userLeaderBoardArray.data.forEach((userDetails)=>{
        console.log(userDetails.name, "userDetails name")
        leaderBoardItem.innerHTML +=`<li>Name - ${userDetails.name} TotalExpenses - ${userDetails.totalExpense || 0 }`
    })    
}

async function download() {
    let token = localStorage.getItem("token");
    console.log(token);
    try {
      const response = await axios.get("http://localhost:5000/expenses/download", {
        headers: { "Authorization": token },
      });
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } catch (err) {
        throw new Error(err);
    }
}
  

  