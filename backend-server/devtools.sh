#!/bin/bash

set -e

cd "$(dirname $0)"


function setup_redis {
    docker-compose -f ./docker-compose.yml up -d vika-redis
}

function migrate_mysql() {
    ../db-manage/.depreciated/upgrade_db.sh $1
}

function setup_mysql {
    docker-compose -f ./docker-compose.yml up -d vika-mysql
    docker-compose -f ./docker-compose.yml up -d vika-adminer

    echo "Waiting for mysql initialization ..."
    sleep 8
    migrate_mysql dev
}

function setup_mysql_for_test () {
    docker-compose -f ./docker-compose.yml up --force-recreate -V -d vika-mysql-test

    echo "Waiting for mysql initialization ..."
    sleep 8
    migrate_mysql test
}

function launch_service_api () {
    ./gradlew build -x test
    java -jar vikadata-service/vikadata-service-api/build/libs/vikadata-service-api.jar
}

function setup_rabbitmq {
    docker-compose -f ./docker-compose.yml up -d vika-rabbit-mq
}

function run_tests () {
    # Accept Env vars for tests running on CI
    # The default values are for tests running locally
    redis_host=${REDIS_HOST:-'127.0.0.1'}
    redis_db=${REDIS_DB:-5}
    mysql_host=${MYSQL_HOST:-'127.0.0.1'}
    mysql_port=${MYSQL_PORT:-33061}
    mysql_db_name=${MYSQL_DATABASE:-'vika_test'}

    SPRING_REDIS_DATABASE=${redis_db} \
      SPRING_REDIS_HOST=${redis_host} \
      SPRING_DATASOURCE_URL="jdbc:mysql://${mysql_host}:${mysql_port}/${mysql_db_name}?characterEncoding=utf8&autoReconnect=true" \
      ./gradlew test
}

function init_user () {
    idx="$1"
    if [[ $1 == 0 ]]; then
        idx=""
    fi

    curl -X POST 'http://127.0.0.1:8081/api/v1/gm/new/user' \
      -H 'Content-Type: application/json' \
      -d "{
          \"password\": \"123123\",
          \"username\": \"tester${idx}@vikadata.com\"
      }"
}

function init_users () {
    for idx in 0 1 2 3 4
    do
        init_user $idx
        echo ""
    done
}

function prepare_client_release () {
    html_base64=$(base64 <<< cat ../datasheet/packages/datasheet/public/index.html)
    sql="
      INSERT INTO vika_client_release_version
      (version, description, publish_user, html_content)
      VALUES
      ( 'dev', '', 'shell', '$html_base64' );
    "
    echo $sql
    echo "Tips: Execute the SQL above to insert the index.html from datasheet src into table vika_client_release_version."
}

function migrate_mysql_custom() {
  if [[ ! $DB_HOST ]]; then
      echo "please set env DB_HOST in your system environment";
      exit ;
  else
    echo "DB_HOST: $DB_HOST"
  fi

  if [[ ! $DB_PORT ]]; then
      echo "please set env DB_PORT in your system environment";
      exit ;
  fi


  echo "DB_PORT: $DB_PORT"
  read -p "Please check env vars above, do you wish to execute migrate update immediately (y/n)? " yn
  case ${yn:0:1} in
      y|Y )
          ../db-manage/.depreciated/upgrade_db.sh dev $DB_HOST $DB_PORT
          ;;
      * )
          exit ;;
  esac
}

# add new cmd entry here
cmds=( \
setup-redis \
setup-mysql \
setup-rabbitmq \
launch-service-api \
run-tests \
migrate-mysql \
setup-mysql-for-test \
init-users \
prepare-client-release \
migrate-mysql-custom \
)

function do_command () {
    case $1 in
        setup-redis)
            setup_redis
            ;;
        setup-mysql)
            setup_mysql
            ;;
        setup-rabbitmq)
            setup_rabbitmq
            ;;
        launch-service-api)
            launch_service_api
            ;;
        run-tests)
            run_tests
            ;;
        migrate-mysql)
            migrate_mysql ${2:-dev}
            ;;
        setup-mysql-for-test)
            setup_mysql_for_test
            ;;
        init-users)
            init_users
            ;;
        prepare-client-release)
            prepare_client_release
            ;;
        migrate-mysql-custom)
            migrate_mysql_custom
            ;;
        *)
            echo "No command matched here."
            ;;
    esac
}


# The functional codes for this shell start from here, you can ignore

function select_cmd () {
    echo "Please select what you want to do:"
    select CMD in ${cmds[*]}; do
        if [[  $(in_array $CMD ${cmds[*]}) = 0 ]]; then
            do_command $CMD
            break
        fi
    done
}

function select_arg () {
    cmd=$1
    shift 1
    options=("$@")

    echo "Please select which arg you want:"
    select ARG in ${options[*]}; do
        if [[  $(in_array ${ARG} ${options[*]}) = 0 ]]; then
            ${cmd} ${ARG}
            break
        fi
    done
}

function in_array () {
    TARGET=$1
    shift 1
    for ELEMENT in $*; do
        if [[ "$TARGET" == "$ELEMENT" ]]; then
            echo 0
            return 0
        fi
    done
    echo 1
    return 1
}

function main () {
    if [[ $1 != "" && $(in_array $1 ${cmds[*]}) = 0 ]]; then
        do_command $*
    else
        select_cmd
    fi
}

main $*
