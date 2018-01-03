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

// inputs: inputs: [
// {key:"requestSid", type:"string"},
// {key:"files", type:"file"},
// {key:"sftpHost", type:"string"},
// {key: "path", type: "string"},
// {key:"username", type:"string"},
// {key:"password", type:"string"},
// {key:"zippedFileName", type:"string"}],
// outputs:[{key:"success", type:"bool"}]

it("should execute and return values", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        "inputs":{
            "requestSid": "912bea6f-3e86-4d65-9e05-add3c552d538",
            "files" : "submit-error1.PNG",
            "sftpHost":"127.0.0.1",
            "port":22,
            "path":"_TEMP",
            "username": "rich",
            "password" : "Nagshead1"
        },"integrifyServiceUrl":"http://localhost:3500",
        "accessToken":"0755c40b4d934bfa9b0a93f3c752d5c4"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.success).toExist();
        done();

    })

});