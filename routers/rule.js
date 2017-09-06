const fs = require("fs");
const GearStatic = require(global.PATH_GEAR+'/lib/gear_static');
const GearView = require(global.PATH_GEAR+'/lib/gear_view');
const gear_util=require(global.PATH_GEAR+'/lib/gear_util');

module.exports=[
    {
        'desc':'默认网站图标',
        'path':'/favicon.ico',
        'handle':handle=>{
            fs.readFile('./public/favicon.ico', function (err, data) {
                if (err) {
                    handle.res.writeHeader(404,{});
                    handle.echo('Can not find file favicon.ico in this website.');
                }else{
                    handle.res.writeHeader(200,{
                        'Content-Type':'application/x-ico'
                    });
                    handle.echo(data,true);
                }
            });
            return true;
        }
    },
    {
        'desc':'静态资源',
        'preg':/^\/public\//,
        'handle':handle=>{
            let gearStatic=new GearStatic(handle);
            gearStatic.response('.'+handle.req.pathname);
            return true;
        }
    },
    {
        "desc":"默认路由规则",
        preg:/.*?/,
        'handle':handle=>{
            //解析出 module/ctrl/action
            let paths=gear_util.skipEmptyElementForArray(handle.req.pathname.split('/'));
            switch (paths.length){
                case 0:
                    handle.req.moduleName='home';
                    handle.req.ctrlName='main';
                    handle.req.actionName='index';
                    break;
                case 1:
                    handle.req.moduleName=paths[0];
                    handle.req.ctrlName='main';
                    handle.req.actionName='index';
                    break;
                case 2:
                    handle.req.moduleName=paths[0];
                    handle.req.ctrlName=paths[1];
                    handle.req.actionName='index';
                    break;
                default:
                    handle.req.moduleName=paths[0];
                    handle.req.ctrlName=paths[1];
                    handle.req.actionName=paths[2];
                    break;
            }
            handle.runCtrl();
            return true;
        }
    },
    {
        "desc":"404 not found.",
        preg:/.*?/,
        'handle':handle=>{
            handle.res.writeHeader(404,{});
            handle.echo('404 not found.',true);
            return true;
        }
    },
];