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

it("should return config.helpUrl", function() {
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
    var event = { "operation": "runtime.execute",
        "inputs":{
            "phoneNumber" : "+1 919 260 6087",
            "requestId":"27484",
            "requestSid":"bdea46e9-f8f1-4ee7-a420-654ae9cbd52d",
            "requestName":"Fake Request",
            "requestStatus":"Submitted",
            "includeLink":"true",
            "message":"this is a test"

        },"integrifyServiceUrl":"http://daily.integrify.com"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.messageStatus).toExist();
        done();

    })

});