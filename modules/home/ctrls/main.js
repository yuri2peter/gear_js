module.exports=class{
    constructor(handle){
        this.handle=handle
    }
    index(){
        this.handle.echo('gogogo!1',true);
    }
};