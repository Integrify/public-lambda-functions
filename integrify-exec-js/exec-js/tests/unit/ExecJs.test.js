import {lambdaHandler}  from "../../app.js";
import {expect}  from  'chai';

let accessToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0R3VpZCI6IjRFOTlFMERELUIzQjMtNEQ1RC04MjZELTNENUFFNjJBMTZDRiIsImNvbnRhY3RJZCI6MSwibnRJZCI6ImlBcHByb3ZlIiwiZmlyc3ROYW1lIjoiU3lzdGVtIiwibWlkZGxlTmFtZSI6ImJvYiIsImxhc3ROYW1lIjoiU3lzdGVtIiwiZW1haWwiOiJuby1yZXBseUBpbnRlZ3JpZnkuY29tIiwicGhvbmUiOm51bGwsImxvY2F0aW9uIjpudWxsLCJhZGRyZXNzMSI6bnVsbCwiYWRkcmVzczIiOm51bGwsImNpdHkiOm51bGwsInN0YXRlIjpudWxsLCJ6aXAiOm51bGwsImNvdW50cnkiOm51bGwsInRpdGxlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJjb3N0Q2VudGVyIjpudWxsLCJkaXZpc2lvbiI6bnVsbCwicmVwb3J0c1RvR3VpZCI6bnVsbCwic2lnbmF0dXJlR3VpZCI6bnVsbCwiY0ZpZWxkMSI6bnVsbCwiY0ZpZWxkMiI6bnVsbCwibGFzdFVwZGF0ZSI6bnVsbCwibGFuZ3VhZ2VHdWlkIjoiMkE4MDNEODAtREU2RC00QURDLUE2NDItNEUzRDgzMUY1NDYwIiwidGltZXpvbmUiOiJVVEMiLCJsb2NhbGUiOiJlbi1VUyIsImNyZWF0ZWREYXRlIjoiMjAwNi0wMS0wMVQwNTowMDowMC4wMDBaIiwiY3JlYXRlZEJ5IjoiNEU5OUUwREQtQjNCMy00RDVELTgyNkQtM0Q1QUU2MkExNkNGIiwibW9kaWZpZWREYXRlIjoiMjAyMS0xMC0zMVQxODowMDowOC42MjNaIiwibW9kaWZpZWRCeSI6IkQ4QzQ2OUMzLUY3ODEtNDE3OS1BMDlDLTZEMTQ4ODg1RkIzMCIsImRlbGV0ZWREYXRlIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImNvbnRhY3RTaWQiOiI0RTk5RTBERC1CM0IzLTRENUQtODI2RC0zRDVBRTYyQTE2Q0YiLCJ1c2VyTmFtZSI6ImlBcHByb3ZlIiwicGFzc3dvcmRSZXNldERhdGUiOm51bGwsInRlbmFudCI6ImludGVncmlmeWRldiIsIm5hbWUiOiJTeXN0ZW0gU3lzdGVtIiwiaWF0IjoxNjM4ODAyNDcxLCJleHAiOjEwMDE2Mzg4MDI0NzAsImF1ZCI6ImludGVncmlmeWRldiJ9.J50xqLAhftsQM18VjjaFP_3jDpfg8lmDzKR7p34UvOo"

//create an instance of the IntegrifyLambda with the config


it("should return config.inputs", function() {
    var event = {"operation": "config.getInputs"}
    lambdaHandler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should return config.outputs", function() {
    var event = {"operation": "config.getOutputs"}
    lambdaHandler(event, null, function(err,result){
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

it("should execute and return values", async function() {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        "inputs":{
            "requestSid": "7187C132-C33C-4132-88CF-ACF3AEB5D9D3",
            "file" : "example1.html",
            "sharePointUrl":"https://integrify531.sharepoint.com/",
            "destinationFolder":"Shared Documents/testing",
            "username": "rich.trusky@integrify.com",
            "password" : "5ysc6ZUdX5sxpQ"
        },"integrifyServiceUrl":"http://integrifydev.localhost:8233",
        "accessToken": accessToken

    }

    let result = await lambdaHandler(event, null);

        //console.log(result)
    expect(result.sharePointFileUrl).to.exist
   
    

});