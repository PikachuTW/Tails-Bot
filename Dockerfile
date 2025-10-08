FROM node:24

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile --production

CMD ["node", "index.js"]
