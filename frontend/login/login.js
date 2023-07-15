var form = document.getElementById('my-form');

form.addEventListener('submit',loginSubmitForm);
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
                window.location.href = "../main/main.html"
            }else{
                throw new Error('Failed to login');
            }
    }
    catch(err){
        console.log(err);
    }
}