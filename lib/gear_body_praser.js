const util = require('./gear_util');
module.exports = {
    urlencoded(body) {
        let querystring = require('querystring');
        return querystring.parse(body);
    },
    multipart(body, handle) {
        let parsed = {};
        let content_type = handle.req.headers['content-type'];
        if(!content_type){return parsed;}
        let preg = /^multipart\/form-data;\s+boundary=(.*?)$/;
        let rel = content_type.match(preg);
        if(!rel){return parsed;}
        let boundary='--'+rel[1];//获得了分隔符
        let parts=body.split(boundary);
        handle.dump(parts,true);

        //分割数据域
        for(let i in parts){
            let part_arr=parts[i].split('\r\n');
            if(part_arr.length<5){continue;}
            handle.dump(part_arr,true);
        }
        return parsed;
    },
    json(body) {
        return JSON.parse(body);
    },
    text(body) {
        return body;
    },
    raw(body) {
        return body;
    }
};