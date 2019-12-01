ARG branch=local

FROM node:12.13 as frontend
ARG branch
WORKDIR /app
COPY Frontend/ .
RUN npm ci
RUN npm run build:$branch

FROM nginx:1.13.12-alpine
COPY --from=frontend /app/dist/osc-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'

EXPOSE 80
