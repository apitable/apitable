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
    script: 'while ! curl -fLI http://web-server:3000; do sleep 5; done && openresty -g "daemon off; error_log stderr;"',
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
  }, {
    name: 'backend-server',
    cwd: '/app/backend-server',
    script: 'init-appdata.sh && java -Djava.security.egd=file:/dev/./urandom -jar app.jar',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'databus-server',
    cwd: '/app/databus-server',
    script: './databus-server',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'room-server',
    cwd: '/app/room-server/packages/room-server',
    env: {
      NODE_ENV: "production",
      PORT: "3333",
      ENABLE_SOCKET: "true"
    },
    script: './dist/main.js',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'web-server',
    cwd: '/app/web-server/packages/datasheet',
    env: {
      NODE_ENV: "production",
      PORT: "3000"
    },
    script: 'node server.js',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }, {
    name: 'imageproxy-server',
    cwd: '/app/imageproxy-server',
    script: './imageproxy -baseURL "${AWS_ENDPOINT}"',
    out_file: '/dev/null',
    error_file: '/dev/null',
    max_restarts: 2147483647,
    restart_delay: 1000
  }]
};
