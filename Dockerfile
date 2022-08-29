# Install dependencies only when needed
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS deps

WORKDIR /tmp/vikadata

COPY .yarn ./.yarn

# install packages 可以使用缓存
COPY ./.yarnrc.yml ./package.json ./yarn.lock ./common-tsconfig.json ./

COPY packages/i18n-lang/package.json ./packages/i18n-lang/

COPY packages/core/package.json ./packages/core/

COPY packages/room-server/package.json ./packages/room-server/

RUN yarn workspaces focus @vikadata/room-server

# stage builder
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS builder

WORKDIR /tmp/vikadata

COPY --from=deps /tmp/vikadata/node_modules ./node_modules
COPY --from=deps /tmp/vikadata/packages/room-server/node_modules ./packages/room-server/node_modules

COPY .yarn ./.yarn

COPY ./.yarnrc.yml ./package.json ./yarn.lock ./common-tsconfig.json ./

COPY packages/i18n-lang ./packages/i18n-lang

COPY packages/core ./packages/core

COPY packages/room-server ./packages/room-server

RUN yarn workspace @vikadata/i18n-lang run build && yarn workspace @vikadata/core run build && yarn workspace @vikadata/room-server run prebuild && yarn workspace @vikadata/room-server run build

ARG test=false

# RUN if test "$test" = 'true'; then yarn test:nest; else echo Argument test not true; fi

# stage runner
FROM docker.vika.ltd/vikadata/vika/alinode:7.6.0 AS runner

WORKDIR /home/vikadata

ENV NODE_ENV production

# agenthub配置
COPY ./app-config.json /root/
# pm2
RUN npm install pm2 --global

COPY --from=builder /tmp/vikadata /home/vikadata

# local 配置
#ENV APP_ID 87508
#ENV APP_SECRET f945aafb5a96077fe001b51e445250468da09756
#ENV NODE_LOG_DIR /home/vikadata/packages/room-server/logs
#ENV ENABLE_NODE_LOG YES
EXPOSE 3333
# grpc接口的端口
EXPOSE 3334
# 部署类型
ENV DEPLOY_TYPE="SaaS"

CMD [ "pm2-runtime", "packages/room-server/ecosystem.config.js" ]
