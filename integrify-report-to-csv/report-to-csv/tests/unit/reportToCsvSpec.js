"use strict";
var slackLambda = require("../../app.js");
const expect = require('chai').expect;
const reportSid = "33e3a4f4-5fb5-4106-9110-bc59fca5d93d"
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0U2lkIjoiNEU5OUUwREQtQjNCMy00RDVELTgyNkQtM0Q1QUU2MkExNkNGIiwidXNlck5hbWUiOiJpQXBwcm92ZSIsInRlbmFudCI6ImludGVncmlmeWRldiIsImVtYWlsIjoibm8tcmVwbHlAaW50ZWdyaWZ5LmNvbSIsIm5hbWUiOiJTeXN0ZW0gU3lzdGVtIiwiaWF0IjoxNjM3MjU1MjgyLCJleHAiOjE2MzcyNTU4ODIsImF1ZCI6ImludGVncmlmeWRldiJ9.0ha7avVsSkDefNsb09CYaRMRVHZBgCa8hIFyVqLQ7Vk"
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
            "reportSid": reportSid,
            "csvFileName": "test"
        },
        "integrifyServiceUrl": "http://integrifydev.localhost:8233",
        "accessToken": accessToken,
        "instanceName" : "integrifydev"
    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.fileKey).to.exist
        done();

    })

});

// it("should execute with filters and return values", function(done) {
//     this.timeout(100000);
//     var event = {
//         "operation": "runtime.execute",
//         "inputs": {
//             "reportSid": reportSid,
//             "csvFileName": "test",
//             "ID": 584
//         },
//         "integrifyServiceUrl": "http://integrifydev.localhost:8233",
//         "accessToken": accessToken,
//         "instanceName" : "integrifydev"
//     }

//     slackLambda.handler(event, null, function(err,result){
//         "use strict";
//         //console.log(result)
//         expect(result.fileKey).to.exist
//         done();

//     })

// });