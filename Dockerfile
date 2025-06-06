FROM node:alpine AS build

ARG BACKEND_URL
ARG MEILISEARCH_URL
ARG MEILISEARCH_KEY
ENV BACKEND_URL=${BACKEND_URL}
ENV MEILISEARCH_URL=${MEILISEARCH_URL}
ENV MEILISEARCH_KEY=${MEILISEARCH_KEY}


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

EXPOSE 80