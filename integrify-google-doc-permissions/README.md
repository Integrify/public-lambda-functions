This project contains a AWS Lambda function that sets the anyoneWithLink permissions on a file that has been copied to the Integrify GooglevCLoud Accounta
 
If run outside of Integrofy Public Lambda repository, it will require a Google Cloud account and Project with a Service account configured.
 see https://cloud.google.com/iam/docs/understanding-service-accounts for createing a Serive Account for your Google Cloud project.
 The project must also be granted access to the Google Drive API.
 
The credentials for the Servive Account should be stored in the privatekey.json file in the roort of this project. 



