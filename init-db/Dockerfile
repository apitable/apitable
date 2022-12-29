FROM liquibase/liquibase:4.8
RUN lpm add mysql --global
ADD src/main/resources /liquibase/changelog

CMD ["sh", "-c", "echo ${ACTION}; docker-entrypoint.sh \
                    --classpath=/liquibase/changelog \
                    --changelog-file=${CHANGELOG_FILE:=db/changelog/db.changelog-master.xml} \
                    --log-level=warning \
                    --username=${DB_USERNAME} \
                    --password=${DB_PASSWORD} \
                    --driver=\"com.mysql.cj.jdbc.Driver\" \
                    --database-changelog-table-name=\"${DATABASE_TABLE_PREFIX:=vika_}db_changelog\" \
                    --database-changelog-lock-table-name=\"${DATABASE_TABLE_PREFIX:=vika_}db_changelog_lock\" \
                    --url=\"jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?characterEncoding=utf8&autoReconnect=true&useSSL=true\" \
                     ${ACTION:=update} \
                    -Dtable.prefix=${DATABASE_TABLE_PREFIX:=vika_}"]



                     