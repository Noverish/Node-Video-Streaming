FROM node:10.16.3-alpine

WORKDIR /app

COPY ./ /app

CMD ["npm", "start"]