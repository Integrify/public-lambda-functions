"use strict";
process.env.testing = true;
var slackLambda = require("../index.js");
const expect = require('chai').expect;
let google = require('googleapis');
let privatekey = require("../privatekey.json");
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
let drive  = google.drive('v3');

var exitingFileOnGoogleCloud = "1pT-Bl4JqPKjQx4L0lHrNEghhSpio4dOiWdZhjnxXgWo";





//create an instance of the IntegrifyLambda with the config


it("should return config.inputs", function() {
    var event = {"operation": "config.getInputs"}
    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should return config.help", function() {
    var event = {"operation": "config.getHelpUrl"}
    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should return config.outputs", function() {
    var event = {"operation": "config.getOutputs"}
    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should execute and set writer permissions file", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        inputs: {
        fileId: exitingFileOnGoogleCloud,
        makeEditable: "true",
        },"integrifyServiceUrl":"http://localhost:3000"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.role).toEqual('writer');
        done();

    })

});

it("should have set the permissions on the file to 'writer'", function(done){
    this.timeout(100000);
    drive.permissions.list({auth: jwtClient, fileId: exitingFileOnGoogleCloud}, function (err, perms){
        console.log(perms.data)
        let perm = perms.data.permissions.find(p => p.id === 'anyoneWithLink')
        expect(perm.role).toEqual('writer');
        done();
    });
})

it("should execute and set reader permissions file", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        inputs: {
            fileId: exitingFileOnGoogleCloud,
            makeEditable: "false",
        },"integrifyServiceUrl":"http://localhost:3000"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.role).toEqual('reader');
        done();

    })

});

it("should have set the permissions on the file to 'writer'", function(done){
    this.timeout(100000);
    drive.permissions.list({auth: jwtClient, fileId: exitingFileOnGoogleCloud}, function (err, perms){
        console.log(perms.data)
        let perm = perms.data.permissions.find(p => p.id === 'anyoneWithLink')
        expect(perm.role).toEqual('reader');
        done();
    });
})