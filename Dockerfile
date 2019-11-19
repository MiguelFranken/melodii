ARG branch

FROM node:12.13 as generator
ARG branch
WORKDIR /app
COPY Generator/ .
RUN npm ci && npm run build

FROM node:12.13 as frontend
ARG branch
WORKDIR /app
COPY Frontend/ .
RUN npm ci
RUN npm run build:$branch

FROM node:12.13 as server
WORKDIR /app
COPY Server/package.json Server/package-lock.json ./
RUN npm ci
COPY Server/ .
RUN npm run build

COPY --from=generator /app/dist/static /app/dist/public
COPY --from=frontend /app/dist/osc-frontend /app/dist/public/monitor

EXPOSE 8080
EXPOSE 8000
EXPOSE 80
EXPOSE 57121/udp
CMD [ "node", "dist/index.js" ]
