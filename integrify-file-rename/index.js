"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");


//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
    inputs: [
        {key:"requestId", type:"numeric"},
        {key:"requestSid", type:"string"},
        {key:"file", type:"file"},
        {key:"name_part_1", type:"string"},
        {key:"name_part_2", type:"string"},
        {key:"name_part_3", type:"string"},
        {key:"name_part_4", type:"string"},
        {key:"name_part_5", type:"string"},
        {key:"name_part_6", type:"string"},
        {key:"name_part_separator", type:"string"},
        {key:"append_time_stamp", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
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
        }).find(f => f.FileName == event.inputs.file);

        if (!integrifyFile) {
            let em = "no matching file for this request";
            console.error(em);
            return callback(em)
        }

        //get the file from Integrify and save it to sftp site
        let options = event.inputs;
        let fileKey = integrifyFile.FileKey;
        let fileName = integrifyFile.FileName
        let fileExtension = fileName.substr(fileName.lastIndexOf("."));

        let separator = event.inputs.name_part_separator;
        let newfilename = event.inputs['name_part_1'];
        for (let i = 2; i < 7; i++) {
            let part = event.inputs['name_part_' + i];
            if (part) {
                newfilename = newfilename + separator + part;
            }
        }
        if (event.inputs.append_time_stamp && (event.inputs.append_time_stamp.toLowerCase() == "true" ||event.inputs.append_time_stamp.toLowerCase() == "yes") ) {
            newfilename = newfilename + separator + new Date().toISOString();
        }
        newfilename += fileExtension;

        request.put(event.integrifyServiceUrl  + '/files/' + event.inputs.requestId + '/' + fileKey + '/copyandrename?new_name=' + newfilename, {'auth': {
                'bearer': event.inputs.accessToken || event.accessToken
            }, json: {new_name: newfilename}}, function (err, httpResponse, result) {
            if (err) {
                console.error('upload failed:', err);
                return callback(err);
            }
            let fileResult = result
            console.log(fileResult)
            return callback(null, {fileKey: fileResult.file, fileName: newfilename});

        });


    });




};

config.execute = exec;

let fileRename = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = fileRename.handler;