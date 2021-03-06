# This script is used in the deployment server
# and is executed for every commit on the master/dev branch
#!/bin/bash
if [ "$#" -ne 2 ]
then
  echo "Please set the following arguments: 1. docker username 2. name of the git branch"
	exit 1
else
  echo "Deploying..."
  USERNAME=$1
  BRANCH=$2
  docker pull $USERNAME/mcp-$BRANCH
  docker pull $USERNAME/mcp-server-$BRANCH
  docker stop mcp
  docker stop mcp-server
  docker rm mcp
  docker rm mcp-server
  docker run -d -p 80:80 --name mcp $USERNAME/mcp-$BRANCH
  docker run -d -p 8080:8080 -p 8000:8000 -p 57121:57121/udp --name mcp-server $USERNAME/mcp-server-$BRANCH
  echo "Done"
fi
