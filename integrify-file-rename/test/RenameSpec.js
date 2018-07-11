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

// inputs: [
//     {key:"requestSid", type:"string"},
//     {key:"file", type:"file"},
//     {key:"name_part_1", type:"string"},
//     {key:"name_part_2", type:"string"},
//     {key:"name_part_3", type:"string"},
//     {key:"name_part_4", type:"string"},
//     {key:"name_part_5", type:"string"},
//     {key:"name_part_6", type:"string"},
//     {key:"name_part_separator", type:"string"},
//     {key:"append_time_stamp", type:"string"}],
//     outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]

it("should execute and return values", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        "inputs":{
            "requestSid": "1c9b6127-4228-4202-af90-33492fe7d5aa",
            "requestId": "5012",
            "file" : "hashkey.ipml",
            "name_part_1": "newname",
            "name_part_2": "part2",
            "name_part_3": "part3",
            "name_part_4": "part4",
            "name_part_5": "part5",
            "name_part_6": "part6",
            "name_part_separator": "-",
            "append_time_stamp": "true",
        },"integrifyServiceUrl":"http://localhost:3500",
        "accessToken":"dc565383a1a947ff9ddc0e7fb0e5d52c"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        console.log(result)
        expect(result.fileKey).toExist();
        expect(result.fileName).toContain('newname-part2-part3-part4-part5-part6');
        expect(result.fileName).toContain('Z.');
        done();

    })

});