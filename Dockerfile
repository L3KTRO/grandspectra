# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción con servidor Node.js
FROM nginx:alpine as production
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
