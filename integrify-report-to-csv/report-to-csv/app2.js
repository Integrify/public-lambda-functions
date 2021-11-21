
import integrifyLambda from 'integrify-aws-lambda';
import fetch from 'node-fetch';


// //create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
let config = {
        inputs: [{key:"reportSid", type:"string"},
            {key:"csvFileName", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
}


// const exec = async (event, context)  => {
//     //console.info(event);
//     return {hi: "there"};
   
// }

// config.execute = exec;



// let docx = new integrifyLambda(config);


// //Export the handler function of the new object

// const lambdaHandler = docx.handler;

// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const handler = async (event, context) => {
    try {
        // const ret = await axios(url);
        response =
            {
                message: 'hello world',
                // location: ret.data.trim()
            }
        } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
config.execute = handler;
let lambdaTask = new integrifyLambda(config)
const lambdaHandler = lambdaTask.handler;
export {lambdaHandler}