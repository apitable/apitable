#!/bin/bash

docker login -u "$ECR_LOGIN_NAME" -p "$ECR_PASSWORD" "$ECR_PATH"
docker pull "$DOCKER_IMAGE_NAME:latest" || true
cd docker || exit 1
docker build --cache-from "$DOCKER_IMAGE_NAME:latest" --tag "$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG" . || exit 1
docker build --cache-from "$DOCKER_IMAGE_NAME:latest" --tag "$DOCKER_IMAGE_NAME:latest" . || exit 1
docker push "$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG" || exit 1
docker push "$DOCKER_IMAGE_NAME:latest" || exit 1