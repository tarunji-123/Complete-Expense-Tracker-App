
var form = document.getElementById('my-form');

form.addEventListener('submit',(e)=>{
    loginSubmitForm(e);
});
async function loginSubmitForm(e){
    try{
        e.preventDefault();

        console.log(e.target.email.value);

        const loginDetails = {
            email : e.target.email.value,
            password : e.target.password.value
        }
        console.log(loginDetails);
        const response = await axios.post('http://localhost:5000/user/login',loginDetails);
            console.log('hello frm frontend')
            if(response.status == 201){
                alert(response.data.message);
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                window.location.href = "../Expenses/Expenses.html";
            }else{
                throw new Error('Failed to login');
            }
            form.reset();
    }
    catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red"> ${err.message}<div>`;
    }
}