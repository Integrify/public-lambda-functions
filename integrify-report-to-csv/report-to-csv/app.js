
import integrifyLambda from 'integrify-aws-lambda';
import fetch from 'node-fetch';
import { FormData } from 'formdata-polyfill/esm.min.js'
import File from 'fetch-blob/file.js'

// //create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
let config = {
        inputs: [{key:"reportSid", type:"string"},
            {key:"csvFileName", type:"string"}],
        outputs:[{key:"fileKey", type:"fileattachment"}, {key:"fileName", type: "string"}]
}




/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object 
 * 
 */
const handler = async (event, context) => {

    try {

        const integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;


        let reportRunUrl = `${integrifyServiceUrl}/core-service/reports/${event.inputs.reportSid}/export/csv_utf8?start=0`;
        console.info("reportRunUrl", reportRunUrl) 
        const rresponse = await fetch(reportRunUrl, {method:'GET', headers: {'Authorization': 'Bearer ' + event.accessToken}})
        let reportData = await rresponse.text();
        console.log("reportdata:", reportData)
        

       const form = new FormData();
       form.append('file-upload', new File([reportData],  event.inputs.csvFileName))

        const fresponse = await fetch(`${integrifyServiceUrl}/api/files/temp/${event.instanceName}/upload`, 
            {method: 'POST', body: form, headers: {'Authorization': 'Bearer ' + event.accessToken}});
           
        const data = await fresponse.json();
        console.info('upload response', data);
        return {fileKey: data[0].sid, fileName: data[0].originalFilename}
    
        
    } catch (err) {
        console.log(err);
        return err;
    }

};
config.execute = handler;
let lambdaTask = new integrifyLambda(config)
const lambdaHandler = lambdaTask.handler;
export {lambdaHandler}