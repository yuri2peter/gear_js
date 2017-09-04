"use strict";
const fs = require("fs");

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
        'desc':'测试主页',
        'path':'/index.html',
        'preg':/^\/index\.html$/,
        'handle':handle=>{
            fs.readFile('./views/index.html', function (err, data) {
                if (err) {
                    return console.error(err);
                }else{
                    handle.echo(data);
                    handle.res.end('');//end
                }
            });
            return true;
        },
    },
    {
        "desc":"404 not found.",
        preg:/.*?/,
        'handle':handle=>{
            handle.res.writeHeader(404,{});
            handle.echo('404 not found.');
            handle.res.end('');//end
            return true;
        }
    },
];