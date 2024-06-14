FROM node:14-alpine

WORKDIR /home/app

COPY package.json tsconfig.json ./
RUN mkdir src
COPY src src
RUN npm install && npx tsc

CMD ["npm", "start"]
