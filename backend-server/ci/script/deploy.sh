#!/bin/bash

echo "当前更新的版本号：$DOCKER_IMAGE_TAG 更新对应集群 $CLUSTER_NAME 对应分区：$PARTITION 对应服务：$APP_NAME VIP: $VIP 请求地址 $SERVER_DEPLOY_PATH"
pip3 install requests || exit 1
python3 ci/script/deploy-server.py "$VIP" "$CLUSTER_NAME" "$PARTITION" "$APP_NAME" "$TENANT" "$DOCKER_IMAGE_TAG" || exit 1
