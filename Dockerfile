# syntax=docker/dockerfile:1
# ==========================================
# Build
# ==========================================
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install
COPY . .
RUN bun run build

# ==========================================
# Nginx
# ==========================================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    if ($request_uri ~ ^/(.*)\.html$) {
        return 301 /$1;
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    access_log off;
    error_log /var/log/nginx/error.log error;

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /404.html;

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]