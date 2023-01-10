ARG APITABLE_VERSION=latest

FROM apitable/backend-server:${APITABLE_VERSION} as backend-server
FROM apitable/room-server:${APITABLE_VERSION} as room-server
FROM apitable/socket-server:${APITABLE_VERSION} as socket-server
FROM apitable/web-server:${APITABLE_VERSION} as web-server
FROM apitable/init-db:${APITABLE_VERSION} as init-db
FROM apitable/init-appdata:latest as init-appdata
FROM apitable/imageproxy-server:latest as imageproxy-server

FROM apitable/dataenv-liquibase-pm2:latest

COPY --from=backend-server /app/ /app/backend-server/
COPY --from=room-server /app/ /app/room-server/
COPY --from=socket-server /app/ /app/socket-server/
COPY --from=web-server /app/ /app/web-server/
COPY --from=imageproxy-server /app/ /app/imageproxy-server/
COPY --from=init-db /liquibase/changelog/ /liquibase/changelog/
COPY --from=init-appdata /app/ /app/init-appdata/

RUN set -eux; \
  curl -LO https://github.com/Automattic/node-canvas/releases/download/v2.9.1/canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz; \
  tar -xzf canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz; \
  rm -rf /app/web-server/node_modules/canvas/build/Release; \
  mv Release /app/web-server/node_modules/canvas/build/; \
  rm -f canvas-v2.9.1-node-v93-linux-glibc-x64.tar.gz

COPY gateway/conf.d/ /etc/nginx/conf.d/

RUN set -eux; \
    sed -i 's| /dev/stdout ||' /etc/nginx/conf.d/nginx.conf; \
    sed -i 's/\<8080\>/3000/' /etc/nginx/conf.d/upstream/ups-web-server.conf

COPY script/add-host.sh /usr/local/bin/
COPY script/init-appdata.sh /usr/local/bin/

COPY ecosystem.config.js /

CMD ["bash", "-c", "init-mysql.sh && add-host.sh && pm2-runtime start ecosystem.config.js"]

ENV \
    NODE_ENV=production \
    \
    BACKEND_BASE_URL=http://backend-server:8081/api/v1/ \
    SOCKET_GRPC_URL=socket-server:3007 \
    NEST_GRPC_URL=room-server:3334 \
    \
    OSS_HOST=http://minio:9000 \
    OSS_TYPE=QNY1 \
    OSS_CACHE_TYPE=minio \
    \
    MINIO_ACCESS_KEY=apitable \
    MINIO_SECRET_KEY=apitable@com \
    \
    MYSQL_HOST=mysql \
    MYSQL_PORT=3306 \
    MYSQL_DATABASE=apitable \
    MYSQL_USERNAME=root \
    MYSQL_PASSWORD=apitable@com \
    MYSQL_ROOT_PASSWORD=apitable@com \
    DATABASE_TABLE_PREFIX=apitable_ \
    \
    REDIS_HOST=redis \
    REDIS_PORT=6379 \
    REDIS_PASSWORD=apitable@com \
    REDIS_DB=0 \
    \
    RABBITMQ_HOST=rabbitmq \
    RABBITMQ_PORT=5672 \
    RABBITMQ_USERNAME=apitable \
    RABBITMQ_PASSWORD=apitable@com \
    RABBITMQ_VHOST=/ \
    \
    TIMEZONE=Asia/Singapore \
    \
    ENV=apitable \
    PUBLIC_URL= \
    TEMPLATE_PATH=./static/web_build/index.html \
    BACKEND_INFO_URL=http://backend-server:8081/api/v1/client/info \
    API_PROXY=http://backend-server:8081 \
    USE_CUSTOM_PUBLIC_FILES=true \
    \
    NEST_GRPC_ADDRESS=static://room-server:3334 \
    \
    SERVER_DOMAIN= \
    CALLBACK_DOMAIN= \
    CORS_ORIGINS=* \
    SOCKET_DOMAIN=http://socket-server:3001/socket \
    \
    TEMPLATE_SPACE=spcNTxlv8Drra \
    \
    SOCKET_URL=http://socket-server:3002 \
    SOCKET_RECONNECTION_ATTEMPTS=10 \
    SOCKET_RECONNECTION_DELAY=500 \
    SOCKET_TIMEOUT=5000 \
    \
    SMS_ENABLED=false \
    \
    MAIL_ENABLED=false \
    MAIL_HOST= \
    MAIL_USERNAME= \
    MAIL_PASSWORD= \
    \
    OSS_ENABLED=true \
    OSS_CLIENT_TYPE=aws \
    AWS_ACCESS_KEY=apitable \
    AWS_ACCESS_SECRET=apitable@com \
    AWS_ENDPOINT=http://minio:9000 \
    AWS_REGION=us-east-1 \
    \
    OSS_BUCKET_NAME=assets \
    VK_ASSETS_LTD_BUCKET=assets
