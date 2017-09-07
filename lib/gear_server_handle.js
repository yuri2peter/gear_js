//请求/响应抽象类
const util = require('util');
const http = require('http');
const url = require("url");
const events = require('events');
const gear_static = require('./gear_static');
const formidable = require('formidable');
const GearView=require('./gear_view');

module.exports=class GearServerHandle{
    constructor(gear,req,res){
        //常量
        this.req=req;
        this.res=res;
        this.gear=gear;
        this.util=require('./gear_util');
        this._parsedUrl=url.parse(req.url, true);
        this.req.gets=this._parsedUrl.query;
        this.req.pathname=this._parsedUrl.pathname;
        this.req.host=this.req.headers.host;
        this.req.pathBase='/';
        this.req.body='';
        this.req.moduleName='';
        this.req.ctrlName='';
        this.req.actionName='';
        this._view=new GearView(this); //默认的视图对象

        let form = new formidable.IncomingForm();
        form.uploadDir = "./runtime/temp"; //自定义上传文件夹
        form.multiples = true; //支持多文件上传
        this.form=form;
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

    inspect(value){
        return util.inspect(value)
    }

    echo(value){
        this.res.write(value);
    }

    end(value){
        this.res.end(value)
    }

    loadBody(callback,maxSize=2048){
        let body_chunks=[];
        let size=0;
        let that=this;
        let err=null;
        let contact=()=>{
            that.req.body=Buffer.concat(body_chunks);
        };
        let onData=chunk=>{
            body_chunks .push( chunk);
            size+=chunk.length;
            if(size>maxSize*1024){
                err=`Data length exceeded limit(${maxSize} KB).`;
                that.req.removeListener('data',onData); //移除事件;
                that.req.removeListener('end',onEnd); //移除事件;
                contact();
                callback(err,that.req.body);
            }
        };
        let onEnd=()=>{
            contact();
            callback(err,that.req.body);
        };
        this.req.on('data',onData);
        this.req.on('end', onEnd)
    }

    runCtrl(handle){
        //执行控制器
        let handle_action=()=>{handle.end()};
        let require_path=global.PATH_GEAR+'/modules/'+this.req.moduleName+'/ctrls/'+this.req.ctrlName;
        let controller=null;

        try {
            //尝试实例化控制器
            !this.gear.options.debug|| delete require.cache[require.resolve(require_path)];
            let CtrlClass=require(require_path);
            this.req.pathBase='/'+this.req.moduleName+'/'+this.req.ctrlName+'/'+this.req.actionName;
            controller=new CtrlClass(this);
            handle_action=controller[this.req.actionName];
            if(!handle_action){
                throw new Error('Can not find action.');
            }
        }catch (e){
            console.log(e);
            !this.gear.options.debug|| console.log('404:'+require_path);
            this.res.writeHeader(404,{});
            this.end('404 not found.');
        }
        handle_action(this);
    }

    assign(key,value){
        this._view.assign(key,value);
    }

    render(pathname=''){
        pathname=this.getFullPathname(pathname);
        pathname=this.util.skipEmptyElementForArray(pathname.split('/'));
        let file=`./modules/${pathname[0]}/views/${pathname[1]}/${pathname[2]}.ejs`;
        this._view.render(file);
    }

    //可以把相对的pathname改为绝对的pathname
    getFullPathname(pathname){
        pathname=this.util.skipEmptyElementForArray(pathname.split('/'));
        let pathnameFull='';
        let m=this.req.moduleName;
        let c=this.req.ctrlName;
        let a=this.req.actionName;
        switch (pathname.length){
            case 0:
                pathnameFull=`/${m}/${c}/${a}`;
                break;
            case 1:
                pathnameFull=`/${m}/${c}/${pathname[0]}`;
                break;
            case 2:
                pathnameFull=`/${m}/${pathname[0]}/${pathname[1]}`;
                break;
            default:
                pathnameFull=`/${pathname[0]}/${pathname[1]}/${pathname[2]}`;
                break;
        }
        return pathnameFull;
    }

};
