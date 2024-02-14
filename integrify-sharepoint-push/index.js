import integrifyLambda from 'integrify-aws-lambda';
import {spsave} from 'spsave';
//import map from 'map-stream';
//import {request} from 'undici';
import fetch from 'node-fetch';
//import buffStream from "vinyl-source-buffer";

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
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

const handler = async (event, context) => {
            console.info(event);
//try {
    //get a list of files from integrify for the request using the REST API
    //files/instancelist/:instance_sid
    const integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
    const accessToken = event.inputs.accessToken || event.accessToken;
    const filesEndpoint = `${integrifyServiceUrl}/files/instancelist/${event.inputs.requestSid}`;
    console.info('getting files from Integrify',filesEndpoint);
    const filesResp = await fetch(filesEndpoint, {method:'GET',headers:{'Authorization': 'Bearer ' + accessToken}});
    //const {statusCode,headers,body} = await fetch(filesEndpoint, {method:'GET',headers: {'Authorization': 'Bearer ' + accessToken}});
        
            let integrifyFiles = await filesResp.json();

            if (integrifyFiles.length == 0) {
               console.error(err || "no files found" );
                return callback(err || "no files found");
            } else {
                console.info('got files');
            }

            let integrifyFile = integrifyFiles.sort(function(a,b) {
                return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime();
            }).find(f => f.FileName == event.inputs.file);

            if (!integrifyFile) {
                let em = "no matching file for this request";
                console.error(em);
                return em;
            }

            //get the file from Integrify and save it to sharepoint
            let creds = {username: event.inputs.userName , password: event.inputs.password };
            let siteUrl = event.inputs.sharePointUrl;

            let integrifyFileUrl = integrifyFile.StreamEndpoint;
            const x = await fetch(event.integrifyServiceUrl + integrifyFileUrl, {method: 'GET', headers: {'Authorization': 'Bearer ' + accessToken}});
            //const {statusCode2,headers2,x} = await request(integrifyServiceUrl + integrifyFileUrl, {method: 'GET', headers: {'Authorization': 'Bearer ' + accessToken}});
            //let x = request(event.integrifyServiceUrl + integrifyFileUrl,{'auth': {'bearer': event.inputs.accessToken || event.accessToken}});

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
            });
            console.log(spresult);
     
            let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.destinationFolder + "/" + event.inputs.file;
    
            const result = {sharePointFileUrl: spUrl};
            return result;

//} catch (err) {
//    console.log(err);
//    return err;
//}

};

config.execute = handler;
let lambdaTask = new integrifyLambda(config);
const lambdaHandler = lambdaTask.handler;
export {lambdaHandler};