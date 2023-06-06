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
import { ConnectionOptions, Job, Worker } from 'bullmq';
import { ACTION_QUEUE, AUTOMATION_REDIS_CLIENT, ON_ACTIVE, ON_COMPLETED } from '../constants';
import IORedis from 'ioredis';

@Injectable()
export class ActionWorker {
  private actionWorker: Worker | undefined;

  constructor(@Inject(AUTOMATION_REDIS_CLIENT) private readonly redisClient: IORedis) {}

  public start(): void {
    this.actionWorker = new Worker(ACTION_QUEUE, async() => {}, { connection: this.redisClient as ConnectionOptions });
    this.actionWorker.on(ON_ACTIVE, (job, prev) => this.onActive(job, prev));
    this.actionWorker.on(ON_COMPLETED, (job, result, prev) => this.onCompleted(job, result, prev));
  }

  public onActive(_job: Job, _prev: string): void {}

  public onCompleted(_job: Job, _result: any, _prev: string): void {}
}
