FROM node:12-alpine as base 
WORKDIR /sampler-services
COPY package.json yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn cache clean
COPY . .
CMD ["node" , "./app.js"]