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
    this.timeout(100000);
    var event = {
        "operation": "runtime.execute",
        "inputs": {
            "reportSid": "17061b4f-a56b-4429-b3f1-8c75c60cd5a9",
            "csvFileName": "test"
        },
        "integrifyServiceUrl": "http://localhost:3500",
        "accessToken": "1dfbc10557a245bd97c3cad7c60cd5c5"
    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.fileKey).toExist();
        done();

    })

});