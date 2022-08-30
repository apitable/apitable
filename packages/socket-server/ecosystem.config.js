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
      // 基于内存重启
      max_memory_restart: maxMemoryRestart,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      exec_mode: 'cluster',
      instances: instanceCount,
      // 指数退避重启延迟
      exp_backoff_restart_delay: 100,
      // 应用运行少于时间被认为是异常启动
      min_uptime: '5m',
      // 最大异常重启次数，即小于min_uptime运行时间重启次数
      max_restarts: 5,
      // 不输出日志
      out_file: '/dev/null',
      // 不输出日志
      error_file: '/dev/null',
    },
  ],
};
