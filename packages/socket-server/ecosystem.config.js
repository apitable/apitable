// eslint-disable-next-line no-undef
const instanceCount = parseInt(process.env.INSTANCE_COUNT, 10) || 1;
// eslint-disable-next-line no-undef
const maxMemoryRestart = process.env.INSTANCE_MAX_MEMORY || '1452M';
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'socket',
      script: './dist/main.js',
      cwd: 'packages/socket-server',
      // restart from memory
      max_memory_restart: maxMemoryRestart,
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
