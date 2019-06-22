const login_button = document.getElementById('login_button')
const email = document.getElementById('email')
const password = document.getElementById('password')

login_button.addEventListener('click', () =>{
    var _return = false;
    email.classList.remove('is-danger')
    password.classList.remove('is-danger')
    if (!email.value.replace(/\s/g, '').length) {
        _return = true
        email.classList.add('is-danger')
    }
    if (!password.value.replace(/\s/g, '').length) {
        _return = true
        password.classList.add('is-danger')
    }
    if(_return) return
    console.log('ss')
})