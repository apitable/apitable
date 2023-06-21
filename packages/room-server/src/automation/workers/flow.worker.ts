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
import { ConnectionOptions, Job, UnrecoverableError, Worker } from 'bullmq';
import { AUTOMATION_REDIS_CLIENT, FLOW_QUEUE, ON_ACTIVE, ON_COMPLETED, ON_ERROR, ON_FAILED } from '../constants';
import IORedis from 'ioredis';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { AutomationService } from '../services/automation.service';

@Injectable()
export class FlowWorker {
  private flowWorker: Worker | undefined;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    @Inject(AUTOMATION_REDIS_CLIENT) private readonly redisClient: IORedis,
    private readonly automationService: AutomationService,
  ) { }

  public start(): void {
    this.flowWorker = new Worker(FLOW_QUEUE, async job => await this.onProcess(job), {
      connection: this.redisClient as ConnectionOptions,
      removeOnComplete: { count: 0 },
      removeOnFail: { count: 10 },
    });
    this.flowWorker.on(ON_ACTIVE, (job, prev) => { void this.onActive(job, prev); });
    this.flowWorker.on(ON_COMPLETED, (job, result, prev) => this.onCompleted(job, result, prev));
    this.flowWorker.on(ON_FAILED, (job, error, prev) => this.onFailed(job, error, prev));
    this.flowWorker.on(ON_ERROR, error => this.onError(error));
  }

  public async onActive(_job: Job, _pre: string): Promise<void> {}

  public async onProcess(job: Job<any>){
    const flows = job.data;
    try {
      for (const flow of flows) {
        await this.automationService.handleTask(flow.robotId, flow.trigger);
      }
    } catch (error) {
      this.logger.error('the datasheet\'s robot execute failure.', (error as Error).message);
      throw new UnrecoverableError();
    }
  }

  public onCompleted(job: Job, result: any, _prev: string): void {
    this.logger.info(`job [${job.id}]: the [${result}] datasheet's robot execute successfully.`);
  }

  public onError(failedReason: Error): void {
    this.logger.error(`work error: [${failedReason.message}]`);
  }

  public onFailed(job: Job | undefined, error: Error, _prev: string): void {
    this.logger.error(`error [${error.name}: ${error.message}], detail [${error.stack}]. job [${job}]: `);
  }

}