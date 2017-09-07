//路由类
const util = require('util');
const http = require('http');
const url = require("url");
const rule = require(global.PATH_GEAR+"/routers/rule");

module.exports=class GearRouter{
    constructor(gear){
        this.gear=gear;
    }
    route(handle){
        //声明了编码(utf-8)
        handle.res.writeHeader(200,{
            'Content-Type':'text/html;charset='+this.gear.options.html_charset,
        });
        !this.gear.options.debug || handle.dump(handle.req.host+handle.req.url); //debug模式下，控制台打印请求地址

        for (let i in rule){
            let item=rule[i];
            let rel=false;
            if(
                (!item.path||item.path===handle.req.pathname) &&
                (!item.preg||item.preg.test(handle.req.pathname)) &&
                (!item.method||item.method.toLowerCase()===handle.req.method.toLowerCase())
            ){
                rel=item.handle(handle);
                !this.gear.options.debug || handle.dump('Description:'+item.desc);
            }
            if(rel===true){break;} //接收到true则终止循环
        }
    }
}