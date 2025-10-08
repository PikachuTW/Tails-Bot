FROM node:24-alpine

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile --production

CMD ["node", "index.js"]
