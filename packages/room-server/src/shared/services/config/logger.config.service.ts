import { Injectable } from '@nestjs/common';
import { isDevMode } from 'app.environment';
import { ILoggerModuleOptionsFactory, LoggerModuleOptions } from 'shared/logger/winston.interfaces';
import { utilities as nestWinstonModuleUtilities } from 'shared/logger/winston.utilities';
import { resolve } from 'path';
import * as winston from 'winston';

/**
 * Logger configuration service
 */
@Injectable()
export class LoggerConfigService implements ILoggerModuleOptionsFactory {

  createWinstonModuleOptions(): LoggerModuleOptions {
    // logging storage path
    const logPath = resolve(process.cwd(), 'logs');
    // logging level
    const level = process.env.LOG_LEVEL || 'info';
    // logging file size
    // const maxFileSize = process.env.LOGGING_MAX_FILE_SIZE || '10m';
    // const backupDatePattern = process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD';
    // custom and use the standard format for printing logs, without assigning them in the transports
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({ fillWith: ['spanId','traceId','parentTraceId'] }),
      nestWinstonModuleUtilities.format.nestLike(),
    );
    // console logging settings
    const console = new winston.transports.Console({ level });
    // don't print log files in dev mode
    const transports = isDevMode ? [console] : [
      console,
      // dailyRotateFileTransport,
      // errorDailyRotateFileTransport,
      // todo https://github.com/winstonjs/winston/issues/1971
      new winston.transports.File({
        level,
        dirname: logPath,
        filename: 'runtime.log',
      }),
      new winston.transports.File({
        level: 'error',
        dirname: logPath,
        filename: 'error.log',
      }),
    ];
    return {
      level,
      format,
      transports,
      // logging errors wouldn't impact the running of th applications
      exitOnError: false,
      exceptionHandlers: [
        new winston.transports.File({
          dirname: logPath,
          filename: 'exceptions.log',
        }),
      ],
    };
  }
}
