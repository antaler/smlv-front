FROM node:alpine as builder

WORKDIR  /builder

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /builder/dist/web/browser /usr/share/nginx/html


