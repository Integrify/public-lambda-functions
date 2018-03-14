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
        {key: "makeEditable", type:"string"},
         ],
        outputs:[{key:"permissionId", type:"string"},{key:"role", type:"string"}],
        execute: (event, context, callback) => {
            console.info(event);
            let inputs = event.inputs;

            let accessRole = "reader"
            if (inputs.makeEditable && (inputs.makeEditable.toLowerCase() === "yes" || inputs.makeEditable.toLowerCase() === "true")) {
                accessRole = "writer"
            }

            drive.permissions.list({auth: jwtClient, fileId: inputs.fileId}, function (err, perms){
                let permissions = perms.data.permissions;
                //update a permisson to remove write access

                let linkPerms = permissions.find(p => p.id === 'anyoneWithLink');
                if (linkPerms) {
                    drive.permissions.update({auth: jwtClient, fileId: inputs.fileId, permissionId: 'anyoneWithLink', resource: {role: accessRole}}, function (err, newperms){

                        if (err) {
                            console.error(err);
                            return callback(err);
                        }
                        return callback(null, newperms)

                    })
                } else {
                    drive.permissions.create({
                        auth: jwtClient, fileId: inputs.fileId, resource: {
                            value: null,
                            type: "anyone",
                            role: accessRole
                        }
                    }, function (err, newperms) {
                            if (err) {
                                console.error(err);
                                return callback(err);
                            }
                            return callback(null, newperms)

                    });
                }

            });




        }

});

//Export the handler function of the new object
exports.handler = gcopy.handler;