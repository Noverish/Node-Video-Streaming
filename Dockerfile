FROM node:12.16.1-alpine

WORKDIR /app

COPY . /app

CMD npm start
