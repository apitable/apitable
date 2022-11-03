.DEFAULT_GOAL := help
PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

ifndef UID
UID := $(shell id -u)
export UID
endif

ifndef GID
GID := $(shell id -g)
export GID
endif

ifndef ENV_FILE
ENV_FILE := .env
export ENV_FILE
endif

ifndef DATA_PATH
DATA_PATH := ./
export DATA_PATH
endif

ifndef DEVENV_PROJECT_NAME
DEVENV_PROJECT_NAME := apitable-devenv
export DEVENV_PROJECT_NAME
endif

_DATAENV := docker compose --env-file $$ENV_FILE -p $$DEVENV_PROJECT_NAME -f docker-compose.yaml
_DEVENV := docker compose --env-file $$ENV_FILE -p $$DEVENV_PROJECT_NAME -f docker-compose.devenv.yaml 

OS_NAME := $(shell uname -s | tr A-Z a-z)
ifeq ($(OS_NAME), darwin)
    # macOS don't set user for some priviliges problem
	RUNNER := $(_DEVENV) run --rm
else
    # Not found
	RUNNER := $(_DEVENV) run --rm --user $$UID:$$GID 
endif
BUILDER := docker buildx bake -f docker-compose.build.yaml

ttt:
	echo $(OS_NAME)
	echo $(RUNNER)

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
	yarn workspaces focus @apitable/core @vikadata/i18n-lang root
	yarn build:i18n
	yarn build:core
	yarn test:core

###### 【core unit test】 ######

###### 【room server unit test】 ######
sikp-initdb=false

_test_init_db:
	@echo "${YELLOW}pull [init-db:latest] the latest image...${RESET}"
	docker-compose -f docker-compose-unit-test.yml pull test-initdb
	docker-compose -f docker-compose-unit-test.yml run --rm -e DB_HOST=test-mysql-$${CI_GROUP_TAG:-0} test-initdb
	@echo "${GREEN}initialize unit test db completed...${RESET}"

_test_clean: ## clean the docker in test step
	docker rm -fv $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true

# test-ut-room-local:
#     export MYSQL_HOST=127.0.0.1
#     export MYSQL_PORT=23306
#     export MYSQL_USERNAME=vika
#     export MYSQL_PASSWORD=password
#     export MYSQL_DATABASE=vika_test
#     export MYSQL_USE_SSL=false
#     export REDIS_HOST=127.0.0.1
#     export REDIS_PORT=26379
#     export REDIS_DB=4
#     export REDIS_PASSWORD=
#     export RABBITMQ_HOST=127.0.0.1
#     export RABBITMQ_PORT=25672
#     export RABBITMQ_USERNAME=vika
#     export RABBITMQ_PASSWORD=password
#     export INSTANCE_COUNT=1
#     export APPLICATION_NAME=TEST_NEST_REST_SERVER
test-ut-room-local:
	make _test_clean
	docker-compose -f docker-compose-unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql
	docker-compose -f docker-compose-unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis
	docker-compose -f docker-compose-unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq
ifeq ($(sikp-initdb),false)
	sleep 20
	make _test_init_db
endif
	make build-room
	yarn test:ut:room
	make _test_clean

test-ut-room-docker:
	@echo "${LIGHTPURPLE}$$(docker-compose --version)${RESET}"
	make _test_clean
	docker-compose -f docker-compose-unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql
	docker-compose -f docker-compose-unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis
	docker-compose -f docker-compose-unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq
	sleep 20
	make _test_init_db
	docker-compose -f docker-compose-unit-test.yml build unit-test-room
	docker-compose -f docker-compose-unit-test.yml run --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		unit-test-room
	@echo "${GREEN}finished unit test，clean up images...${RESET}"
	make _test_clean

###### 【room server unit test】 ######

###### 【backend server unit test】 ######

test-ut-backend-docker:
	 make -C ./backend-server test-ut-backend-docker

###### 【backend server unit test】 ######

buildpush: ## build all and push all to hub.docker.io registry
	echo $$APITABLE_DOCKER_HUB_TOKEN | docker login -u apitable --password-stdin ;\
	$(BUILDER) --push
	
.PHONY: build
build: ## build all containers
	$(BUILDER)

###### development environtments ######

define DEVENV_TXT
Which devenv do you want to start run?
  0) UP ALL
  1) backend-server
  2) room-server
  3) web-server
  4) socket-server
endef
export DEVENV_TXT

.PHONY: devenv
devenv: ## debug all devenv services with docker compose up -d
	@echo "$$DEVENV_TXT"
	@read -p "ENTER THE NUMBER: " DEVENV_NUMBER ;\
 	if [ "$$DEVENV_NUMBER" = "0" ]; then make devenv-up; fi ;\
 	if [ "$$DEVENV_NUMBER" = "1" ]; then make devenv-backend-server; fi ;\
 	if [ "$$DEVENV_NUMBER" = "2" ]; then make devenv-room-server; fi ;\
 	if [ "$$DEVENV_NUMBER" = "3" ]; then make devenv-web-server; fi ;\
 	if [ "$$DEVENV_NUMBER" = "4" ]; then make devenv-socket-server; fi


