global.PATH_GEAR=__dirname;

const gear=require ('./core/gear');
const options=require ('./configs/options');

let instance=gear.getInstance()
    .setOptions(options)
    .openServer();