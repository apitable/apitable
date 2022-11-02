// eslint-disable-next-line no-undef
const instanceCount = parseInt(process.env.INSTANCE_COUNT, 10) || 4;
// eslint-disable-next-line no-undef
const maxMemoryRestart = process.env.INSTANCE_MAX_MEMORY || '1452M';
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'nest',
      script: './dist/main.js',
      cwd: 'packages/room-server',
      // restart from memory
      max_memory_restart: maxMemoryRestart,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      exec_mode: 'cluster',
      instances: instanceCount,
      // exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      // applications running for less time are considered to be abnormally started
      min_uptime: '5m',
      // maximum number of abnormal restarts, i.e. restarts with less than min_uptime runtime
      max_restarts: 5,
      // no log output
      out_file: '/dev/null',
      // no log output
      error_file: '/dev/null',
    },
  ],
};
