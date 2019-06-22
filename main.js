// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const remote = require('electron').remote
const path = require('path')
const launch = require('./launcher.js')
const settings = require('electron-settings');
const jsonfile = require('jsonfile');
const file = 'user_cache.json';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 512,
    height: 266,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  jsonfile.readFile(file, async function (err, obj) {
    if (err) console.error(err)
    let valid = await launch.Authenticator.validate(obj.access_token & 'i')
    if(true){
      global.index()
    }else{
      mainWindow.loadFile('login.html')
    }
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () =>{
  createWindow()
})
app.on('before-quit', async (e) => {  
})
global.launch = function(mem){
  launch.play(mem)
}
global.index = function(){
  mainWindow.loadFile('index.html')
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
launch.on('data', (e)=>{
  console.log(e.toString())
  if(e.toString().includes('[Client thread/INFO] [FML]: Forge Mod Loader has successfully loaded')){
  mainWindow.webContents.send('data')
  }
})
launch.on('closed', (e)=>{
  mainWindow.webContents.send('closed')
})