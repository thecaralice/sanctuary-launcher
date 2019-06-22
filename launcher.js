const {
    Client,
    Authenticator
} = require('minecraft-launcher-core');
const { Version } = require('ts-minecraft');
const download = require('download');
var fetch = require("node-fetch");
const fs = require('fs')
const fse = require('fs-extra')
const jsonfile = require('jsonfile');
const EventEmitter = require('events').EventEmitter;
var em = new EventEmitter();
const file = 'user_cache.json';
const version = './.minecraft/version.json';
const forge_link = 'https://files.minecraftforge.net/maven/net/minecraftforge/forge/1.12.2-14.23.5.2838/forge-1.12.2-14.23.5.2838-universal.jar'
const github = 'https://github.com/HexiaLabs/sanctuary-modpack'
const version_url = 'https://raw.githubusercontent.com/HexiaLabs/sanctuary-modpack/master/version.json'
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
const downloadModpack = async () => {
    await download(`${github}/archive/master.zip`, './', {extract: true})
    await fse.copy('./sanctuary-modpack-master', './.minecraft')
    await fse.emptyDir('./sanctuary-modpack-master')
    await fse.remove('./sanctuary-modpack-master')
}
const play = async (version_id, alloc) =>{
    let meta = await Version.updateVersionMeta()
    meta = meta.versions;
    let = specific_meta = meta.find((m) => m.id === version_id)
    await Version.install('client', specific_meta, './.minecraft');
    if(!fs.existsSync('forge.jar')){
        console.log('Downloading forge.')
        await download(forge_link).then(data => {
            fs.writeFileSync('forge.jar', data);
        });
    }else{
        console.log('Forge already exists.')
    }
    let current_ver = (fs.existsSync(version)) ? jsonfile.readFileSync(version) : {id: 'null'}
    let new_ver = await fetch(version_url)
    new_ver = await new_ver.json()
    if(current_ver.id != new_ver.id){
        await downloadModpack()
    }

    let opts = {
        clientPackage: null,
        authorization: jsonfile.readFileSync(file),
        root: "./.minecraft",
        forge: "forge.jar",
        os: getPlatform(),
        version: {
            number: version_id,
            type: specific_meta.type
        },
        memory: {
            max: alloc,
            min: "1024"
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