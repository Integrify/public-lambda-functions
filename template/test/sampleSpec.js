"use strict";
var sampleLambda = require("../index.js");
const expect = require('chai').expect;

//create an instance of the IntegrifyLambda with the config
describe('sample tests suite', function() {

    it("should return config.inputs", function() {
        var event = {"operation": "config.getInputs"}
        sampleLambda.handler(event, null, function(err,result){
            "use strict";
            //console.log(result)
            expect(result.length).toBeGreaterThan(0);

        })

    });

    it("should return config.helpUrl", function() {
        var event = {"operation": "config.getHelpUrl"}
        sampleLambda.handler(event, null, function(err,result){
            "use strict";
            //console.log(result)
            expect(result.length).toBeGreaterThan(0);

        })

    });

    it("should return config.outputs", function() {
        var event = {"operation": "config.getOutputs"}
        sampleLambda.handler(event, null, function(err,result){
            "use strict";
            //console.log(result)
            expect(result.length).toBeGreaterThan(0);

        })

    });



    it("should return a newMessage", async function() {
        const event = { "operation": "runtime.execute",
            "inputs":{
                "message" : "Did you reveiev this?",
            },
            "integrifyServiceUrl":"http://sample.integrify.com" //this would be automatically passed from integrofy to the lambda function in case you need to call back in

        }

        const result = await sampleLambda.handler(event, null);
        console.log('hello', result)
        
        expect(result).to.exist      


    });
})
