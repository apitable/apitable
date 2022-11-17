
SHELL := /bin/bash

docker_build_app:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export BUILD_ARG="--build-arg JAR_PATH=application/build/libs/*.jar --build-arg PORT=8081"; \
	export DOCKERFILE=Dockerfile; \
	build_docker backend-server

docker_build_dingtalk_server:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export BUILD_ARG="--build-arg JAR_PATH=vikadata-project/social-service-dingtalk/build/libs/*.jar --build-arg PORT=9091 --build-arg PORT=9092"; \
	export DOCKERFILE=Dockerfile; \
	build_docker dingtalk-server

docker_build_space_job_executor:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	export BUILD_ARG="--build-arg JAR_PATH=vikadata-scheduler/scheduler-space/build/libs/*.jar --build-arg PORT=9111"; \
	export DOCKERFILE=Dockerfile; \
	build_docker space-job-executor
      

###### 【backend server unit test】 ######

_test_clean: ## clean the docker in test step
	docker rm -fv $$(docker ps -a --filter "name=test-.*-"$${CI_GROUP_TAG:-0} --format "{{.ID}}") || true

_test_dockers: ## run depends container in test step
	docker-compose -f ../docker-compose-unit-test.yml run -d --name test-mysql-$${CI_GROUP_TAG:-0} test-mysql
	docker-compose -f ../docker-compose-unit-test.yml run -d --name test-mongo-$${CI_GROUP_TAG:-0} test-mongo
	docker-compose -f ../docker-compose-unit-test.yml run -d --name test-redis-$${CI_GROUP_TAG:-0} test-redis
	docker-compose -f ../docker-compose-unit-test.yml run -d --name test-rabbitmq-$${CI_GROUP_TAG:-0} test-rabbitmq

_test_init_db: ## Initialize the database in test step
	docker-compose -f ../docker-compose-unit-test.yml pull test-initdb
	docker-compose -f ../docker-compose-unit-test.yml run --rm -e DB_HOST=test-mysql-$${CI_GROUP_TAG:-0} test-initdb

_test_unit_test: ## unittest and codecov upload
	docker-compose -f ../docker-compose-unit-test.yml run -u $(shell id -u):$(shell id -g) --rm \
		-e MYSQL_HOST=test-mysql-$${CI_GROUP_TAG:-0} \
		-e REDIS_HOST=test-redis-$${CI_GROUP_TAG:-0} \
		-e RABBITMQ_HOST=test-rabbitmq-$${CI_GROUP_TAG:-0} \
		-e MONGO_HOST=test-mongo-$${CI_GROUP_TAG:-0} \
		-e BACKEND_GRPC_PORT=0 \
		unit-test-backend

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

###### 【backend server unit test】 ######

test-ut-backend-docker:
	@echo "$$(docker-compose --version)"
	make _test_clean
	make _test_dockers
	sleep 20
	make _test_init_db
	make _test_unit_test
	make _test_codecov
	@echo "finished unit test，clean up images..."
	make _test_clean