FROM node:14.10.1

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]