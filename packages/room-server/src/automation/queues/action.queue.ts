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
import { Inject, Injectable } from '@nestjs/common';
import { ConnectionOptions, Job, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { ACTION_QUEUE } from '../constants';

@Injectable()
export class ActionQueue {

  private actionQueue: Queue;

  constructor(
    @Inject('AUTOMATION_REDIS_CLIENT') readonly redisClient: IORedis
  ) {
    this.actionQueue = new Queue(ACTION_QUEUE, { connection: redisClient as ConnectionOptions });
 }
  
  public async add(jobId: string): Promise<Job> {
    return await this.actionQueue.add(jobId, {});
  }
}
