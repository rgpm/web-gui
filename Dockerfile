FROM node:12-slim

COPY . /app
WORKDIR /app
RUN yarn install --production
RUN yarn build


FROM nginx

COPY --from=0 /app/build/ /usr/share/nginx/html

# create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine

COPY nginx.conf /etc/nginx/nginx.conf

