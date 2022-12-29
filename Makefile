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

_DATAENV := docker compose --env-file $$ENV_FILE -p $$DEVENV_PROJECT_NAME -f docker-compose.yaml -f docker-compose.dataenv.yaml
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


################################ build

build: ## build
	make build-local

build-local:
	make _build-java
	make _build-core
	make _build-room

_build-java:
	cd backend-server && ./gradlew build -x test

_build-core: ## build core
	yarn workspaces focus @apitable/core @apitable/i18n-lang root
	yarn build:i18n
	yarn build:core

_build-room: ## build room server
	yarn workspaces focus @apitable/room-server root
	yarn build:sr
	yarn build:room-server

################################ test

test: ## do test, unit tests, integration tests and so on.
	make _test-ut-core-cov

test-e2e: ## start integration tests
	yarn cy:run
test-e2e-open: ## start and debug integration tests
	yarn cy:open

###### 【core unit test】 ######

_test-ut-core:
	make _build-core
	yarn test:core

_test-ut-core-cov:
	make _build-core
	yarn test:core:cov

###### 【core unit test】 ######

###### 【room server unit test】 ######
SIKP_INITDB=false
RUN_TEST_ROOM_MODE=docker

_test_init_db:
	@echo "${GREEN} Run Test Room Mode:$(RUN_TEST_ROOM_MODE) ${RESET}"
	@echo "${YELLOW}pull [init-db:latest] the latest image...${RESET}"
	docker compose -f docker-compose.unit-test.yml pull test-initdb
ifeq ($(RUN_TEST_ROOM_MODE),docker)
	docker compose -f docker-compose.unit-test.yml run --rm \
	-e DB_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
	test-initdb
else ifeq ($(RUN_TEST_ROOM_MODE),local)
	docker compose -f docker-compose.unit-test.yml run --rm \
	-e DB_HOST=test-mysql \
	test-initdb
endif
	@echo "${GREEN}initialize unit test db completed...${RESET}"

_test_clean: ## clean the docker in test step
	docker rm -fv $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true

_test_dockers: ## run depends container in test step
	docker compose -f docker-compose.unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql ;\
	docker compose -f docker-compose.unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis ;\
	docker compose -f docker-compose.unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq

test-ut-room-local:
	make _test_clean
	docker compose -f docker-compose.unit-test.yml up -d test-redis test-mysql test-rabbitmq
ifeq ($(SIKP_INITDB),false)
	sleep 20
	make _test_init_db RUN_TEST_ROOM_MODE=local
endif
	make _build-room
	MYSQL_HOST=127.0.0.1 MYSQL_PORT=23306 MYSQL_USERNAME=apitable MYSQL_PASSWORD=password MYSQL_DATABASE=apitable_test MYSQL_USE_SSL=false \
	REDIS_HOST=127.0.0.1 REDIS_PORT=26379 REDIS_DB=4 REDIS_PASSWORD= \
	RABBITMQ_HOST=127.0.0.1 RABBITMQ_PORT=25672 RABBITMQ_USERNAME=apitable RABBITMQ_PASSWORD=password \
	INSTANCE_COUNT=1 APPLICATION_NAME=NEST_REST_SERVER \
	yarn test:ut:room
	make _test_clean

test-ut-room-docker:
	@echo "${LIGHTPURPLE}Working dir, $(shell pwd)${RESET}"
	@echo "${LIGHTPURPLE}$$(docker compose version)${RESET}"
	make _test_clean
	make _test_dockers
	sleep 20
	make _test_init_db RUN_TEST_ROOM_MODE=docker
	docker compose -f docker-compose.unit-test.yml build unit-test-room
	docker compose -f docker-compose.unit-test.yml run --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		unit-test-room yarn test:ut:room:cov
	@echo "${GREEN}finished unit test, clean up images...${RESET}"
	if [ -d "./packages/room-server/coverage" ]; then \
		sudo chown -R $(shell id -u):$(shell id -g) ./packages/room-server/coverage; \
	fi
	make _test_clean

_clean_room_jest_coverage:
	rm -fr ./packages/room-server/coverage || true

###### 【backend server unit test】 ######

_test_backend_unit_test: ## backend server unit test
	docker compose -f docker-compose.unit-test.yml run -u $(shell id -u):$(shell id -g) --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		-e BACKEND_GRPC_PORT=0 \
		unit-test-backend

test-ut-backend-docker:
	@echo "$$(docker compose version)"
	make _test_clean
	make _test_dockers
	sleep 20
	make _test_init_db RUN_TEST_ROOM_MODE=docker
	make _test_backend_unit_test
	@echo "${GREEN}finished unit test, clean up images...${RESET}"
	make _test_clean

###### 【backend server unit test】 ######

buildpush-docker: ## build all and push all to hub.docker.io registry
	echo $$APITABLE_DOCKER_HUB_TOKEN | docker login -u apitable --password-stdin ;\
	$(BUILDER) --push

.PHONY: build
build-docker: ## build all containers
	$(BUILDER)

.PHONY: _build-socket-server
_build-docker-socket-server:
	$(BUILDER) socket-server

.PHONY: _build-init-db
_build-docker-init-db:
	$(BUILDER) init-db
.PHONY: _build-backend-server
_build-docker-backend-server:
	$(BUILDER) backend-server

###### development environtments ######

define RUN_LOCAL_TXT
Which service do you want to start run?
  1) backend-server
  2) room-server
  3) socket-server
  4) web-server
endef
export RUN_LOCAL_TXT

_check_env: ## check if .env files exists
	@FILE=$$ENV_FILE ;\
	if [ ! -f "$$FILE" ]; then \
			echo "$$FILE does not exist. Please 'make env' first" ;\
			exit 1 ;\
	fi