.PHONY: devenv-up
devenv-up: ## debug all devenv services with docker compose up -d
	$(_DEVENV) up -d

.PHONY: devenv-down
devenv-down: ## debug all devenv services with docker compose up -d
	$(_DEVENV) down

devenv-logs: ## follow all devenv services logs
	$(_DEVENV) logs -f
devenv-ps:
	$(_DEVENV) ps

.PHONY: build-init-db
build-init-db:
	$(BUILDER) init-db
.PHONY: build-backend-server
build-backend-server:
	$(BUILDER) backend-server

.PHONY: install-backend-server
_install-backend-server: ## graldew install backend-server dependencies
	$(RUNNER) backend-server ./gradlew build -x test

.PHONY: devenv-backend-server
devenv-backend-server:
	$(RUNNER) backend-server java -jar application/build/libs/application.jar


.PHONY: install-web-server
_install-web-server: ## install web-server dependencies
	$(RUNNER) web-server sh -c "yarn install && yarn build:dst:pre"

.PHONY: devenv-web-server
devenv-web-server:
	$(RUNNER) web-server sh -c "yarn install && yarn sd:r"

.PHONY: install-room-server
_install-room-server:
	$(RUNNER) room-server sh -c "yarn install && yarn build:dst:pre"

.PHONY: devenv-room-server
devenv-room-server: 
	$(RUNNER) room-server yarn start:room-server


.PHONY: build-socket-server
build-socket-server:
	$(BUILDER) socket-server 

.PHONY: install-socket-server
_install-socket-server:
	$(RUNNER) socket-server sh -c "cd packages/socket-server/ && yarn"
	  
.PHONY: devenv-socket-server
devenv-socket-server:
	$(RUNNER) socket-server sh -c "cd packages/socket-server/ && yarn run start:dev"



.PHONY: install
install: _install-web-server _install-backend-server _install-socket-server _install-room-server ## install all dependencies with docker devenv
	echo 'Install Finished'

.PHONY:
clean: ## clean and delete git ignore and dirty files
	git clean -fxd
###### buildpush ######


buildpush-init-db: ## build and push the `init-db`container 
	cd init-db ;\
	make buildpush

buildpush-roomserver: ## ghcr.io/vikadata/vika/room-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	build_docker room-server

buildpush-webserver: ## ghcr.io/vikadata/vika/web-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	source scripts/build_web.sh build_saas

buildpush-componentdoc: ## ghcr.io/vikadata/vika/component-doc
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	build_docker component-doc

buildpush-webserver-op: ## ghcr.io/vikadata/vika/web-server
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
  	source scripts/build_web.sh build_op

buildpush-socketserver:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)";\
	export DOCKERFILE=./packages/socket-server/Dockerfile;\
	build_docker socket-server
     
# bumpversion 
.PHONY: patch
patch: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" ghcr.io/vikadata/vika/bumpversion:latest bumpversion patch

.PHONY: minor
minor: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" ghcr.io/vikadata/vika/bumpversion:latest bumpversion minor

.PHONY: major
major: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" ghcr.io/vikadata/vika/bumpversion:latest bumpversion major

### data environement
.PHONY: dataenv
dataenv:
	make dataenv-up

DATAENV_SERVICES := mysql minio redis rabbitmq mongo1 mongo2 mongo3 init-db init-data-mysql init-data-minio init-mongo

.PHONY: dataenv-up
dataenv-up: _dataenv-volumes
	$(_DATAENV) up -d $(DATAENV_SERVICES)

_dataenv-volumes: ## create data folder with current user permissions
	mkdir -p $$DATA_PATH/.data/mysql \
		$$DATA_PATH/.data/minio/data \
		$$DATA_PATH/.data/minio/config \
		$$DATA_PATH/.data/redis \
		$$DATA_PATH/.data/rabbitmq \
		$$DATA_PATH/.data/mongo1 \
		$$DATA_PATH/.data/mongo2 \
		$$DATA_PATH/.data/mongo3

dataenv-down:
	$(_DATAENV) down

dataenv-ps:
	$(_DATAENV) ps

dataenv-logs:
	$(_DATAENV) logs -f

### production environment

.PHONY: up
up: ## startup the application
	@echo "Please execute 'make pull' first to download & upgrade all images to your machine."
	docker compose up -d

.PHONY: down
down: ## shutdown the application
	docker compose down

.PHONY:ps
ps: ## docker compose ps
	docker compose ps

### docker stuffs

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

### help
.PHONY: search
search:
	@echo " "
	@read -p "Search Command:" s; \
	echo  && grep -E "$$s.*?## .*" $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';
	@echo ' ';
	@read -p "What do you want?>>" command; \
	make $$command;

.PHONY: help
help:
	@echo "$$ANNOUNCE_BODY"
	@echo ' ';
	@grep -E '^[0-9a-zA-Z-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';
	@echo '  '
	@read -p "What do you want?>> " command; \
	make $$command;
