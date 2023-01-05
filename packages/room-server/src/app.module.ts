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

import { RedisModule, RedisModuleOptions } from '@apitable/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActuatorModule } from 'actuator/actuator.module';
import { enableScheduler } from 'app.environment';
import { RobotModule } from 'automation/robot.module';
import { DatabaseModule } from 'database/database.module';
import { SchedTaskDynamicModule } from 'shared/services/sched_task/sched.task.dynamic.module';
import { FusionApiModule } from 'fusion/fusion.api.module';
import { I18nModule } from 'nestjs-i18n';
import path, { resolve } from 'path';
import { DEFAULT_LANGUAGE, I18nJsonParser } from 'shared/adapters/I18n.json.parser';
import { SharedModule } from 'shared/shared.module';
import { SocketModule } from 'socket/socket.module';
import { EmbedDynamicModule } from 'embed/embed.dynamic.module';
import { FusionApiDynamicModule } from 'fusion/fusion-api.dynamic.module';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { EnvConfigModule } from 'shared/services/config/env.config.module';
import { GrpcModule } from 'grpc/grpc.module';
import { NodeModule } from 'node/node.module';
import { DeveloperModule } from 'developer/developer.module';
import { UnitModule } from 'unit/unit.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    SharedModule,
    // environment configuration
    ConfigModule.forRoot({
      envFilePath: [resolve(__dirname, '../env/.env.development.local'), resolve(__dirname, '../env/.env.defaults')],
      encoding: 'utf-8',
      isGlobal: true,
      expandVariables: true,
    }),
    // database configuration
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    // Redis configuration
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => {
        return redisModuleOptions();
      },
    }),
    EnvConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      parser: I18nJsonParser as any,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
    ScheduleModule.forRoot(),
    SchedTaskDynamicModule.register(enableScheduler),
    EmbedDynamicModule.forRoot(),
    FusionApiDynamicModule.forRoot(),
    SocketModule.register(true), // TODO: whether or not use socket-module
    ActuatorModule,
    FusionApiModule,
    DatabaseModule,
    NodeModule,
    UserModule,
    UnitModule,
    DeveloperModule,
    GrpcModule,
    RobotModule,
  ],
  providers: [],
})
export class AppModule {
}

const redisModuleOptions = () => {
  const { host, port, password, db } = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!) || 6379,
    db: parseInt(process.env.REDIS_DB!) || 0,
    password: process.env.REDIS_PASSWORD,
  };
  const redisConfig: RedisModuleOptions = {
    host,
    port,
  };
  // use config values if there is a configuration
  if (password) {
    redisConfig.password = password;
  }
  if (db) {
    redisConfig.db = db;
  }
  return redisConfig;
};
