
DOCKER_PATH=ghcr.io/vikadata/vika/init-db
SHELL := /bin/bash

.PHONY: patch
patch: # bump version number patch
	docker run --rm -it --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/app" vikadata/bumpversion bumpversion patch

build-init-db: # local build the init-db
	docker build -f Dockerfile.init-db . --tag=${DOCKER_PATH}

env: ## 生成.env文件，读取1Password，用于init-db本地执行调试
	bash ./scripts/env.sh

plan: build-init-db ## init-db dry update
	docker run --rm --env-file .env -e ACTION=updateSQL ${DOCKER_PATH}

apply: build-init-db ## init-db 本地环境更新远端数据库结构
	docker build -f Dockerfile.init-db . --tag=${DOCKER_PATH}
	docker run --rm --env-file .env -e ACTION=update ${DOCKER_PATH}

docker_build_app:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export BUILD_ARG="--build-arg JAR_PATH=vikadata-service/vikadata-service-api/build/libs/*.jar --build-arg PORT=8081"; \
	export DOCKERFILE=Dockerfile; \
	build_docker backend-server

docker_build_space_job_executor:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export BUILD_ARG="--build-arg JAR_PATH=vikadata-scheduler/scheduler-space/build/libs/*.jar --build-arg PORT=9111"; \
	export DOCKERFILE=Dockerfile; \
	build_docker space-job-executor
      
docker_build_init_db:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export DOCKERFILE=Dockerfile.init-db; \
	build_docker init-db

_test_clean: ## clean the docker in test step
	docker rm -f test_mysql || true
	docker rm -f test_redis || true
	docker rm -f test_rabbitmq || true
	docker network rm test || true


_test_dockers:
	docker network create test
	docker run -d --net test --name test_mysql -e MYSQL_PASSWORD=password -e MYSQL_USER=vika -e MYSQL_DATABASE=vika_dev -e MYSQL_ALLOW_EMPTY_PASSWORD=1 mysql mysqld --sql_mode=IGNORE_SPACE,NO_ENGINE_SUBSTITUTION --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
	docker run -d --net test --name test_redis redis
	docker run -d --net test --name test_rabbitmq -e RABBITMQ_USERNAME=vika -e RABBITMQ_PASSWORD=password -e RABBITMQ_DEFAULT_USER=vika -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management


_test_initdb:
	docker build . -f Dockerfile.init-db --tag=init-db
	docker run --net test -t --rm -e ACTION=update \
	-e DB_HOST=test_mysql \
	-e DB_PORT=3306 \
	-e DB_NAME=vika_dev \
	-e DB_USERNAME=vika \
	-e DB_PASSWORD=password \
	init-db

_test_unittest: ## unittest and codecov upload
	docker run -e JVM_OPTS="-Xmx3200m" --net test --rm -w /app --user $(shell id -u):$(shell id -g) -v $(shell pwd):/app \
	-e MYSQL_HOST=test_mysql -e REDIS_HOST=test_redis -e RABBITMQ_HOST=test_rabbitmq \
	amazoncorretto:8 \
	./gradlew testCodeCoverageReport

_test_codecov:
	curl https://uploader.codecov.io/latest/linux/codecov -o /tmp/codecov
	chmod +x /tmp/codecov
ifndef CODECOV_TOKEN
	read -p "Please enter CODECOV_TOKEN: " CODECOV_TOKEN ;\
	/tmp/codecov -f code-coverage-report/build/reports/jacoco/testCodeCoverageReport/testCodeCoverageReport.xml -t $$CODECOV_TOKEN
endif
ifdef CODECOV_TOKEN
	/tmp/codecov -f code-coverage-report/build/reports/jacoco/testCodeCoverageReport/testCodeCoverageReport.xml -t $$CODECOV_TOKEN
endif

test:
	make _test_clean
	make _test_dockers
	sleep 20
	make _test_initdb
	make _test_unittest
	make _test_codecov
	make _test_clean