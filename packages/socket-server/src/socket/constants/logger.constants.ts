import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { join, resolve } from 'path';
import { isDev } from 'src/socket/common/helper';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

// app name
const defaultAppName = 'socket-server';

// logger directory
const logDir = resolve(process.cwd(), 'logs');

// logger exception file
const exceptionFile = join(logDir, 'exceptions.log');
// logger error file
const errorFile = join(logDir, 'error.log');
// logger app file
const logFile = join(logDir, `${defaultAppName}-%DATE%.log`);

// logger level
const defaultLogLevel = process.env.LOG_LEVEL || 'info';

// logger rotate maxSize
const defaultMaxSize = process.env.LOG_MAX_SIZE || '50m';

// logger rotate maxFiles
const defaultMaxFiles = '14d';

// logger formatter
const formatter = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike(defaultAppName)
);

// logger transports
// console print configuration
const consoleTransport = new winston.transports.Console({
  format: formatter,
  level: defaultLogLevel
});
const logTransports = [
  consoleTransport,
  new winston.transports.File({
    level: 'error',
    filename: errorFile
  }),
  new DailyRotateFile({
    filename: logFile,
    datePattern: 'YYYY-MM-DD-HH',
    maxFiles: defaultMaxFiles,
    maxSize: defaultMaxSize
  })
];

// create logger instance
const logger = winston.createLogger({
  level: defaultLogLevel,
  format: formatter,
  transports: isDev() ? consoleTransport : logTransports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: exceptionFile
    })
  ],
  exitOnError: false
});

export default logger;
export { logger as instance };