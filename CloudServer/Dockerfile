ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/build .

CMD ["node", "src/app.js"]
