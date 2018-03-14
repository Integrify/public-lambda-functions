"use strict";
process.env.testing = true;
var slackLambda = require("../index.js");
var expect = require("expect")
let google = require('googleapis');
let privatekey = require("../privatekey-testing.json");
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

var created = "";


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

it("should execute and return values", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        inputs: {
        fileId:"1OvRjgUH6kPfGlCnPMH-G96OEW1b4pwAVudVrQ0lVfGk",
        newFileName: "UnitTest-" + new Date().toISOString(),
        newTitle: "UnitTest-" + new Date().toISOString(),
        anyoneWithLinkRole: "writer",
        },"integrifyServiceUrl":"http://localhost:3000"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.fileId).toExist();
        created = result;
        done();

    })

});

it("should have set the permissions on the file to 'writer'", function(done){
    this.timeout(100000);
    drive.permissions.list({auth: jwtClient, fileId: created.fileId}, function (err, perms){
        console.log(perms.data)
        let perm = perms.data.permissions.find(p => p.id === 'anyoneWithLink')
        expect(perm.role).toEqual('writer');
        done();
    });
})