"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var request = require("request");

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var slack = new integrifyLambda({
        inputs: [{key:"fileId", type:"string"},
            {key:"newFileName", type:"string"},
            {key:"newTitle", type:"string"},
            {key:"requestName", type:"string"},
            {key: "anyoneWithLinkRole", type:"string"},
            {key: "includeLink", type:"string"}],
        outputs:[{key:"id", type:"string"},{key:"mimeType", type:"string"},{key:"name", type:"string"},{key:"url", type:"string"}, {key:"minimalUrl", type:"string"}],
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