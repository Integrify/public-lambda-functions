"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");


//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [
            {key:"requestSid", type:"string"},
            {key:"files", type:"file"},
            {key:"sftpHost", type:"string"},
            {key:"port", type:"number"},
            {key: "path", type: "string"},
            {key:"username", type:"string"},
            {key:"password", type:"string"},
            {key:"zippedFileName", type:"string"}],
        outputs:[{key:"success", type:"string"}]
}


var exec = function (event, context, callback) {
            console.info(event);

    //get a list of files from integrify for the request using the REST API
    //files/instancelist/:instance_sid

    request.get(event.integrifyServiceUrl + '/files/instancelist/' + event.inputs.requestSid, {'auth': {
        'bearer': event.inputs.accessToken || event.accessToken
    }}, function (err, httpResponse, body) {

        let integrifyFiles = JSON.parse(body);
        if (err || integrifyFiles.length == 0) {
            console.error(err || "no files found");
            return callback(err || "no files found");
        }


        let integrifyFile = integrifyFiles.sort(function (a, b) {
            return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime()
        }).find(f => f.FileName == event.inputs.files);

        if (!integrifyFile) {
            let em = "no matching file for this request";
            console.error(em);
            return callback(em)
        }

        //get the file from Integrify and save it to sftp site
        let options = event.inputs;
        let integrifyFileUrl = integrifyFile.StreamEndpoint;
        request(event.integrifyServiceUrl + integrifyFileUrl, {
            'auth': {
                'bearer': event.inputs.accessToken || event.accessToken
            }
        }, function (err, rsp, fbody) {

            if (err) {
                return callback(err);
            }
            if (body === 'Permission to run denied') {
                return callback('Permission Denied');
            }

            var filename = rsp.headers['content-disposition']
                .split('; ')[1]
                .replace('filename=', '')
                .replace(/"/g, '');

            //do sftp

            //SFTP.prototype.writeFile = function(path, data, encoding, cb)

            var Connection = require('ssh2').Client;

            var c = new Connection();
            c.on('ready', function () {
                console.log('ssh connection ready');
                c.sftp(function (err, sftp) {
                    if (err) {
                        throw err;
                    }
                    sftp.on('end', function () {
                    });
                    var saveto = filename;
                    if (options.path && options.path != '') {

                        if (
                            options.path.indexOf(
                                '/',
                                options.path.length - 1
                            ) === -1
                        ) {
                            saveto = '/' + saveto;
                        }

                        saveto = options.path + saveto;
                    }

                    console.log('writing file to: ' + saveto);
                    sftp.writeFile(saveto, rsp.body, function (err, resp) {
                        if (err) {
                            throw err;
                        }
                        console.log('sftp writeFile complete');

                        c.end();

                    });
                });
            });
            c.on('error', function (err) {
                console.error(err);
                return callback(err);
            });
            c.on('end', function () {
                console.log('ssh connection ended');
                return callback(null, {success: true});
            });
            c.on('close', function (had_error) {
                console.log('ssh connection closed');

            });
            c.connect({
                host: options.sftpHost,
                port: options.port || 22,
                username: options.username,
                password: options.password
            });


        });
    });




};

config.execute = exec;

let sftp = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = sftp.handler;