"use strict";
var integrifyLambda = require('integrify-aws-lambda');
var spsave = require("spsave").spsave;
//var fs = require('fs');
//var path = require('path');
var map = require('map-stream')
var vfs = require('vinyl-fs');
//var request = require("request")
var fetch = require('node-fetch');
var buffStream = require("vinyl-source-buffer")

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var config = {
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


var handler = async (event, context) => {
            //console.info(event);
try {
    //get a list of files from integrify for the request using the REST API
    //files/instancelist/:instance_sid
    const integrifyServiceUrl = event.inputs.integrifyServiceUrl || event.integrifyServiceUrl;
    const accessToken = event.inputs.accessToken || event.accessToken;
    const filesEndpint = `${integrifyServiceUrl}/files/instancelist/${event.inputs.requestSid}`;
    const filesResp = await fetch(filesEndpint, {method:'GET', headers: {'Authorization': 'Bearer ' + accessToken}});
    let integrifyFiles = await filesResp.json();

    if (integrifyFiles.length == 0) {
        console.error(err || "no files found" );
        return "no files found";
    }


        let integrifyFile = integrifyFiles.sort(function(a,b) {
            return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime()
        }).find(f => f.FileName == event.inputs.file);

        if (!integrifyFile) {
            let em = "no matching file for this request";
            console.error(em);
            return callback(em)
        }

        //get the file from Integrify and save it to sharepoint
        let creds = {username: event.inputs.userName , password: event.inputs.password };
        let siteUrl = event.inputs.sharePointUrl ;

        let integrifyFileUrl = integrifyFile.StreamEndpoint;
        const x = await fetch(event.integrifyServiceUrl + integrifyFileUrl, {method: 'GET', headers: {'Authorization': 'Bearer ' + accessToken}});
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
        })
        console.log(spresult);
     
        let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.destinationFolder + "/" + event.inputs.file;
    

        const result = {sharePointFileUrl: spUrl}
    
        return result;

    

    //then, get the file based on event.inputs.questionId




    // spsave({
    //         siteUrl: siteUrl,
    //         checkin: true,
    //         checkinType: 1
    //     },
    //     creds, {
    //         folder: event.inputs.destinationFolder ,
    //         // fileName: event.inputs.destinationFile ,
    //         // fileContent: 'hello world'
    //         glob: 'integrify-sharepoint-push/package.json'
    //     }).then(result => {
    //         let spUrl = event.inputs.sharePointUrl + "/" + event.inputs.detinationFolder + "/" + event.inputs.detinationFile;
    //         return callback(null, {sharePointFileUrl:spUrl})
    // }).catch(e =>{
    //     console.log(e);
    //     return callback(e);
    // })
} catch (err) {
    console.log(err);
    return err;
}

};

config.execute = handler;

let lambdaTask = new integrifyLambda(config);
const lambdaHandler = lambdaTask.handler;
export {lambdaHandler}