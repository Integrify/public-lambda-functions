"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request")
var BoxSDK = require('box-node-sdk');
var fs = require ("fs");
var streamBuffers = require('stream-buffers');
var path = require("path");

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [
            {key:"requestSid", type:"string"},
            {key:"file", type:"file"},
            {key:"parentFolderId", type:"string"},
            {key:"boxClientID", type:"string"},
            {key:"boxClientSecret", type:"string"},
            {key:"publicKeyID", type:"string"},
            {key:"privateKey", type:"string"},
            {key:"passphrase", type:"string"},
            {key:"usernID", type:"string"},
            {key:"enterpriseID", type:"string"}
           ],
        outputs:[{key:"boxFileUrl", type:"string"}]
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
            console.error(err || "no files found" );
            return callback(err || "no files found");
        }


        let integrifyFile = integrifyFiles.sort(function(a,b) {
            return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime()
        }).find(f => f.FileName == event.inputs.file);

        if (!integrifyFile) {
            let em = "no matching file for this request";
            console.error(em);
            return callback(em)
        }

        //get the file from Integrify and save it to sharepoint

        let integrifyFileUrl = integrifyFile.StreamEndpoint;
        let x = request(event.integrifyServiceUrl + integrifyFileUrl,{'auth': {
            'bearer': event.inputs.accessToken || event.accessToken
        }});


        let rs = new streamBuffers.WritableStreamBuffer();

        x.pipe(rs);
// Initialize with the string


        let boxClient = getBoxClient(event.inputs);

        boxClient.files.preflightUploadFile(
            event.inputs.parentFolderId,
            {
                name: event.inputs.file,
                size: 200000000
            },
            null,
            function(err,result){
                if (err) {

                    if (err.statusCode == 409){
                        let fileID = err.response.body.context_info.conflicts.id;
                        boxClient.files.uploadNewFileVersion(fileID, rs.getContents(),  function(newErr, file){
                            if (newErr) {
                                console.error(newErr);
                                return callback(err);

                            }
                            getBoxFileUrl(boxClient,file.entries[0].id, function(gbfuErr, retval){
                                if (gbfuErr) {
                                    console.error(gbfuErr);
                                    return callback(gbfuErr);
                                }
                                return callback(null, retval);
                            })

                        })

                    } else {
                        console.error(err);
                        return callback(err);
                    }



                } else {
                    boxClient.files.uploadFile(event.inputs.parentFolderId, event.inputs.file, rs.getContents(), function(eek, file) {
                        if (eek) {
                            console.error(eek);
                            return callback(eek);

                        }
                        getBoxFileUrl(boxClient,file.entries[0].id, function(gbfuErr, retval){
                            if (gbfuErr) {
                                console.error(gbfuErr);
                                return callback(gbfuErr);
                            }
                            return callback(null, retval);
                        })


                    });
                }

            }
        );


    })



};

function getBoxFileUrl(boxClient, fileID, callback) {
    boxClient.files.getDownloadURL(fileID, null, function (error, downloadURL) {
        if (error) return callback(error);
        callback(null, {boxFileUrl: downloadURL});
    });
}


function getBoxClient(options) {
    //allow us to pass in a file
    if (options.boxAppSettingsPath) {
        let settings = require(options.boxAppSettingsPath);
        options.boxClientID = settings.boxAppSettings.clientID;
        options.clientSecret = settings.boxAppSettings.clientSecret;
        options.publicKeyID = settings.boxAppSettings.appAuth.publicKeyID;
        options.privateKey = settings.boxAppSettings.appAuth.privateKey;
        options.passphrase = settings.boxAppSettings.appAuth.passphrase;
    }
    let sdk = new BoxSDK({
        clientID: options.boxClientID,
        clientSecret: options.boxClientSecret,
        appAuth: {
            keyID: options.publicKeyID,
            privateKey: options.privateKey,
            passphrase: options.passphrase
        }
    });

// Get the service account client, used to create and manage app user accounts
    if (options.enterpriseID) {
        let serviceAccountClient = sdk.getAppAuthClient('enterprise', options.enterpriseID);
        return serviceAccountClient;
    } else {
        let appUserClient = sdk.getAppAuthClient('user', options.userID);
        return appUserClient;
    }// Get an app user client



// Get an app user client
}

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = docx.handler;