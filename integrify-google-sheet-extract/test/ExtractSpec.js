"use strict";
process.env.testing = true;
var slackLambda = require("../index.js");
var expect = require("expect")
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

var exitingFileOnGoogleCloud = "1FvZZjOLeMIdyvLcVwXWSGOdqTMH1osYK4IQaYo2QqPE";





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
        spreadsheetId: exitingFileOnGoogleCloud,
        sheetName: "Sheet1",
        range: "A1:E3",
        valueSelectors: '["0,1", "0,2", "1,0"]'
        },"integrifyServiceUrl":"http://localhost:3000"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        console.log(result)
        expect(result.value_0).toExist();
        done();

    })

});

