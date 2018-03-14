"use strict";
var integrifyLambda = require('integrify-aws-lambda');
let google = require('googleapis');
var privatekey = require("./privatekey.json");

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");

    }
});

let sheets = google.sheets('v4');
let drive  = google.drive('v3');



//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function
var gcopy = new integrifyLambda({
        helpUrl: "http://www.integrify.com",
        inputs: [{key:"spreadsheetId", type:"string"},
            {key: "sheetName", type: "string"},
            {key: "range", type:"string"},
            {key: "valueSelectors", type:"string"},
            {key: "valueRenderOption", type:"string"}
         ],
        outputs:[{key:"value_0", type:"string"},{key:"role", type:"string"}],
        execute: (event, context, callback) => {
            console.info(event);
            let inputs = event.inputs;

            //get some values from the sheet
            let sheetName = inputs.sheetName;

            //value selectors follow the rowindex,colindex format and may be an array if you need to return multiple values
            //["0,1", "0,2", "1,0"]

            let sheets = google.sheets('v4');
            sheets.spreadsheets.values.get({
                auth: jwtClient,
                spreadsheetId: inputs.spreadsheetId,
                range: sheetName + '!' + inputs.range
            }, function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return callback(err);
                } else {

                    let outputs = {}
                    let rows = response.data.values;
                    let valueSelectors = JSON.parse(inputs.valueSelectors)
                    valueSelectors.forEach((s,idx) => {
                        let coordinates = s.split(",");
                        outputs['value_' + idx] = rows[coordinates[0]][coordinates[1]];

                    })
                    return callback(null, outputs);
                }
            });




        }

});

//Export the handler function of the new object
exports.handler = gcopy.handler;