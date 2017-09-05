//请求/响应抽象类
const util = require('util');
const http = require('http');
const url = require("url");
const querystring = require('querystring');
const events = require('events');
const gear_static = require('./gear_static');

module.exports=class GearServerHandle{
    constructor(gear,req,res,callback_ready){
        //常量
        this.req=req;
        this.res=res;
        this.gear=gear;
        this.parsedUrl=url.parse(req.url, true);
        this.gets=this.parsedUrl.query;
        this.path=this.parsedUrl.path;
        this.host=this.req.headers.host;
        this.body='';
        req.on('data', function (chunk) {
            this.body += chunk;
        });
        req.on('end', function () {
            callback_ready();
        })
    }

    //调试变量
    dump(value,displayInPage=false){
        let pre=util.inspect(value);
        if(displayInPage){
            this.res.write(`<pre style="word-wrap: break-word; white-space: pre-wrap;">${pre}</pre>`);
        }else{
            console.log(value);
        }
        return pre;
    }

    echo(value,end=false){
        this.res.write(value);
        !end || this.res.end();
    }

};
