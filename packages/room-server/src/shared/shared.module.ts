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

import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { MiddlewareModule } from 'shared/middleware/middleware.module';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { EnvConfigModule } from 'shared/services/config/env.config.module';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { HttpConfigService } from './services/config/http.config.service';
import { JavaModule } from './services/java/java.module';
import { QueueDynamicModule } from './services/queue/queue.dynamic.module';
import { RestService } from './services/rest/rest.service';
import { ClientStorage } from './services/socket/client.storage';
import { EventModule } from './event/event.module';

@Global()
@Module({
  imports: [
    JavaModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    MiddlewareModule,
    EnvConfigModule,
    WinstonModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
    QueueDynamicModule.forRoot(),
  ],
  controllers: [],
  providers: [DatabaseConfigService, EventModule, RestService, ClientStorage],
  exports: [
    JavaModule,
    HttpModule,
    MiddlewareModule,
    EnvConfigModule,
    EventModule,
    DatabaseConfigService,
    RestService,
    ClientStorage,
    QueueDynamicModule.forRoot(),
  ],
})
export class SharedModule {}
