"use strict";
console.log('Module gear loaded.');
const util = require('util');
const http = require('http');
const url = require("url");
const GearServerHandle = require("./gear_server_handle");
const GearRouter = require("./gear_router");

require("./gear_debug").processErrorCatch(); //全局错误捕捉

module.exports=class Gear{

    static getInstance(){
        return new Gear();
    }

    //构造函数
    constructor() {
        //options缺省值
        this.options={
            port:80,
        };

        this.server=null;//存储server对象
        this.router=new GearRouter(this);//router对象实例
    }

    //配置
    setOptions(options){
        //覆盖默认配置
        for(let i in options){
            this.options[i]=options[i];
        }
        return this;
    }

    //启动http服务
    openServer(){
        this.server=http.createServer((req,res)=>{
            let handle=new GearServerHandle(this,req,res);
            this.router.route(handle);
        }).listen(this.options.port);
        console.log('Server is running on http://localhost:'+this.options.port);
        return this;
    }

    //关闭http服务
    closeServer(){
        this.server.close();
        console.log('Server was closed.');
        return this;
    }
};

