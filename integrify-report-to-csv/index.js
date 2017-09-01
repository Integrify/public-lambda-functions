"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");
var fs = require('fs');
var path = require('path');

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [{key:"reportSid", type:"string"},
            {key:"fileName", type:"string"}, {key:"fileExtension", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
}


var exec = function (event, context, callback) {
            console.info(event);

    let filterUrl = `reports/${event.inputs.reportSid}/filters`;
    let integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
    request.get(integrifyServiceUrl + '/' + filterUrl, {'auth': {
        'bearer': event.inputs.accessToken || event.accessToken
    }}, function (err, httpResponse, filters) {




        if (err) {
            console.error(err);
            return callback(err);
        }


///[{"MappingVal":"Request|ID","Expose":"ID","Value":null,"Text":null,"Operator":"Is","FieldType":"textfield","Options":null}]
        try {
            //loop though filters and populate with inputs
            filters.forEach(f=>{
                f.Value = event.inputs[f.Expose] || "";
            })

        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            return callback(error);
        }


        let reportUrl =   integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
        var formData = {
            method   : 'POST',
            url      : 'http://127.0.0.1:3000',
            json     : true,
            formData : { file : request(downloadUrl) }
        };

        request(formData, function(err, res, body){
            if (err) throw err;
            console.log("successful");
        });


        let integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
        var req = request.post(integrifyServiceUrl + '/files/upload/', {'auth': {
            'bearer': event.inputs.accessToken || event.accessToken
             }}, function (err, httpResponse, body) {
            if (err) {
                console.error('upload failed:', err);
                return callback(err);
            }
            console.log('Upload successful!  Server responded with:', body);
            let fileKey = JSON.parse(body)[0].file;
            return callback(null, {fileKey: fileKey, fileName: event.inputs.fileName});

        });
        var form = req.form();
        form.append('file', buf, {
            filename: event.inputs.fileName,
            contentType: "text/csv"
        });


    })



};

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = docx.handler;