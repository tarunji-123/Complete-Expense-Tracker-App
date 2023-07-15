
var form = document.getElementById('my-form');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');

form.addEventListener('submit',submitForm);

async function submitForm(e){
    try{
        e.preventDefault();
        console.log("hello");
        
        var name = nameInput.value;
        var email = emailInput.value;
        var password = passwordInput.value;
        var signupDetail={
            name,
            email,
            password
        }

        const response = await axios.
        post('http://localhost:5000/user/signup',signupDetail);
            if(response.status == 201){
                window.location.href ="../login/login.html";
            }else{
                throw new Error('Failed to login');
            }
        form.reset();
        
    }
    catch(err){
        document.body.innerHTML += `<div style='color:red;'>${err}<div>`;
    }
}