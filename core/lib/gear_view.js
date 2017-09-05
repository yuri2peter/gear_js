//视图中间件
const ejs=require('ejs');
const gear_util=require('./gear_util');

module.exports=class GearView{
    constructor(handle){
        this.handle=handle;
        this.data={};
    }

    assign(key,value){
        this.data[key]=value;
    }

    render(path){
        //修正文件位置
        path='./views'+path+'.ejs';
        //读取文件
        let that=this;
        ejs.renderFile(path, that.data, {cache:!that.handle.gear.options.debug}, function(err, str){
            if(err){
                return console.error(err);
            }else{
                that.handle.res.end(str);
            }
        });
    }

};
