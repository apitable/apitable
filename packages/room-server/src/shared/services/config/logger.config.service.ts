/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@nestjs/common';
import { isDevMode } from 'app.environment';
import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import { join, resolve } from 'path';
import { APPLICATION_NAME } from 'shared/common/constants/bootstrap.constants';
import { escFormat, tracingFormat } from 'shared/helpers/logger/logger.format.helper';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {

  // app name
  private defaultAppName = APPLICATION_NAME;

  // logger directory
  private logDir = resolve(process.cwd(), `logs/${this.defaultAppName}`);

  // logger exception file
  private exceptionFile = join(this.logDir, 'exceptions.log');
  // logger error file
  private errorFile = join(this.logDir, 'error.log');
  // logger app file
  private logFile = join(this.logDir, '%DATE%.log');

  // logger level
  private defaultLogLevel = process.env.LOG_LEVEL || 'info';

  // logger rotate maxSize
  private defaultMaxSize = process.env.LOGGING_MAX_FILE_SIZE || '50m';

  // logger rotate maxFiles
  private defaultMaxFiles = process.env.LOGGER_MAX_HISTORY_DAYS || '7d';

  // logger formatter
  private formatter = winston.format.combine(
    ...isDevMode ?
      [
        tracingFormat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        // Development environment friendly output log format
        nestWinstonModuleUtilities.format.nestLike(this.defaultAppName, { colors: true, prettyPrint: true }),
      ] :
      [
        // Production environment using Json format + elk to analyze logs
        escFormat({ format: 'YYYY-MM-DD HH:mm:ss.SSS' })
      ]
  );

  // logger transports
  // console print configuration
  private consoleTransport = new winston.transports.Console({
    format: this.formatter,
    level: this.defaultLogLevel
  });
  private logTransports = [
    this.consoleTransport,
    new winston.transports.File({
      level: 'error',
      filename: this.errorFile
    }),
    new DailyRotateFile({
      filename: this.logFile,
      datePattern: 'YYYY-MM-DD-HH',
      maxFiles: this.defaultMaxFiles,
      maxSize: this.defaultMaxSize
    })
  ];

  createWinstonModuleOptions(): Promise<WinstonModuleOptions> | WinstonModuleOptions {
    return {
      level: this.defaultLogLevel,
      format: this.formatter,
      transports: isDevMode ? this.consoleTransport : this.logTransports,
      exceptionHandlers: [
        new winston.transports.File({
          filename: this.exceptionFile
        })
      ],
      exitOnError: false
    };
  }
}
