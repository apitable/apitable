.DEFAULT_GOAL := help
PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

DEVENV := docker compose -f docker-compose.devenv.yaml run --rm --user $(shell id -u):$(shell id -g) 

SEMVER3 := $(shell cat .version)
define ANNOUNCE_BODY

           _____ _____ _______    _     _      
     /\   |  __ \_   _|__   __|  | |   | |     
    /  \  | |__) || |    | | __ _| |__ | | ___ 
   / /\ \ |  ___/ | |    | |/ _` | '_ \| |/ _ \

  / ____ \| |    _| |_   | | (_| | |_) | |  __/
 /_/    \_\_|   |_____|  |_|\__,_|_.__/|_|\___|


APITable Makefile $(SEMVER3)
================================================================

endef
export ANNOUNCE_BODY

# define standard colors
ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

colors: ## show all the colors
	@echo "${BLACK}BLACK${RESET}"
	@echo "${RED}RED${RESET}"
	@echo "${GREEN}GREEN${RESET}"
	@echo "${YELLOW}YELLOW${RESET}"
	@echo "${LIGHTPURPLE}LIGHTPURPLE${RESET}"
	@echo "${PURPLE}PURPLE${RESET}"
	@echo "${BLUE}BLUE${RESET}"
	@echo "${WHITE}WHITE${RESET}"

dtq = install pre conf datasheet
datasheet-quick: $(dtq) ## 一键启动 datasheet 前端工程（安装、打包依赖、启动 datasheet）
datasheet: ## 启动 datasheet package
	yarn start:datasheet
datasheet-test: ## 启动 datasheet package 测试
	yarn test:datasheet

core: ## 启动 core package
	yarn start:core

server: ## 启动 room-server package
	yarn start:room-server
server-build: ## 打包 room-server package
	yarn build:room-server
server-test: ## 启动 room-server package 测试
	yarn start:room-server

components: ## 启动 components package
	yarn start:components
components-build: ## 打包 components package
	yarn build:components

conf: ## 同步数表配置
	yarn scripts:makeconfig
java: ## 生成 java code，默认 ../vikadata-master 为 java 工程
	export VIKA_SERVER_PATH=$$PWD/../vikadata-master && yarn scripts:makeconfig-javacode

# install: ## npm 包安装
# 	- yarn config get npmRegistryServer
# 	- yarn -v
# 	- yarn install
icon: ## 同步设计 icons 并打包
	- yarn sync:icons
	- yarn build:icons
pre: ## 启动 datasheet 准备（打包 core、icons、components、widget）
	- yarn build:dst:pre
lint: ## eslint 检测
	- yarn lint

build-room: ## 编译room server
	yarn workspaces focus @vikadata/room-server
	yarn build:i18n
	yarn build:core
	yarn build:room-server

test-e2e: ## 启动集成测试
	yarn cy:run
test-e2e-open: ## 启动调试集成测试
	yarn cy:open

###### 【core unit test】 ######

test-ut-core:
	yarn workspaces focus @vikadata/core @vikadata/i18n-lang root
	yarn build:i18n
	yarn build:core
	yarn test:core

###### 【core unit test】 ######

###### 【room server unit test】 ######

_docker_network = $(shell docker network ls | grep -w "unit-test" | awk '{ print $$2 }')
sikp-initdb=false

_test_initdb:
ifeq ($(_docker_network),)
	docker network create unit-test
endif
	@echo "${YELLOW}pull [init-db:latest] the latest image...${RESET}"
	docker-compose -f docker-compose-unit-test.yml pull test-initdb
	docker-compose -f docker-compose-unit-test.yml run --rm test-initdb
	@echo "${GREEN}initialize unit test db completed...${RESET}"

test-ut-room-local:
    export MYSQL_HOST=127.0.0.1
    export MYSQL_PORT=23306
    export MYSQL_USERNAME=vika
    export MYSQL_PASSWORD=password
    export MYSQL_DATABASE=vika_test
    export MYSQL_USE_SSL=false
    export REDIS_HOST=127.0.0.1
    export REDIS_PORT=26379
    export REDIS_DB=4
    export REDIS_PASSWORD=
    export RABBITMQ_HOST=127.0.0.1
    export RABBITMQ_PORT=25672
    export RABBITMQ_USERNAME=vika
    export RABBITMQ_PASSWORD=password
    export INSTANCE_COUNT=1
    export APPLICATION_NAME=TEST_NEST_REST_SERVER
test-ut-room-local:
	docker-compose -f docker-compose-unit-test.yml down || true
ifeq ($(sikp-initdb),false)
	make _test_initdb
endif
	docker-compose -f docker-compose-unit-test.yml up -d test-redis test-rabbitmq
	make build-room
	yarn test:ut:room
	docker-compose -f docker-compose-unit-test.yml down || true

test-ut-room-docker:
	@echo "${LIGHTPURPLE}$$(docker-compose --version)${RESET}"
	docker rm -f $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true
	docker-compose -f docker-compose-unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql
	docker-compose -f docker-compose-unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis
	docker-compose -f docker-compose-unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq
	sleep 20
	docker-compose -f docker-compose-unit-test.yml run --rm -e DB_HOST=test-mysql-$${CI_GROUP_TAG:-0} test-initdb
	docker-compose -f docker-compose-unit-test.yml build unit-test-room
	docker-compose -f docker-compose-unit-test.yml run --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		unit-test-room
	@echo "${GREEN}finished unit test，clean up images...${RESET}"
	docker rm -f $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true

###### 【room server unit test】 ######

###### 【backend server unit test】 ######

test-ut-backend-docker:
	@echo "${LIGHTPURPLE}$$(docker-compose --version)${RESET}"
	docker rm -f $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true
	docker-compose -f docker-compose-unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql
	docker-compose -f docker-compose-unit-test.yml run -d --name test-mongo-$${CI_GROUP_TAG:-0} test-mongo
	docker-compose -f docker-compose-unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis
	docker-compose -f docker-compose-unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq
	sleep 20
	docker-compose -f docker-compose-unit-test.yml run --rm -e DB_HOST=test-mysql-$${CI_GROUP_TAG:-0} test-initdb
	docker-compose -f docker-compose-unit-test.yml run -u $(shell id -u):$(shell id -g) --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		-e MONGO_HOST=test-mongo-$${CI_GROUP_TAG:-0} \
		unit-test-backend
	@echo "${GREEN}finished unit test，clean up images...${RESET}"
	docker rm -f $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true

###### 【backend server unit test】 ######

###### buildpush ######

buildpush: buildpush_roomserver buildpush_webserver # buildpush all
	echo 'finish buildpush all'

buildpush_roomserver: ## ghcr.io/vikadata/vika/room-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	build_docker room-server

buildpush_webserver: ## ghcr.io/vikadata/vika/web-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	source scripts/build_web.sh

buildpush_componentdoc: ## ghcr.io/vikadata/vika/component-doc
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	build_docker component-doc

buildpush_webserver_op: ## ghcr.io/vikadata/vika/web-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
  	env_nodejs;\
	echo -ne "\nWEB_CLIENT_VERSION=op-$${SEMVER_FULL}" >> packages/datasheet/.env;\
	sed -i~ 's/NEXT_ASSET_PREFIX=.*/NEXT_ASSET_PREFIX=/g' packages/datasheet/.env;\
	sed -i~ 's/NEXT_PUBLIC_ASSET_PREFIX=.*/NEXT_PUBLIC_ASSET_PREFIX=/g' packages/datasheet/.env;\
  	export DOCKERFILE=Dockerfile.next;\
  	export TARGET_DOCKER_TAGS="latest-op"\ \"v$${SEMVER_NUMBER}-op_build$$BUILD_NUM\";\
	build_docker_unableack dotversion web-server

buildpush_socketserver:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	export DOCKERFILE=./packages/socket-server/Dockerfile;\
	build_docker socket-server
     
# bumpversion 
.PHONY: patch
patch: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" ghcr.io/vikadata/vika/bumpversion:latest bumpversion patch


### up

.PHONY: up
up: ## start the application
	@echo "Please execute 'make pull' first to download & upgrade all images to your machine."
	docker compose up -d

.PHONY: pull
pull: ## pull all containers and ready to up
ifndef CR_PAT
	read -p "Please enter CR_PAT: " CR_PAT ;\
	echo $$CR_PAT | docker login ghcr.io -u vikadata --password-stdin ;\
	docker compose pull
endif
ifdef CR_PAT
	echo $$CR_PAT | docker login ghcr.io -u vikadata --password-stdin ;\
	docker compose pull
endif


### run
run:
	echo "TODO As daemon"



run-web-server: ## run local web-server code
	$(DEVENV) web-server yarn sd 

run-room-server: ## run local room-server code
	$(DEVENV) room-server yarn sd 

run-socket-server: ## run local socket-server code
	$(DEVENV) socket-server yarn sd 

run-backend-server: ## run local backend-server code
	$(DEVENV) backend-server ./gradlew build -x test

### install

.PHONY: install-backend-server
install-backend-server: ## graldew install backend-server dependencies
	$(DEVENV) backend-server ./gradlew build -x test

.PHONY: install-web-server
install-web-server: ## graldew install backend-server dependencies
	$(DEVENV) web-server sh -c "yarn install && yarn build:dst:pre"

.PHONY: install-socket-server
install-socket-server:
	$(DEVENV) socket-server sh -c "yarn"
	  

.PHONY: install
install: install-backend-server install-web-server ## install all dependencies
	echo 'Finished'


.PHONY: build
build: ## build apitable all services
	export TAG=latest ;\
	export EDITION=apitable;\
	docker buildx bake -f docker-bake.hcl init-db backend-server web-server room-server socket-server

### help
.PHONY: search
search:
	@echo " "
	@read -p "搜索命令:" s; \
	echo  && grep -E "$$s.*?## .*" $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';
	@echo ' ';
	@read -p "输入执行命令:" command; \
	make $$command;

.PHONY: help
help:
	@echo "$$ANNOUNCE_BODY"
	@echo "What you want to do?"
	@echo ' ';
	@grep -E '^[0-9a-zA-Z-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';
	@echo '  '
	@read -p "INPUT YOUR COMMAND >> " command; \
	make $$command;
