
var form = document.getElementById('my-form');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');

form.addEventListener('submit',submitForm);

function submitForm(e){
    e.preventDefault();
    console.log("hello");
    
    var name = nameInput.value;
    var email = emailInput.value;
    var password = passwordInput.value;
    var obj={
        name,
        email,
        password
    }

    axios.
    post('http://localhost:5000/user/signup',obj)
    .then((response)=>{
        console.log(response.data);
        form.reset();

    })
    .catch(err =>{
        console.log(err);
    })


}