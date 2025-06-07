#!/bin/sh
set -e

echo "🔧 Configuring Angular environment..."

# Valores por defecto
API_URL=${API_URL:-"/api"}

echo "📍 API_URL: $API_URL"
echo "🌍 ENVIRONMENT: $ENVIRONMENT"
echo "🏷️  VERSION: $VERSION"

# Reemplazar placeholders en archivos JavaScript
find /usr/share/nginx/html -name '*.js' -exec sed -i \
  -e "s|__API_URL__|$API_URL|g" \
  {} +

echo "✅ Configuration completed!"

# Iniciar Nginx
exec nginx -g "daemon off;"
