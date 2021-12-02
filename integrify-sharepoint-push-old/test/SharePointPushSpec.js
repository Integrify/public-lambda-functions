"use strict";
var slackLambda = require("../index.js");
const expect = require('chai').expect;


//create an instance of the IntegrifyLambda with the config


it("should return config.inputs", function() {
    var event = {"operation": "config.getInputs"}
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

// inputs: [{key:"file", type:"string"},
//     {key:"sharePointUrl", type:"string"},
//     {key:"destinationFolder", type:"string"},
//     {key:"userName", type:"string"},
//     {key:"password", type:"string"},
//     {key:"checkin", type:"string"},
//     {key:"checkinType", type:"string"},
//     {key: "'metaData", type: "string"}],
//     outputs:[{key:"sharePointFileUrl", type:"string"}

it("should execute and return values", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        "inputs":{
            "requestSid": "33581110-7424-45d0-bd18-a4ee9df0d419",
            "file" : "2014-04-16T19-00-17.386Z.json",
            "sharePointUrl":"https://yourcompany.sharepoint.com",
            "destinationFolder":"Shared Documents/Test",
            "username": "blah",
            "password" : "blah"
        },"integrifyServiceUrl":"http://localhost:3500",
        "accessToken":"20e22223855e4a5ab0e6c17e2b49d409"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.sharePointFileUrl).to.exist
        done();

    })

});