#!/bin/bash
if [ "$#" -ne 3 ]
then
  echo "Please set the following arguments: 1. docker username 2. docker password 3. name of the git branch"
	exit 1
else
  echo "Deploying..."
  USERNAME=$1
  PASSWORD=$2
  BRANCH=$3
  docker login -u="$USERNAME" -p="$PASSWORD"
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
