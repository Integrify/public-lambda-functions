"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var spsave = require("spsave").spsave;
var fs = require('fs');
var path = require('path');
var map = require('map-stream')
var vfs = require('vinyl-fs');
var request = require("request")

var buffStream = require("vinyl-source-buffer")

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        helpUrl: "http://www.integrify.com",
        inputs: [
            {key:"requestSid", type:"string"},
            {key:"file", type:"file"},
            {key:"sharePointUrl", type:"string"},
            {key:"destinationFolder", type:"string"},
            {key:"username", type:"string"},
            {key:"password", type:"string"},
            {key:"fba", type:"bool"},
            {key:"checkin", type:"bool"},
            {key:"checkinType", type:"string"},
            {key:"checkinMessage", type:"string"}],
        outputs:[{key:"sharePointFileUrl", type:"string"}]
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
        let creds = {username: event.inputs.userName , password: event.inputs.password };
        let siteUrl = event.inputs.sharePointUrl ;

        let integrifyFileUrl = integrifyFile.StreamEndpoint;
        let x = request(event.integrifyServiceUrl + integrifyFileUrl,{'auth': {
            'bearer': event.inputs.accessToken || event.accessToken
        }});

        let spSaveCoreOpts = {
            siteUrl: event.inputs.sharePointUrl
        }
        spSaveCoreOpts.checkin = event.inputs.checkin || false;
        if(spSaveCoreOpts.checkin) {
            spSaveCoreOpts.checkinType = event.inputs.checkinType || 0;
            spSaveCoreOpts.checkinMessage = event.inputs.checkinMessage || "uploaded from Integrify";
        }



        spSaveCoreOpts.checkin = event.inputs.checkin || false;
        spSaveCoreOpts.checkin = event.inputs.checkin || false;
        x.pipe(buffStream(event.inputs.file))
            .pipe(map(function(file, done) {
                spsave(spSaveCoreOpts, {username: event.inputs.username, password: event.inputs.password}, {
                    file: file,
                    folder: event.inputs.destinationFolder
                }).then(function (x) {
                    console.log(x);
                    let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.destinationFolder + "/" + event.inputs.file;
                    callback(null, {sharePointFileUrl: spUrl});

                }).catch(function (err) {
                    console.error(err);
                    callback(err);

                }).finally(function(){
                    return done();
                })
            }));

    })

    //then, get the file based on event.inputs.questionId




    // spsave({
    //         siteUrl: siteUrl,
    //         checkin: true,
    //         checkinType: 1
    //     },
    //     creds, {
    //         folder: event.inputs.destinationFolder ,
    //         // fileName: event.inputs.destinationFile ,
    //         // fileContent: 'hello world'
    //         glob: 'integrify-sharepoint-push/package.json'
    //     }).then(result => {
    //         let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.detinationFolder + "/" + event.inputs.detinationFile;
    //         return callback(null, {sharePointFileUrl:spUrl})
    // }).catch(e =>{
    //     console.log(e);
    //     return callback(e);
    // })


};

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = docx.handler;