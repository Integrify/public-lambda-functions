"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [{key:"templateUrl", type:"string"},
            {key:"fileName", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
}


var exec = function (event, context, callback) {
            console.info(event);

    request({method: 'GET', url: event.inputs.templateUrl, encoding: null}, function(err, rsp, template){

        if (err) {
            console.error(err);
            return callback(err);
        }



        var zip = new JSZip(template,{binary:true});


        var doc = new Docxtemplater();
        doc.loadZip(zip);

        //set the templateVariables
        doc.setData(event.inputs);

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
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

        var buf = doc.getZip()
            .generate({type: 'nodebuffer'});


        var ext, mimeType;
        if (event.inputs.fileName.indexOf('.pptx') > -1) {
            ext = ".pptx";
            mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        } else {
            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ext = ".docx"
        }
        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        //fs.writeFileSync(path.resolve(__dirname, 'output1.docx'), buf);

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
            contentType: mimeType
        });


    })



};

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = docx.handler;