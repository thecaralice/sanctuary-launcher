let {remote, ipcRenderer} = require('electron'); 
const {Authenticator} = require('minecraft-launcher-core');
const jsonfile = require('jsonfile');
const wait = require('waait');
const fs = require('fs');

const login_button = document.getElementById('login_button')
const email = document.getElementById('email')
const password = document.getElementById('password')
const file = 'user_cache.json';

if(!fs.existsSync(file)){
    await jsonfile.writeFile(file, {access_token: 'token'}, function (err) {
        if (err) console.error(err)
    })
}
login_button.addEventListener('click',async  () =>{
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
    await jsonfile.readFile(file, async function (err, obj) {
        if(obj === undefined){
            let auth = await Authenticator.getAuth(email.value, password.value)
            await jsonfile.writeFile(file, auth, function (err) {
                if (err) console.error(err)
            })          
        }
        let valid = await Authenticator.validate(obj.access_token)
        if(valid === false){
            let auth = await Authenticator.getAuth(email.value, password.value)
            await jsonfile.writeFile(file, auth, function (err) {
                if (err) console.error(err)
            })          
        }
    })
    await wait(250)
    remote.getGlobal('index')()
})