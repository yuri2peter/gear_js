const fs = require('fs');
const util = require('util');
module.exports = class {
    index(handle) {
        handle.assign('pathBase', handle.req.pathBase);
        handle.render();
        handle.end();
    }

    post(handle) {
        handle.form.encoding = 'utf-8' ;//设置表单域的编码
        handle.form.parse(handle.req, function(err, fields, files) {
            handle.dump(fields,true);
            handle.dump(files,true);

        });
        handle.form.on('file',function (name, file) {
            // handle.dump(name,true);
            // handle.dump(file,true);
        });
        handle.form.on('end',()=>{handle.end()});
    }

    ajax(handle) {
        handle.loadBody((err, body) => {
            if (err) {
                handle.end(err);
            } else {
                let data = JSON.stringify({msg: handle.bodyParser.urlencoded(body)});
                handle.end(data);
            }
        });
    }

    test(handle) {
        //base64可破！
        handle.dump(handle.gets,true);
        handle.end();
    }
};