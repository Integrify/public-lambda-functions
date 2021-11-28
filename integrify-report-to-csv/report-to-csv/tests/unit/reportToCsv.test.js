import {lambdaHandler}  from "../../app.js";
import {expect}  from  'chai';
const reportSid = "f27dfb55-ef82-4504-9717-f47221a2d94f" //"33e3a4f4-5fb5-4106-9110-bc59fca5d93d"
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0R3VpZCI6IjRFOTlFMERELUIzQjMtNEQ1RC04MjZELTNENUFFNjJBMTZDRiIsImNvbnRhY3RJZCI6MSwibnRJZCI6ImlBcHByb3ZlIiwiZmlyc3ROYW1lIjoiU3lzdGVtIiwibWlkZGxlTmFtZSI6ImJvYiIsImxhc3ROYW1lIjoiU3lzdGVtIiwiZW1haWwiOiJuby1yZXBseUBpbnRlZ3JpZnkuY29tIiwicGhvbmUiOm51bGwsImxvY2F0aW9uIjpudWxsLCJhZGRyZXNzMSI6bnVsbCwiYWRkcmVzczIiOm51bGwsImNpdHkiOm51bGwsInN0YXRlIjpudWxsLCJ6aXAiOm51bGwsImNvdW50cnkiOm51bGwsInRpdGxlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJjb3N0Q2VudGVyIjpudWxsLCJkaXZpc2lvbiI6bnVsbCwicmVwb3J0c1RvR3VpZCI6bnVsbCwic2lnbmF0dXJlR3VpZCI6bnVsbCwiY0ZpZWxkMSI6bnVsbCwiY0ZpZWxkMiI6bnVsbCwibGFzdFVwZGF0ZSI6bnVsbCwibGFuZ3VhZ2VHdWlkIjoiMkE4MDNEODAtREU2RC00QURDLUE2NDItNEUzRDgzMUY1NDYwIiwidGltZXpvbmUiOiJVVEMiLCJsb2NhbGUiOiJlbi1VUyIsImNyZWF0ZWREYXRlIjoiMjAwNi0wMS0wMVQwNTowMDowMC4wMDBaIiwiY3JlYXRlZEJ5IjoiNEU5OUUwREQtQjNCMy00RDVELTgyNkQtM0Q1QUU2MkExNkNGIiwibW9kaWZpZWREYXRlIjoiMjAyMS0xMC0zMVQxODowMDowOC42MjNaIiwibW9kaWZpZWRCeSI6IkQ4QzQ2OUMzLUY3ODEtNDE3OS1BMDlDLTZEMTQ4ODg1RkIzMCIsImRlbGV0ZWREYXRlIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImNvbnRhY3RTaWQiOiI0RTk5RTBERC1CM0IzLTRENUQtODI2RC0zRDVBRTYyQTE2Q0YiLCJ1c2VyTmFtZSI6ImlBcHByb3ZlIiwicGFzc3dvcmRSZXNldERhdGUiOm51bGwsInRlbmFudCI6ImludGVncmlmeWRldiIsIm5hbWUiOiJTeXN0ZW0gU3lzdGVtIiwiaWF0IjoxNjM4MTI4ODA1LCJleHAiOjE2Mzg0ODg4MDUsImF1ZCI6ImludGVncmlmeWRldiJ9.dT1jrrWZ8y2p5GQwsNabH3LPl2IxUwVr5Rz1cq2A3KI";
//create an instance of the IntegrifyLambda with the config


it("should return config.inputs", function() {
    var event = {"operation": "config.getInputs"}
    lambdaHandler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        console.log(process.env.INTEGRIFY_ENV_TOKEN)
        expect(result.length).to.be.gt(0);

    })

});

it("should return config.outputs", async function() {
    var event = {"operation": "config.getOutputs"}
    const result = await lambdaHandler(event, null)
        //console.log(result)
    expect(result.length).to.be.gt(0);


});


it("should execute and return values", async () => {
    var event = {
        "operation": "runtime.execute",
        "inputs": {
            "reportSid": reportSid,
            "csvFileName": "test.csv",
            "Request|ID":1
        },
        "integrifyServiceUrl": "http://integrifydev.localhost:8233",
        "accessToken": accessToken,
        "instanceName" : "integrifydev"
    }

    const result = await lambdaHandler(event, null) 
      
    
    expect(result).to.exist
    expect(result.fileKey).to.exist;


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