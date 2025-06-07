FROM node:alpine AS build

RUN apk add --no-cache gettext

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npx ng build --configuration production

FROM nginx:alpine

COPY nginx.conf  /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/grandspectra /usr/share/nginx/html

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
