import { Injectable } from '@nestjs/common';
import { isDevMode } from 'app.environment';
import { ILoggerModuleOptionsFactory, LoggerModuleOptions } from 'modules/logger/winston.interfaces';
import { utilities as nestWinstonModuleUtilities } from 'modules/logger/winston.utilities';
import { resolve } from 'path';
import * as winston from 'winston';

/**
 * 日志配置服务
 */
@Injectable()
export class LoggerConfigService implements ILoggerModuleOptionsFactory {

  createWinstonModuleOptions(): LoggerModuleOptions {
    // 日志存储路径
    const logPath = resolve(process.cwd(), 'logs');
    // 日志级别
    const level = process.env.LOG_LEVEL || 'info';
    // 日志文件大小
    // const maxFileSize = process.env.LOGGING_MAX_FILE_SIZE || '10m';
    // const backupDatePattern = process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD';
    // 输出格式，所有记录日志的格式统一，不需要在transports里面特殊指定
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({ fillWith: ['spanId','traceId','parentTraceId'] }),
      nestWinstonModuleUtilities.format.nestLike(),
    );
    // // 运行滚动备份日志
    // const dailyRotateFileTransport = new DailyRotateFile({
    //   level,
    //   // 备份目录
    //   dirname: join(logPath, 'backup'),
    //   // 文件名称
    //   filename: 'application-%DATE%.log',
    //   // 适配Moment.js日期格式, 代表当天的日期格式
    //   // HH: 每小时保存一份，一天有24份日志文件
    //   // YYYY-MM-DD: 每一天保存一份，这是默认的
    //   datePattern: backupDatePattern,
    //   // 是否压缩
    //   zippedArchive: true,
    //   // 每个日志文件的大小
    //   maxSize: maxFileSize,
    //   // 最多保存14天的日志
    //   maxFiles: '14d',
    // });
    // // 专门的error滚动备份日志
    // const errorDailyRotateFileTransport = new DailyRotateFile({
    //   level: 'error',
    //   // 备份目录
    //   dirname: join(logPath, 'backup'),
    //   // 文件名称
    //   filename: 'error-%DATE%.log',
    //   // 适配Moment.js日期格式, 代表当天的日期格式
    //   // HH: 每小时保存一份，一天有24份日志文件
    //   // YYYY-MM-DD: 每一天保存一份，这是默认的
    //   datePattern: backupDatePattern,
    //   // 是否压缩
    //   zippedArchive: true,
    //   // 每个日志文件的大小
    //   maxSize: maxFileSize,
    //   // 最多保存14天的日志
    //   maxFiles: '14d',
    // });
    // 控制台打印配置
    const console = new winston.transports.Console({ level });
    // 开发环境不打印文件日志
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
      // 日志记录异常不影响应用运行
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
