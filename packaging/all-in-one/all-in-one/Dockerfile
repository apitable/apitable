ARG IMAGE_TAG=latest

FROM apitable/backend-server:${IMAGE_TAG} as backend-server
FROM apitable/room-server:${IMAGE_TAG} as room-server
FROM apitable/web-server:${IMAGE_TAG} as web-server
FROM apitable/init-db:${IMAGE_TAG} as init-db

FROM apitable/databus-server:latest as databus-server
FROM apitable/init-appdata:latest as init-appdata
FROM apitable/imageproxy-server:latest as imageproxy-server

FROM apitable/dataenv-liquibase-pm2:latest

COPY --from=backend-server /app/ /app/backend-server/
COPY --from=databus-server /usr/local/bin/ /app/databus-server/
COPY --from=room-server /app/ /app/room-server/
COPY --from=web-server /app/ /app/web-server/
COPY --from=imageproxy-server /app/ /app/imageproxy-server/
COPY --from=init-db /liquibase/changelog/ /liquibase/changelog/
COPY --from=init-appdata /app/ /app/init-appdata/

RUN set -euxo pipefail; \
  curl -LO https://github.com/Automattic/node-canvas/releases/download/v2.9.1/canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz; \
  tar -xzf canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz; \
  rm -rf /app/web-server/node_modules/.pnpm/node_modules/canvas/build/Release; \
  mv Release /app/web-server/node_modules/.pnpm/node_modules/canvas/build/; \
  rm -f canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz

COPY gateway/conf.d/ /etc/nginx/conf.d/

RUN set -euxo pipefail; \
    sed -i 's| /dev/stdout ||' /etc/nginx/conf.d/default.conf; \
    sed -i 's/\<8080\>/3000/' /etc/nginx/conf.d/upstream/ups-web-server.conf

COPY script/add-host.sh /usr/local/bin/
COPY script/init-appdata.sh /usr/local/bin/

COPY ecosystem.config.js /

CMD ["bash", "-c", "init-dataenv.sh && add-host.sh && pm2-runtime start ecosystem.config.js"]

ARG SEMVER_FULL
ENV SEMVER_FULL=${SEMVER_FULL}

ENV \
    BACKEND_BASE_URL=http://backend-server:8081/api/v1/ \
    ROOM_GRPC_URL=0.0.0.0:3334 \
    SOCKET_GRPC_URL=0.0.0.0:3007 \
    DATABUS_SERVER_BASE_URL=http://databus-server:8625 \
    \
    OSS_CACHE_TYPE=minio \
    OSS_HOST=assets \
    OSS_TYPE=QNY1 \
    \
    MINIO_ACCESS_KEY=apitable \
    MINIO_SECRET_KEY=apitable@com \
    \
    DATABASE_TABLE_PREFIX=apitable_ \
    MYSQL_DATABASE=apitable \
    MYSQL_HOST=mysql \
    MYSQL_PASSWORD=apitable@com \
    MYSQL_PORT=3306 \
    MYSQL_ROOT_PASSWORD=apitable@com \
    MYSQL_USERNAME=root \
    \
    REDIS_DB=0 \
    REDIS_HOST=redis \
    REDIS_PASSWORD=apitable@com \
    REDIS_PORT=6379 \
    \
    RABBITMQ_HOST=rabbitmq \
    RABBITMQ_PASSWORD=apitable@com \
    RABBITMQ_PORT=5672 \
    RABBITMQ_USERNAME=apitable \
    RABBITMQ_VHOST=/ \
    \
    TIMEZONE=Asia/Singapore \
    \
    ENV=apitable \
    \
    API_PROXY=http://backend-server:8081 \
    BACKEND_INFO_URL=http://backend-server:8081/api/v1/client/info \
    PUBLIC_URL= \
    TEMPLATE_PATH=./static/web_build/index.html \
    USE_CUSTOM_PUBLIC_FILES=true \
    \
    NEST_GRPC_ADDRESS=static://room-server:3334 \
    \
    CALLBACK_DOMAIN= \
    CORS_ORIGINS=* \
    SERVER_DOMAIN= \
    SOCKET_DOMAIN=http://room-server:3333/socket \
    \
    SKIP_REGISTER_VALIDATE=true \
    TEMPLATE_SPACE=spcNTxlv8Drra \
    \
    SOCKET_RECONNECTION_ATTEMPTS=10 \
    SOCKET_RECONNECTION_DELAY=500 \
    SOCKET_TIMEOUT=5000 \
    SOCKET_URL=http://room-server:3002 \
    \
    SMS_ENABLED=false \
    \
    MAIL_ENABLED=false \
    MAIL_FROM= \
    MAIL_HOST= \
    MAIL_PASSWORD= \
    MAIL_PORT= \
    MAIL_SSL_ENABLE=true \
    MAIL_TYPE=smtp \
    MAIL_USERNAME= \
    \
    OSS_CLIENT_TYPE=aws \
    OSS_ENABLED=true \
    \
    AWS_ACCESS_KEY=apitable \
    AWS_ACCESS_SECRET=apitable@com \
    AWS_ENDPOINT=http://minio:9000 \
    AWS_REGION=us-east-1 \
    \
    ASSETS_BUCKET=assets \
    ASSETS_URL=assets \
    OSS_BUCKET_NAME=assets
