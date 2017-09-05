const fs = require("fs");
const GearStatic = require(global.PATH_GEAR+'/core/lib/gear_static');
const GearView = require(global.PATH_GEAR+'/core/lib/gear_view');
const gear_util=require(global.PATH_GEAR+'/core/lib/gear_util');

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
                    handle.echo(data);
                    handle.res.end('');//end
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
            gearStatic.response('.'+handle.path);
            return true;
        }
    },
    {
        "desc":"默认路由规则",
        preg:/.*?/,
        'handle':handle=>{
            //解析出 module/ctrl/action
            let paths=gear_util.skipEmptyElementForArray(handle.path.split('/'));
            let module,ctrl,action;
            switch (paths.length){
                case 0:
                    module='home';
                    ctrl='main';
                    action='index';
                    break;
                case 1:
                    module=paths[0];
                    ctrl='main';
                    action='index';
                    break;
                case 2:
                    module=paths[0];
                    ctrl=paths[1];
                    action='index';
                    break;
                default:
                    module=paths[0];
                    ctrl=paths[1];
                    action=paths[2];
                    break;
            }
            let controller=null;
            let require_path=global.PATH_GEAR+'/modules/'+module+'/ctrls/'+ctrl;
            try {
                //尝试实例化控制器
                !handle.gear.options.debug|| delete require.cache[require.resolve(require_path)];
                let CtrlClass=require(require_path);
                controller=new CtrlClass(handle);
                (controller[action])();//运行方法
            }catch (e){
                console.log(e);
                !handle.gear.options.debug|| console.log('404:'+require_path);
                handle.res.writeHeader(404,{});
                handle.echo('404 not found.',true);
            }
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