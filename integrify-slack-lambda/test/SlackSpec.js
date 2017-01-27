"use strict";
var slackLambda = require("../index.js");
var expect = require("expect")


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



it("should execute and return values", function(done) {
    var event = { "operation": "runtime.execute",
        "inputs":{
            "webHookURL" : "https://hooks.slack.com/services/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",
            "requestId":"1234",
            "requestSid":"e1c6082d-62cb-46d0-9a77-374ef836d49d",
            "requestName":"Fake Request",
            "requestStatus":"Submitted",
            "includeLink":"true",
            "message":"this is a test"

        },"integrifyServiceUrl":"http://localhost:3000"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.messageStatus).toExist();
        done();

    })

});