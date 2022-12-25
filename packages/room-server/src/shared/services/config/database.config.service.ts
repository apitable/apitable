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

import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDevMode } from 'app.environment';

/**
 * database configuration service
 */
@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, port, username, password, database, entityPrefix, connectionLimit, keepConnectionAlive, retryDelay } = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT!) || 3306,
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || 'qwe123456',
      database: process.env.MYSQL_DATABASE || 'vikadata',
      entityPrefix: process.env.DATABASE_TABLE_PREFIX || 'vika_',
      connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT!) || 20,
      keepConnectionAlive: !!process.env.MYSQL_KEEP_CONNECTION_ALIVE || this.configService.get<boolean>('MYSQL_KEEP_CONNECTION_ALIVE', true),
      retryDelay: parseInt(process.env.MYSQL_RETRY_DELAY!) || 300,
    };
    return {
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      entityPrefix,
      // don't change the below settings
      // entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // use utf8mb4 to fix emoji storage issue
      charset: 'utf8mb4',
      // print SQL logs in dev mode only
      logging: isDevMode,
      connectTimeout: 60000,
      supportBigNumbers: true,
      bigNumberStrings: true,
      // don't change synchronize setting
      synchronize: false,
      // connection pool settings
      keepConnectionAlive,
      retryDelay,
      verboseRetryLog: true,
      extra: {
        connectionLimit
      }
    };
  }
}
