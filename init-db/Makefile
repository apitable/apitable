DOCKER_PATH=ghcr.io/vikadata/vika/init-db
SHELL := /bin/bash

build-init-db: #  local build the init-db
	docker build -f Dockerfile . --tag=${DOCKER_PATH}

env: ## 生成.env文件，读取1Password，用于init-db本地执行调试
	bash ./scripts/env.sh

plan: build-init-db ## init-db dry update
	docker run --rm --env-file .env -e ACTION=updateSQL ${DOCKER_PATH}

apply: build-init-db ## init-db 本地环境更新远端数据库结构
	docker build -f Dockerfile.init-db . --tag=${DOCKER_PATH}
	docker run --rm --env-file .env -e ACTION=update ${DOCKER_PATH}


buildpush:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	build_docker init-db
