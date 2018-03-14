"use strict";
var integrifyLambda = require('integrify-aws-lambda');
let google = require('googleapis');
var privatekey = require("./privatekey.json");

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");

    }
});

let sheets = google.sheets('v4');
let drive  = google.drive('v3');



//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var gcopy = new integrifyLambda({
        helpUrl: "http://www.integrify.com",
        inputs: [{key:"fileId", type:"string"},
            {key:"newFileName", type:"string"},
            {key:"newTitle", type:"string"},
            {key: "makeEditable", type:"string"}],
        outputs:[{key:"fileId", type:"string"},{key:"mimeType", type:"string"},{key:"name", type:"string"},{key:"url", type:"string"}, {key:"embedlUrl", type:"string"}],
        execute: (event, context, callback) => {
            console.info(event);
            let inputs = event.inputs;
            let resource =  { name: inputs.newFileName, title: inputs.newTitle}
            drive.files.copy({auth: jwtClient,  fileId: inputs.fileId,  resource: resource}, function(err,resp2) {
                if (err) {
                    console.error(err);
                    return callback(err);
                }
                let created = resp2.data;
                let outputs = {
                    fileId: created.id,
                    mimeType: created.mimeType,
                    name: created.name,
                    url:  "https://drive.google.com/open?id=" + created.id,
                    embedUrl:  "https://drive.google.com/open?minimal=true&id=" + created.id
                }
                console.log(outputs)
                let accessRole = "reader"
                if (inputs.makeEditable && (inputs.makeEditable.toLowerCase() === "yes" || inputs.makeEditable.toLowerCase() === "true")) {
                    accessRole = "writer"
                }
                drive.permissions.create({
                    auth: jwtClient, fileId: created.id, resource: {
                        value: null,
                        type: "anyone",
                        role: accessRole
                    }
                }, function (err, perms) {
                    if (err) {
                        console.error(err);
                        return callback(err);
                    }
                    return callback(null, outputs)


                });
            });

        }

});

//Export the handler function of the new object
exports.handler = gcopy.handler;