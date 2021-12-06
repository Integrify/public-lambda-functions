
import integrifyLambda from 'integrify-aws-lambda';
import {spsave} from "spsave"

import map from 'map-stream'
import fetch from 'node-fetch';
import buffStream from "vinyl-source-buffer"
// import {Transform,Readable, Writable} from "stream";
// const pass = new Transform();


// //create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
let config = {
    helpUrl: "http://www.integrify.com",
    inputs: [
        {key:"requestSid", type:"string"},
        {key:"file", type:"file"},
        {key:"sharePointUrl", type:"string"},
        {key:"destinationFolder", type:"string"},
        {key:"username", type:"string"},
        {key:"password", type:"string"},
        {key:"fba", type:"bool"},
        {key:"checkin", type:"bool"},
        {key:"checkinType", type:"string"},
        {key:"checkinMessage", type:"string"}],
    outputs:[{key:"sharePointFileUrl", type:"string"}]
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
        const filesEndpint = `${integrifyServiceUrl}/api/instance/${event.inputs.requestSid}/files`
        const filesResp = await fetch(filesEndpint, {method:'GET', headers: {'Authorization': 'Bearer ' + event.accessToken}})
        let integrifyFiles = await filesResp.json();

        if (integrifyFiles.length == 0) {
            console.error(err || "no files found" );
            return "no files found";
        }

    
        let integrifyFile = integrifyFiles.sort(function(a,b) {
            return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        }).find(f => f.fileName == event.inputs.file);

        if (!integrifyFile) {
            let em = "no matching file for this request";
            console.error(em);
            return em
        }
    
        //get the file from Integrify and save it to sharepoint
        let creds = {username: event.inputs.userName , password: event.inputs.password };
        let siteUrl = event.inputs.sharePointUrl ;

        let integrifyFileUrl = integrifyFile.downloadLink;
        const x = await fetch(event.integrifyServiceUrl + integrifyFileUrl, {method: 'GET', headers: {'Authorization': 'Bearer ' + event.accessToken}});

        let spSaveCoreOpts = {
            siteUrl: event.inputs.sharePointUrl
        }
        spSaveCoreOpts.checkin = event.inputs.checkin || false;
        if(spSaveCoreOpts.checkin) {
            spSaveCoreOpts.checkinType = event.inputs.checkinType || 0;
            spSaveCoreOpts.checkinMessage = event.inputs.checkinMessage || "uploaded from Integrify";
        }
    
    
    
        spSaveCoreOpts.checkin = event.inputs.checkin || false;
        spSaveCoreOpts.checkin = event.inputs.checkin || false;

        let file;
        const spresult = await spsave(spSaveCoreOpts, {username: event.inputs.username, password: event.inputs.password}, {
            fileContent: new Buffer(await x.arrayBuffer()),
            fileName:event.inputs.file,
            folder: event.inputs.destinationFolder
        })
        console.log(spresult);
     
        let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.destinationFolder + "/" + event.inputs.file;
    

        const result = {sharePointFileUrl: spUrl}
    
        return result;
               

             
        
        
    } catch (err) {
        console.log(err);
        return err;
    }

};

config.execute = handler;
let lambdaTask = new integrifyLambda(config)
const lambdaHandler = lambdaTask.handler;
export {lambdaHandler}