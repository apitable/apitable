module.exports = {
  apps : [{
    name: 'minio',
    script: 'minio --certs-dir /apitable/minio/config/certs server /apitable/minio/data',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'mysql',
    script: 'gosu "${GOSU_USER}" mysqld --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --sql_mode=IGNORE_SPACE,NO_ENGINE_SUBSTITUTION --lower_case_table_names=2',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'gateway',
    script: 'openresty -g "daemon off; error_log stderr;"',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'rabbitmq',
    script: 'RABBITMQ_MNESIA_BASE=/apitable/rabbitmq RABBITMQ_DEFAULT_USER=${RABBITMQ_USERNAME} RABBITMQ_DEFAULT_PASS=${RABBITMQ_PASSWORD} gosu "${GOSU_USER}" rabbitmq-server',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'redis',
    cwd: '/apitable/redis',
    script: 'gosu "${GOSU_USER}" redis-server --appendonly yes --requirepass "${REDIS_PASSWORD}"',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }]
};
