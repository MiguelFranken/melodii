FROM node:12.13
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
EXPOSE 57121/udp
CMD [ "node", "dist/index.js" ]
