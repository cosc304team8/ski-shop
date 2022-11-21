FROM node

WORKDIR /app

COPY package*.json ./

# RUN yarn install

CMD ["yarn", "start"]