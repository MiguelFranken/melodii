# Deployment Scripts
This folder contains all scripts that are used for deployment purposes.

## deploy.sh
This script is used on the deployment servers and is executed for each commit on the dev/master branch. It is triggered by the Gitlab CI pipeline.
The script stops the running deployed version of the server and front-end, pulls the latest version from the Docker Hub, and then starts the latest version of the server and front-end.

## local-deploy.sh
This script can be used on your local machine to deploy the frontend. 
The script is important at some points during development, because it allows the frontend to be deployed on your local machine in the same way as it would be in production on the deployment servers. 
Furthermore, local deployment with this script also allows the frontend to be accessed on the iPad. 
