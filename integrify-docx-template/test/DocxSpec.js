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
            "templateUrl" : "https://s3.amazonaws.com/integrify/DEV/test-template.docx",
            "fileName":"foo.docx",
            "name": "joe",
            "description" : "a long winded description"
        },"integrifyServiceUrl":"http://localhost:3500",
        "accessToken":"20e22223855e4a5ab0e6c17e2b49d409"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.fileKey).toExist();
        done();

    })

});