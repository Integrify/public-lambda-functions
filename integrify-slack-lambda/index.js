"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var slack = new integrifyLambda({
        inputs: [{key:"webHookURL", type:"string"},
            {key:"requestId", type:"string"},
            {key:"requestSid", type:"string"},
            {key:"requestName", type:"string"},
            {key: "requestStatus", type:"string"},
            {key:"message", type:"string"},
            {key: "includeLink", type:"string"}],
        outputs:[{key:"messageStatus", type:"string"}],
        execute: (event, context, callback) => {
            console.info(event);
            let messageBody = `Integrify Request ${event.inputs.requestId} - ${event.inputs.requestName} - ${event.inputs.requestStatus}
${event.inputs.message}
`
            let message = {};
           if (event.inputs.includeLink) {
                message.text = messageBody + `<${event.integrifyServiceUrl}#/section-dashboard/request/${event.inputs.requestSid}|view Request ${event.inputs.requestId}>`
            }

            request.post({url: event.inputs.webHookURL, json: true, body: message}, function(err, rsp, body){
                if (err) return callback(err);
                callback(null, {messageStatus: body})
            })

        }

});

//Export the handler function of the new object
exports.handler = slack.handler;