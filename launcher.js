const {
    Client,
    Authenticator
} = require('minecraft-launcher-core');
const { Version } = require('ts-minecraft');
const download = require('download');

const fs = require('fs')
const fse = require('fs-extra')
const jsonfile = require('jsonfile');
const EventEmitter = require('events').EventEmitter;
var em = new EventEmitter();
const file = 'user_cache.json';
function getPlatform(){
    switch (process.platform) {
        case 'win32':
            return 'windows'
        case 'darwin':
            return 'osx'
        default:
            return 'linux'
    }
}
var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
const refreshAuth = async () => {
    let auth = await Authenticator.getAuth('srhaviar')
    jsonfile.writeFile(file, auth, function (err) {
        if (err) console.error(err)
    })
}
const play = async (version_id, alloc) =>{
    await jsonfile.readFile(file, async function (err, obj) {
        // if (err) console.error(err)
        if(obj === undefined){
            await refreshAuth()
        }
        let valid = await Authenticator.validate(obj.access_token)
        if(valid === false){
            await refreshAuth()
        }
      })
    let meta = await Version.updateVersionMeta()
    meta = meta.versions;
    let = specific_meta = meta.find((m) => m.id === version_id)
    await Version.install('client', specific_meta, './m/');
    if(!fs.existsSync('forge.jar')){
        console.log('Downloading forge.')
        await download('https://files.minecraftforge.net/maven/net/minecraftforge/forge/1.12.2-14.23.5.2838/forge-1.12.2-14.23.5.2838-universal.jar').then(data => {
            fs.writeFileSync('forge.jar', data);
        });
    }else{
        console.log('Forge already exists.')
    }
    await download('https://github.com/HexiaLabs/sanctuary-modpack/archive/master.zip', './', {extract: true})
    await fse.copy('./sanctuary-modpack-master', './m')
    deleteFolderRecursive('./sanctuary-modpack-master')
    let opts = {
        clientPackage: null,
        authorization: jsonfile.readFileSync(file),
        root: "./m",
        forge: "forge.jar",
        os: getPlatform(),
        version: {
            number: version_id,
            type: specific_meta.type
        },
        memory: {
            max: alloc,
            min: "512"
        }
    }
    const launcher = new Client();
    launcher.launch(opts);
    // launcher.on('data', (e) => console.log(e.toString()));
    launcher.on('data', (e) => em.emit('data', e));
    launcher.on('close', (e) => em.emit('closed', e));
    launcher.on('debug', (e) => console.log(e.toString()));
    launcher.on('error', (e) => console.log(e.toString()));
};
// play('1.12.2')
module.exports = em
module.exports.play = function (mem) {
    play('1.12.2', mem)
}
module.exports.Authenticator = Authenticator