FROM alpine/openssl AS ssl

RUN mkdir -p /ssl
RUN openssl req -x509 -nodes \
    -out /ssl/fullchain.crt \
    -keyout /ssl/privkey.key \
    -subj "/C=FR/ST=Occitanie/L=Perpignan/O=42/OU=42 Perpignan/CN=ft_transcendence/UID=ft_transcendence"

FROM node:22-alpine AS builder

COPY .. /app

WORKDIR /app

RUN npm ci
RUN npm --workspace=frontend run build

FROM nginx:stable-alpine

COPY --from=ssl /ssl /etc/nginx/ssl
COPY --from=builder /app/frontend/dist /www
COPY ../nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /www

EXPOSE 443
