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
//  */
import { Module } from "@nestjs/common";
import {
  AUTOMATION_REDIS_CLIENT,
  AUTOMATION_REDIS_DB,
  AUTOMATION_REDIS_HOST,
  AUTOMATION_REDIS_PASSWORD,
  AUTOMATION_REDIS_PORT
} from '../constants';
import IORedis from 'ioredis';

import { ActionQueue, FlowQueue } from './index';

@Module({
  imports: [],
  providers: [
    {
      useFactory: (): IORedis => {
        return new IORedis({
          host: AUTOMATION_REDIS_HOST,
          port: AUTOMATION_REDIS_PORT,
          password: AUTOMATION_REDIS_PASSWORD,
          db: AUTOMATION_REDIS_DB,
          maxRetriesPerRequest: null,
        });
      },
      provide: AUTOMATION_REDIS_CLIENT,
    },
    ActionQueue,
    FlowQueue,
  ],
  exports: [
    ActionQueue,
    FlowQueue,
    AUTOMATION_REDIS_CLIENT,
  ],
})
export class QueueModule {

}