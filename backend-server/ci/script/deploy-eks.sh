#!/bin/bash

pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple requests || exit 1
echo "部署服务器：" $DEPLOY_SERVER  "更新对应集群：" $EKS_SERVER  "对应项目：" $NAMESPACE  "对应服务：" $DEPLOY_NAME "当前更新镜像：" $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG
python3 ci/script/deploy-eks.py $DEPLOY_SERVER $EKS_SERVER $NAMESPACE $DEPLOY_NAME $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG || exit 0