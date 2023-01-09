#!/bin/bash

set -e

if [[ -n "$(ls -A /var/lib/mysql)" ]]; then
    exit
fi

gosu mysql mysqld --initialize

gosu mysql mysqld --daemonize --skip-grant-tables --skip-networking

if [[ -n "${MYSQL_ROOT_PASSWORD}" ]]; then
    mysql -u root -h localhost -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}'; GRANT ALL ON *.* TO 'root'@'localhost' WITH GRANT OPTION; CREATE USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}'; GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
fi

if [[ -n "${MYSQL_DATABASE}" ]]; then
    mysql -u root -h localhost -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE ${MYSQL_DATABASE};"
fi

mysqladmin -u root -h localhost shutdown -p"${MYSQL_ROOT_PASSWORD}"
