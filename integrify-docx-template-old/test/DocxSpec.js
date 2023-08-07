"use strict";
var slackLambda = require("../index.js");
const expect = require('chai').expect;


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
            "fileName":"foo",
            "fileExtension":".docx",
            "name": "joe",
            "description" : "a long winded description"
        },"integrifyServiceUrl":"http://localhost:3508/workflow/napi",
        "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0R3VpZCI6IjRFOTlFMERELUIzQjMtNEQ1RC04MjZELTNENUFFNjJBMTZDRiIsImNvbnRhY3RJZCI6MSwibnRJZCI6ImlBcHByb3ZlIiwiZmlyc3ROYW1lIjoiU3lzdGVtIiwibWlkZGxlTmFtZSI6bnVsbCwibGFzdE5hbWUiOiJTeXN0ZW0iLCJlbWFpbCI6Im5vLXJlcGx5QGludGVncmlmeS5jb20iLCJwaG9uZSI6bnVsbCwibG9jYXRpb24iOm51bGwsImFkZHJlc3MxIjpudWxsLCJhZGRyZXNzMiI6bnVsbCwiY2l0eSI6bnVsbCwic3RhdGUiOm51bGwsInppcCI6bnVsbCwiY291bnRyeSI6bnVsbCwidGl0bGUiOm51bGwsImRlcGFydG1lbnQiOm51bGwsImNvc3RDZW50ZXIiOm51bGwsImRpdmlzaW9uIjpudWxsLCJyZXBvcnRzVG9HdWlkIjpudWxsLCJzaWduYXR1cmVHdWlkIjpudWxsLCJjRmllbGQxIjpudWxsLCJjRmllbGQyIjpudWxsLCJsYXN0VXBkYXRlIjpudWxsLCJsYW5ndWFnZUd1aWQiOiIyQTgwM0Q4MC1ERTZELTRBREMtQTY0Mi00RTNEODMxRjU0NjAiLCJ0aW1lem9uZSI6IlVUQyIsImxvY2FsZSI6ImVuLVVTIiwiY3JlYXRlZERhdGUiOiIyMDA2LTAxLTAxVDA1OjAwOjAwLjAwMFoiLCJjcmVhdGVkQnkiOiI0RTk5RTBERC1CM0IzLTRENUQtODI2RC0zRDVBRTYyQTE2Q0YiLCJtb2RpZmllZERhdGUiOiIyMDIwLTA5LTAxVDAxOjEyOjE0LjI0MFoiLCJtb2RpZmllZEJ5IjoiNEU5OUUwREQtQjNCMy00RDVELTgyNkQtM0Q1QUU2MkExNkNGIiwiZGVsZXRlZERhdGUiOm51bGwsImRlbGV0ZWRCeSI6bnVsbCwiY29udGFjdFNpZCI6IjRFOTlFMERELUIzQjMtNEQ1RC04MjZELTNENUFFNjJBMTZDRiIsInVzZXJOYW1lIjoiaUFwcHJvdmUiLCJ0ZW5hbnQiOiJpbnRlZ3JpZnlkZXYiLCJuYW1lIjoiU3lzdGVtIFN5c3RlbSIsImlhdCI6MTYwNDM0MTA3MiwiZXhwIjoxNjA0MzQxNjcyLCJhdWQiOiJpbnRlZ3JpZnlkZXYifQ.jKB6eWDgedao_qPfCm5GBVCncPhicFDkxUXLEwHz3J0"

    }

    slackLambda.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.fileKey).to.exist
        done();

    })

});