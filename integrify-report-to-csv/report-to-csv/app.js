"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");
var fs = require('fs');
var path = require('path');

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
        inputs: [{key:"reportSid", type:"string"},
            {key:"csvFileName", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
}


var exec = function (event, context, callback) {
            console.info(event);

    let filterUrl = `reports/${event.inputs.reportSid}/filters`;
    let integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
    request.get(integrifyServiceUrl + '/' + filterUrl, {'auth': {
        'bearer': event.inputs.accessToken || event.accessToken
    }}, function (err, httpResponse, filters) {




        if (err) {
            console.error(err);
            return callback(err);
        }
        let parsedFilters = [];
        try {
            parsedFilters = JSON.parse(filters);
        } catch(e){
            console.log("no filters")
        }


///[{"MappingVal":"Request|ID","Expose":"ID","Value":null,"Text":null,"Operator":"Is","FieldType":"textfield","Options":null}]
        try {
            //loop though filters and populate with inputs
            parsedFilters.forEach(f=>{
                f.Value = event.inputs[f.Expose] || "";
            })

        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            return callback(error);
        }
        let reportFiltes = parsedFilters.map(f=> {
            return {
                "field": f.MappingVal,
                "data": { "type":"string", "value": f.Value,"comparison":f.Operator}
            }
        })
        reportFiltes = JSON.stringify(reportFiltes)
        console.log(reportFiltes);


        let reportRunUrl = `${integrifyServiceUrl}/core-service/reports/${event.inputs.reportSid}/export/csv_utf8?start=0&filters=${reportFiltes}`;


        request.get({url: reportRunUrl,

            'auth': {
                'bearer': event.inputs.accessToken || event.accessToken
            }},function(err1,rsp1,reportData){

            if (err1) return callback(err1);

            var req = request.post(`${integrifyServiceUrl}/api/files/temp/${event.instanceName}/upload`, {'auth': {
                'bearer': event.inputs.accessToken || event.accessToken
            }}, function (err, httpResponse, fileInfo) {
                if (err || fileInfo == 'expired token') {
                    console.error('upload failed:', err);
                    return callback(err || fileInfo);
                }
                console.log('Upload successful!  Server responded with:', fileInfo);
                let fileKey = JSON.parse(fileInfo)[0].sid;
                return callback(null, {fileKey: fileKey, fileName: event.inputs.csvFileName});

            });
            var form = req.form();
            form.append('file', reportData, {
                filename: event.inputs.csvFileName.indexOf(".") == -1 ? event.inputs.csvFileName + ".csv" : event.inputs.csvFileName,
                contentType: "text/csv"
            });
        })
    })



};

config.execute = exec;

let docx = new integrifyLambda(config);



//Export the handler function of the new object
exports.lambdaHandler = docx.handler;