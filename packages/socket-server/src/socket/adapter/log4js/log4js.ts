import { Inject, LoggerService, Injectable } from '@nestjs/common';
import { getLogger, Logger, configure, Configuration } from 'log4js';
import { LOG4JS_OPTION, LoggerLevel } from 'src/socket/constants/log4js.constants';
import { buildDefaultConfig } from './log4js.default.config';

@Injectable()
export class Log4js implements LoggerService {
  private loggers: Map<string, Logger>;

  constructor(@Inject(LOG4JS_OPTION) options?: Configuration | string) {
    this.loggers = new Map();
    if (typeof options === 'string') {
      options = buildDefaultConfig(options);
    } else if (typeof options === 'undefined') {
      options = buildDefaultConfig(this.getLogLevel());
    }
    configure(options);
  }

  // tslint:disable-next-line:typedef
  getLogger(loggerName = 'APP') {
    let logger = this.loggers.get(loggerName);
    if (!logger) {
      logger = getLogger(loggerName);
      this.loggers.set(loggerName, logger);
    }
    return logger;
  }

  log(message: any, context?: string) {
    this.getLogger().info(this.getMessage(message), context);
  }

  error(message: any, trace?: string, context?: string) {
    this.getLogger().error(this.getMessage(message), trace, context);
  }

  warn(message: any, context?: string) {
    this.getLogger().warn(this.getMessage(message), context);
  }

  debug(message: any, context?: string) {
    this.getLogger().debug(this.getMessage(message), context);
  }

  getLogLevel() {
    return process.env.LOG_LEVEL ? process.env.LOG_LEVEL : LoggerLevel.INFO;
  }

  getMessage(message: any) {
    try {
      return JSON.stringify(message);
    } catch (e) {
      return message;
    }
  }
}
