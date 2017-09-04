const gear=require ('./node_modules/gear');
const options=require ('./configs/options');
let instance=gear.getInstance()
    .setOptions(options)
    .openServer();