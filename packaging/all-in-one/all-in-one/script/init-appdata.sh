#!/bin/bash

set -e

liquibase \
    "--defaultsFile=/liquibase/liquibase.docker.properties" \
    --classpath=/liquibase/changelog \
    --changelog-file="${CHANGELOG_FILE:=db/changelog/db.changelog-master.xml}" \
    --log-level=warning \
    --username="${MYSQL_USERNAME}" \
    --password="${MYSQL_PASSWORD}" \
    --driver="com.mysql.cj.jdbc.Driver" \
    --database-changelog-table-name="${DATABASE_TABLE_PREFIX:=apitable_}db_changelog" \
    --database-changelog-lock-table-name="${DATABASE_TABLE_PREFIX:=apitable_}db_changelog_lock" \
    --url="jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}?characterEncoding=utf8&autoReconnect=true&useSSL=true" \
    clearChecksums

liquibase \
    "--defaultsFile=/liquibase/liquibase.docker.properties" \
    --classpath=/liquibase/changelog \
    --changelog-file="${CHANGELOG_FILE:=db/changelog/db.changelog-master.xml}" \
    --log-level=warning \
    --username="${MYSQL_USERNAME}" \
    --password="${MYSQL_PASSWORD}" \
    --driver="com.mysql.cj.jdbc.Driver" \
    --database-changelog-table-name="${DATABASE_TABLE_PREFIX:=apitable_}db_changelog" \
    --database-changelog-lock-table-name="${DATABASE_TABLE_PREFIX:=apitable_}db_changelog_lock" \
    --url="jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}?characterEncoding=utf8&autoReconnect=true&useSSL=true" \
    update \
    -Dtable.prefix="${DATABASE_TABLE_PREFIX:=apitable_}"

for action in init-user load; do
    java -jar /app/init-appdata/init-appdata.jar "${action}"
done
