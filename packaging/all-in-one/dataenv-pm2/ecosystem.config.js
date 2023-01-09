module.exports = {
  apps : [{
    name: 'minio',
    script: 'minio server /data/minio',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'mysql',
    script: 'gosu mysql mysqld --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --sql_mode=IGNORE_SPACE,NO_ENGINE_SUBSTITUTION --lower_case_table_names=2',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'openresty',
    script: 'openresty -g "daemon off; error_log stderr;"',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'rabbitmq',
    script: 'gosu rabbitmq rabbitmq-server',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'redis',
    cwd: '/data/redis',
    script: 'gosu redis redis-server --appendonly yes --requirepass "${REDIS_PASSWORD}"',
    max_restarts: 2147483647,
    restart_delay: 1000
  }]
};
