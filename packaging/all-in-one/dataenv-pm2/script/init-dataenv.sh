#!/bin/bash

set -e

for i in /apitable/minio/data /apitable/minio/config; do
    if [[ ! -d "${i}" ]]; then
        mkdir -p "${i}"
    fi
done

for i in /apitable/mysql /apitable/redis /apitable/rabbitmq; do
    if [[ ! -d "${i}" ]]; then
        install --directory --owner "${GOSU_USER}" --group "${GOSU_USER}" "${i}"
    fi
done

if [[ -n "$(ls -A /apitable/mysql)" ]]; then
    exit
fi

gosu "${GOSU_USER}" mysqld --initialize

gosu "${GOSU_USER}" mysqld --daemonize --skip-grant-tables --skip-networking

if [[ -n "${MYSQL_ROOT_PASSWORD}" ]]; then
    mysql -u root -h localhost -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}'; GRANT ALL ON *.* TO 'root'@'localhost' WITH GRANT OPTION; CREATE USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}'; GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
fi

if [[ -n "${MYSQL_DATABASE}" ]]; then
    mysql -u root -h localhost -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE ${MYSQL_DATABASE};"
fi

mysqladmin -u root -h localhost shutdown -p"${MYSQL_ROOT_PASSWORD}"
