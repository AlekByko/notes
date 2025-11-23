FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

USER root

CMD ["node", "index.js"]
