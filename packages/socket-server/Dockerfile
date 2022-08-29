# Install dependencies only when needed
FROM node:16.15.0 AS deps

WORKDIR /workspace-install

COPY .yarn ./.yarn

COPY ./.yarnrc.yml ./package.json ./yarn.lock ./

# install packages 可以使用缓存
RUN yarn install

# stage builder
FROM node:16.15.0 AS builder

WORKDIR /app

COPY --from=deps /workspace-install/node_modules ./node_modules

COPY ./ ./.

RUN yarn build

# stage run
FROM node:16.15.0 AS runner

WORKDIR /app/socket-server

ENV NODE_ENV=production

COPY --from=builder /app ./

# pm2
RUN npm install pm2 --global

# notification
EXPOSE 3002
# http
EXPOSE 3001
# datasheet
EXPOSE 3006
# room
EXPOSE 3005
# rpcx
EXPOSE 3007

CMD [ "pm2-runtime", "ecosystem.config.js" ]
