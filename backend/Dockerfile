FROM node:22-alpine

RUN apk add --no-cache sqlite

COPY ./ /app
WORKDIR /app

RUN npm ci
RUN npx --workspace=backend tsc

CMD npm --workspace=backend start