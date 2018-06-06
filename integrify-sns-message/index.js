"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
try {
    let creds = require('./publicLambdaAccess.js')
    AWS.config.update(creds);
    AWS.config.update({
        region: 'us-east-1'
    });
} catch(e) {
    console.info(e)
}
AWS.config.setPromisesDependency(global.Promise);
let sns = new AWS.SNS()
const BitlyClient = require('bitly')
const bitly = BitlyClient('8cb949f4047f26a3bfd3596938cee07b1154a5c1')

var shortenUrl = async function(event) {
    try {
        return await bitly.shorten(`${event.integrifyServiceUrl}#/section-dashboard/request/${event.inputs.requestSid}`);
        //return await bitly.shorten(`http://www.integrify.com`);
    } catch(e) {
        console.error(e)
        throw e;
    }
}
//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var slack = new integrifyLambda({
        helpUrl: "https://www.integrify.com",
        inputs: [{key:"phone", type:"string"},
            {key:"requestId", type:"string"},
            {key:"requestSid", type:"string"},
            {key:"requestName", type:"string"},
            {key: "requestStatus", type:"string"},
            {key:"message", type:"string"},
            {key: "includeLink", type:"string"}],
        outputs:[{key:"messageId", type:"string"}],
        execute: async (event, context, callback) => {
            console.info(event);
            let messageBody = `Integrify Request ${event.inputs.requestId} - ${event.inputs.requestName} - ${event.inputs.requestStatus}
${event.inputs.message}
`
            let message = {};
           if (event.inputs.includeLink) {
               let shortUrl = await shortenUrl(event)

                message.text = messageBody + `View Request ${event.inputs.requestId}: ${shortUrl.data.url}`
            }

            let params = {
                Message:  message.text,
                PhoneNumber: '+1 919 260 6087',
                Subject: 'test sub'
            };
            sns.publish(params, (err, data) => {
                if (err) {
                    console.error(err)
                    return callback(err)
                }
                console.log(data);
                return callback(null, {messageId: data.MessageId})
            })

        }

});

//Export the handler function of the new object
exports.handler = slack.handler;