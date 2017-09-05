//debug 辅助
module.exports=class GearDebug{

    static processErrorCatch(){
        process.on('uncaughtException', this.errorHandle);
    }

    static errorHandle(err){
        console.error('An uncaught error occurred!');
        console.error(err.stack);
    }
};