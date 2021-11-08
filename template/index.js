"use strict";
const IntegrifyLambda = require('integrify-aws-lambda');

const { promisify } = require('util')
//the following is used to mock an async call

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//this is what gets called when the lambda function is triggered
const sampleHandler = async (lambdaEvent, lambdaConext) => {
    console.log(lambdaEvent.inputs.message);
    try {
     
        await delay(300);
        const myNewMessage = lambdaEvent.inputs.message + " - received by the lamda function";
        //buile a return values basedd on the config.output keys defined below
        //in this example you have {key: "newMessage, type: "string"}
        //so we build a json object like this {newMessage: "this is a string"}
        const myOutputs = {newMessage: myNewMessage};
        console.log("I will send to Integrify:", myOutputs);
        return myOutputs;
    } catch (e) {
        console.log("we have an error", e);
        return e;
    }
}

const config = {
    helpUrl: "https://help7.integrify.com",
    //the inputs expected by the handler
    inputs: [
        {key:"messages", type:"string"},
    ],
    //the outputeds returned to integriffy
    outputs:[
        {key:"newMessage", type: "string"}
    ],
    execute: sampleHandler //this defines the handler function for the integrify-aws-lambda wrapper
}

//now we wrap it with our integrify-aws-lambda wrapper
const sampleLambda = new IntegrifyLambda(config);

//Export the handler function of the new object
exports.handler = sampleLambda.handler;