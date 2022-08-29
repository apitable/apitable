export const LOG4JS_OPTION = Symbol('LOG4JS_OPTION');
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

/**
 * 最大备份数量，备份文件的数量，*.1是最新的备份
 */
export const LOG_BACKUPS = 5;

/**
 *  10M
 */
export const LOG_MAX_SIZE = 10485760;
