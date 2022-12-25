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

import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { join, resolve } from 'path';
import { isDev } from 'socket/common/helper';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

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
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  isDev() ?
    // Development environment friendly output log format
    nestWinstonModuleUtilities.format.nestLike(defaultAppName, { colors: true, prettyPrint: true }) :
    // Production environment using Json format + elk to analyze logs
    winston.format.json()
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
