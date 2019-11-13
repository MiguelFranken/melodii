FROM nginx:1.13.12-alpine
COPY ./dist/osc-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'
