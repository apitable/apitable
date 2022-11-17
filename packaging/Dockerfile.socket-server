# Install dependencies only when needed
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS deps

WORKDIR /workspace-install

COPY .yarn/ ./.yarn/
COPY ./.yarnrc.yml ./yarn.lock ./package.json ./

COPY packages/socket-server/package.json ./packages/socket-server/

# install packages cache
RUN yarn workspaces focus @apitable/websocket root

# stage builder
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS builder

WORKDIR /app

COPY --from=deps /workspace-install/node_modules ./node_modules
COPY --from=deps /workspace-install/packages/socket-server/node_modules ./packages/socket-server/node_modules

COPY .yarn ./.yarn

COPY ./.yarnrc.yml ./package.json ./yarn.lock ./common-tsconfig.json ./

COPY packages/socket-server ./packages/socket-server

RUN yarn workspace @apitable/websocket build

# stage run
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS runner

WORKDIR /app

ENV NODE_ENV=production

# agenthub configure
COPY --from=builder /app/packages/socket-server/app-config.json /root/

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/socket-server/ecosystem.config.js \
                    /app/packages/socket-server/package.json \
                    ./packages/socket-server/

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/socket-server/node_modules ./packages/socket-server/node_modules
COPY --from=builder /app/packages/socket-server/dist ./packages/socket-server/dist

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

CMD [ "pm2-runtime", "packages/socket-server/ecosystem.config.js" ]
