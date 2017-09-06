//视图中间件
const ejs=require('ejs');
const gear_util=require('./gear_util');

module.exports=class GearView{
    constructor(handle){
        this.handle=handle;
        this.data={};
    }

    assign(key,value){
        if(typeof (key)==='object'){
            for(let i in key){
                this.data[i]=key[i];
            }
        }else{
            this.data[key]=value;
        }
    }

    render(path){
        let that=this;
        //读取文件
        ejs.renderFile(path, that.data, {cache:!that.handle.gear.options.debug}, function(err, str){
            if(err){
                return console.error(err);
            }else{
                that.handle.res.end(str);
            }
        });
    }

};
