// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let max = document.getElementById("max")
let button = document.getElementById("launch")
let amount = document.getElementById("amount")
const launch = require("./launcher.js")
let {remote, ipcRenderer} = require('electron'); 
const settings = require('electron-settings');
max.value = settings.get('memory_alloc');

amount.innerText = `${max.value}MB`
if(max.value < 2047){
     max.classList.remove('is-warning')
     max.classList.remove('is-success')
     max.classList.add('is-danger')
}else if(max.value > 2047 && max.value < 4095){
 max.classList.add('is-warning')
 max.classList.remove('is-danger')
 max.classList.remove('is-success')
}else{
 max.classList.remove('is-warning')
 max.classList.remove('is-danger')
 max.classList.add('is-success') 
}
button.addEventListener('click', () => {
   if(!button.getAttribute("disabled")){
   button.classList.add('is-loading')
   remote.getGlobal('launch')(max.value)
   }
   settings.set('memory_alloc', max.value)
})
if(max.value < 2048){
    max.classList.remove('is-warning')
    max.classList.remove('is-success')
    max.classList.add('is-danger')
}
var mousedownID = -1;  //Global ID of mouse down interval
function mousedown(event) {
  if(mousedownID==-1)  //Prevent multimple loops!
     mousedownID = setInterval(whilemousedown, 100 /*execute every 100ms*/);


}
function mouseup(event) {
   if(mousedownID!=-1) {  //Only stop if exists
     clearInterval(mousedownID);
     mousedownID=-1;
   }
}
function whilemousedown() {
   amount.innerText = `${max.value}MB`
   if(max.value < 2047){
        max.classList.remove('is-warning')
        max.classList.remove('is-success')
        max.classList.add('is-danger')
   }else if(max.value > 2047 && max.value < 4095){
    max.classList.add('is-warning')
    max.classList.remove('is-danger')
    max.classList.remove('is-success')
   }else{
    max.classList.remove('is-warning')
    max.classList.remove('is-danger')
    max.classList.add('is-success') 
   }
}
window.onbeforeunload = (e) => {
   settings.set('memory_alloc', max.value)
};
//Assign events
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);
ipcRenderer.on('data', (event, args) => {
   button.classList.remove('is-loading')
   button.setAttribute("disabled", true)
})
ipcRenderer.on('closed', (event, args) => {
   button.classList.remove('is-loading')
   button.removeAttribute("disabled")
})
