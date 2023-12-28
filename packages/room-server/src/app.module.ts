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

import { RedisModule } from '@apitable/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActuatorModule } from 'actuator/actuator.module';
import { AiDynamicModule } from 'ai/ai.dynamic.module';
import { defaultLanguage, enableOtelJaeger, enableScheduler, enableSocket } from 'app.environment';
import { RobotModule } from 'automation/robot.module';
import { DatabaseModule } from 'database/database.module';
import { DeveloperModule } from 'developer/developer.module';
import { EmbedDynamicModule } from 'embed/embed.dynamic.module';
import { FusionApiDynamicModule } from 'fusion/fusion-api.dynamic.module';
import { FusionApiModule } from 'fusion/fusion.api.module';
import { GrpcModule } from 'grpc/grpc.module';
import { I18nModule } from 'nestjs-i18n';
import { NodeModule } from 'node/node.module';
import { resolve } from 'path';
import { I18nJsonParser } from 'shared/adapters/I18n.json.parser';
import { DatabaseConfigService, EnvConfigModule, redisModuleOptions } from 'shared/services/config';
import { JaegerDynamicModule } from 'shared/services/jaeger/jaeger.dynamic.module';
import { SchedTaskDynamicModule } from 'shared/services/sched_task/sched.task.dynamic.module';
import { SharedModule } from 'shared/shared.module';
import { SocketModule } from 'socket/socket.module';
import { UnitModule } from 'unit/unit.module';
import { UserModule } from 'user/user.module';
import { WorkDocDynamicModule } from 'workdoc/workdoc.dynamic.module';

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
      useFactory: () => redisModuleOptions(),
    }),
    EnvConfigModule,
    I18nModule.forRoot({
      loaderOptions: {},
      fallbackLanguage: defaultLanguage,
      loader: I18nJsonParser,
    }),
    JaegerDynamicModule.register(enableOtelJaeger),
    ScheduleModule.forRoot(),
    SchedTaskDynamicModule.register(enableScheduler),
    EmbedDynamicModule.forRoot(),
    FusionApiDynamicModule.forRoot(),
    SocketModule.register(enableSocket),
    WorkDocDynamicModule.forRoot(),
    AiDynamicModule.forRoot(),
    ActuatorModule,
    FusionApiModule,
    DatabaseModule,
    NodeModule,
    UserModule,
    UnitModule,
    GrpcModule,
    RobotModule,
    DeveloperModule,
  ],
  providers: [],
})
export class AppModule {}
