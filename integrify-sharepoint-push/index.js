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
        inputs: [{key:"file", type:"string"},
            {key:"sharePointUrl", type:"string"},
            {key:"destinationFile", type:"string"},
            {key:"destinationFolder", type:"string"},
            {key:"userName", type:"string"},
            {key:"password", type:"string"},
            {key:"checkin", type:"string"},
            {key:"checkinType", type:"string"},
            {key: "'metaData", type: "string"}],
        outputs:[{key:"sharePointFileUrl", type:"string"}]
}


var exec = function (event, context, callback) {
            console.info(event);



    let creds = {username: event.inputs.userName , password: event.inputs.password };
    let siteUrl = event.inputs.sharePointUrl ;

    let x = request({url: 'http://www.integrify.com/wp-content/themes/integrify/images/logo.png'});

    x.pipe(buffStream('logo.png'))
        .pipe(map(function(file, callback) {
            spsave({
                siteUrl: 'https://integrify531.sharepoint.com'
            }, {username: 'rich.trusky@integrify.com', password: 'GuaCPQZCxMDG0UJR'}, {
                file: file,
                folder: event.inputs.destinationFolder
            }).then(function (x) {
                console.log(x);
                return callback(null, {shrePointFileUrl: x});
            })
                .catch(function (err) {
                    console.error(err);
                    callback(err);
                });
        }));

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