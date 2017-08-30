"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var spsave = require("spsave").spsave;
var fs = require('fs');
var path = require('path');
var map = require('map-stream')
var vfs = require('vinyl-fs');
var request = require("request")
var srcStream = require("vinyl-source-stream")

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [{key:"file", type:"string"},
            {key:"destination", type:"string"},
            {key:"sharePointUrl", type:"string"},
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

    request('http://google.com/doodle.png')
        .pipe(srcStream('doodle.png'))
        .pipe(map(function(file, callback) {
            spsave({
                siteUrl: 'https://integrify531.sharepoint.com'
            }, {username: 'rich.trusky@integrify.com', password: 'GuaCPQZCxMDG0UJR'}, {
                file: file,
                folder: 'Test'
            }).then(function (x) {
                console.log(x);
                return callback(null, {shrePointFileUrl: x});
            })
                .catch(function (err) {
                    console.error(err);
                    callback(err);
                });
        }));



};

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.handler = docx.handler;