# Execute this script in the frontend folder to deploy the frontend on your local machine
#!/bin/bash
echo "Deploying locally..."
docker stop mcp-local
docker rm mcp-local
docker build --build-arg branch="local" -t mcp-local .
docker run -d -p 80:80 --name mcp-local mcp-local
echo "Deployed locally"
