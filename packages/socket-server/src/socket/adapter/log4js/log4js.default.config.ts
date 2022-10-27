import { join, resolve } from 'path';
import { Configuration } from 'log4js';
import { LOG_BACKUPS, LOG_MAX_SIZE } from 'src/socket/constants/log4js.constants';

export function buildDefaultConfig(level: string): Configuration {
  const basePath = resolve(process.cwd(), 'logs');
  return {
    pm2: true,
    appenders: {
      appLogger: {
        filename: join(basePath, 'socket-server.all.log'),
        maxLogSize: LOG_MAX_SIZE,
        keepFileExt: true,
        backups: LOG_BACKUPS,
        type: 'file',
        layout: {
          type: 'pattern',
          pattern: 'Log >>> %d{yyyy-MM-dd hh:mm:ss.SSS} pid:%z [%p] %c %m',
        },
      },
      consoleLogger: {
        type: 'console',
        layout: {
          type: 'colored',
        },
        level: 'debug',
      },
    },
    categories: {
      default: {
        appenders: ['consoleLogger', 'appLogger'],
        level,
      },
    },
  };
}
