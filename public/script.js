const formElement = document.getElementById("login");

formElement.addEventListener("submit",(event) =>{
event.preventDefault();
let email = document.getElementById("email").value;
let username = document.getElementById("username").value;
let password = document.getElementById("password").value;
let password2 = document.getElementById("password2").value;
if (password == password2) {
    let usuario = {email: email, username : username, password : password};
let usuarioJson = JSON.stringify(usuario);
sweetAlert('alert', "Usuario creado correctamente!", 'alert');
fetch('http://localhost:3001/usuarios', {
    method: 'POST',
    body : usuarioJson,
    headers:{
        'Content-Type': 'application/json'
    }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));

} else {

sweetAlert('error', "Verifique que la contraseña sea igual", 'error')

}

})