run: _check_env ## run local code to development environemnt with docker env
	make run-local

.PHONY: run-local
run-local: ## run services with local programming language envinroment
	@echo "$$RUN_LOCAL_TXT"
	@read -p "ENTER THE NUMBER: " SERVICE ;\
 	if [ "$$SERVICE" = "1" ]; then make _run-local-backend-server; fi ;\
 	if [ "$$SERVICE" = "2" ]; then make _run-local-room-server; fi ;\
 	if [ "$$SERVICE" = "3" ]; then make _run-local-socket-server ;fi ;\
 	if [ "$$SERVICE" = "4" ]; then make _run-local-web-server; fi

_run-local-backend-server:
	source scripts/export-env.sh $$ENV_FILE;\
	cd backend-server ;\
	java -jar application/build/libs/application.jar

_run-local-room-server:
	source scripts/export-env.sh $$ENV_FILE;\
	yarn start:room-server

_run-local-web-server:
	source scripts/export-env.sh $$ENV_FILE;\
	yarn sd

_run-local-socket-server:
	source scripts/export-env.sh $$ENV_FILE;\
	cd packages/socket-server ;\
	yarn run start:dev


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
devenv-up:
	$(_DEVENV) up -d

.PHONY: devenv-down
devenv-down: ## debug all devenv services with docker compose up -d
	$(_DEVENV) down -v

devenv-logs: ## follow all devenv services logs
	$(_DEVENV) logs -f
devenv-ps:
	$(_DEVENV) ps

.PHONY: devenv-backend-server
devenv-backend-server:
	$(RUNNER) backend-server java -jar application/build/libs/application.jar


.PHONY: devenv-web-server
devenv-web-server:
	$(RUNNER) web-server sh -c "yarn install && yarn sd"

.PHONY: devenv-room-server
devenv-room-server:
	$(RUNNER) room-server yarn start:room-server


.PHONY: devenv-socket-server
devenv-socket-server:
	$(RUNNER) socket-server sh -c "cd packages/socket-server/ && yarn run start:dev"


.PHONY: install
install: install-local
	@echo 'Install Finished'

.PHONY: install-local
install-local: ## install all dependencies with local programming language environment
	yarn install && yarn build:dst:pre
	cd packages/socket-server && yarn
	cd backend-server && ./gradlew build -x test

.PHONY: install-docker
install-docker: _install-docker-web-server _install-docker-backend-server _install-docker-socket-server _install-docker-room-server ## install all dependencies with docker devenv
	@echo 'Install Finished'

.PHONY: _install-docker-backend-server
_install-docker-backend-server:
	$(RUNNER) backend-server ./gradlew build -x test

.PHONY: _install-docker-socket-server
_install-docker-socket-server:
	$(RUNNER) socket-server sh -c "cd packages/socket-server/ && yarn"

.PHONY: _install-docker-web-server
_install-docker-web-server:
	$(RUNNER) web-server sh -c "yarn install && yarn build:dst:pre"

.PHONY: _install-docker-room-server
_install-docker-room-server:
	$(RUNNER) room-server sh -c "yarn install && yarn build:dst:pre"


.PHONY:
clean: ## clean and delete git ignore and dirty files
	git clean -fxd

###### buildpush ######


# bumpversion
.PHONY: patch
patch: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" apitable/bumpversion:latest bumpversion patch

.PHONY: minor
minor: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" apitable/bumpversion:latest bumpversion minor

.PHONY: major
major: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" apitable/bumpversion:latest bumpversion major

### data environement
.PHONY: dataenv
dataenv:
	make dataenv-up

DATAENV_SERVICES := mysql minio redis rabbitmq init-db init-data-mysql init-data-minio

.PHONY: dataenv-up
dataenv-up: _dataenv-volumes
	$(_DATAENV) up -d $(DATAENV_SERVICES)

_dataenv-volumes: ## create data folder with current user permissions
	mkdir -p $$DATA_PATH/.data/mysql \
		$$DATA_PATH/.data/minio/data \
		$$DATA_PATH/.data/minio/config \
		$$DATA_PATH/.data/redis \
		$$DATA_PATH/.data/rabbitmq \

dataenv-down:
	$(_DATAENV) down -v

dataenv-ps:
	$(_DATAENV) ps

dataenv-logs:
	$(_DATAENV) logs -f

### production environment

.PHONY: up
up: _dataenv-volumes ## startup the application
	@echo "Please execute 'make pull' first to download & upgrade all images to your machine."
	docker compose up -d

.PHONY: down
down: ## shutdown the application
	docker compose down -v

.PHONY:ps
ps: ## docker compose ps
	docker compose ps

### docker stuffs

.PHONY: pull
pull: ## pull all containers and ready to up
	docker compose pull

######################################## init-db

INIT_DB_DOCKER_PATH=apitable/init-db

db-plan: ## init-db dry update
	cd init-db ;\
	docker build -f Dockerfile . --tag=${INIT_DB_DOCKER_PATH}
	docker run --rm --env-file $$ENV_FILE -e ACTION=updateSQL ${INIT_DB_DOCKER_PATH}

db-apply: ## init-db update database structure (use .env)
	cd init-db ;\
	docker build -f Dockerfile . --tag=${INIT_DB_DOCKER_PATH}
	docker run --rm --env-file $$ENV_FILE -e ACTION=update ${INIT_DB_DOCKER_PATH}


db-apply-ee: ## init-db enterprise  database structure (use .env)
	cp -rf ../enterprise/init-db init-db/src/main/resources/db/enterprise;\
	cd init-db ;\
	docker build -f Dockerfile . --tag=${INIT_DB_DOCKER_PATH}
	docker run --rm --network apitable_apitable --env-file $$ENV_FILE -e ACTION=update ${INIT_DB_DOCKER_PATH}


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
