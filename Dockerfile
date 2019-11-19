ARG frontend-build-command

FROM node:12.13 as generator
WORKDIR /app
COPY Generator/ .
RUN npm ci && npm run build

FROM node:12.13 as frontend
WORKDIR /app
COPY Frontend/ .
RUN npm ci && npm run $frontend-build-command

FROM node:12.13 as server
WORKDIR /app
COPY Server/package.json Server/package-lock.json ./
RUN npm ci
COPY Server/ .
RUN npm run build

COPY --from=generator /app/dist/static /app/dist/public
COPY --from=frontend /app/dist/osc-frontend /app/dist/public/monitor

# Assuming image is called `mcp`, launch with:
# docker run -p 8080:8080 -p 8000:8000 -p 80:80 -p 57121:57121/udp miguelfranken/mcp
EXPOSE 8080
EXPOSE 8000
EXPOSE 80
EXPOSE 57121/udp
CMD [ "node", "dist/index.js" ]
