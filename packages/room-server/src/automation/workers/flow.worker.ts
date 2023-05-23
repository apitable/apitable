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
import { defaultEventListenerOptions, IEventInstance, IEventListenerOptions, IOPEvent, OPEventNameEnums } from '@apitable/core';
import { EventTypeEnums, isHandleEvent } from './worker.helper';
import { ResourceRobotTriggerDto } from '../dtos/trigger.dto';
import {
  FormSubmittedTriggerFactory,
  ITrigger,
  ITriggerFactory,
  RecordCreatedTriggerFactory,
  RecordMatchesConditionsTriggerFactory,
} from '../triggers';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { RobotTriggerService } from '../services/robot.trigger.service';
import { AutomationService } from '../services/automation.service';

@Injectable()
export class FlowWorker {
  private flowWorker: Worker | undefined;
  private readonly options: IEventListenerOptions = defaultEventListenerOptions;
  private eventNameToTriggerFactoryMap = new Map<string, ITriggerFactory<any>>();

  constructor(
    @InjectLogger() private readonly logger: Logger,
    @Inject(AUTOMATION_REDIS_CLIENT) private readonly redisClient: IORedis,
    private readonly triggerService: RobotTriggerService,
    private readonly automationService: AutomationService,
  ) {
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.RecordMatchesConditions, new RecordMatchesConditionsTriggerFactory());
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.FormSubmitted, new FormSubmittedTriggerFactory());
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.RecordCreated, new RecordCreatedTriggerFactory());
  }

  public start(): void {
    this.flowWorker = new Worker(FLOW_QUEUE, async job => await this.onProcess(job), {
      connection: this.redisClient as ConnectionOptions,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    });
    this.flowWorker.on(ON_ACTIVE, (job, prev) => this.onActive(job, prev));
    this.flowWorker.on(ON_COMPLETED, (job, result, prev) => this.onCompleted(job, result, prev));
    this.flowWorker.on(ON_FAILED, (job, error, prev) => this.onFailed(job, error, prev));
    this.flowWorker.on(ON_ERROR, error => this.onError(error));
  }

  public async onActive(_job: Job, _pre: string): Promise<void> {}

  public async onProcess(job: Job<IEventInstance<IOPEvent> & { beforeApply: boolean }>): Promise<string | null> {
    const data = job.data;

    if (!isHandleEvent(data, data.beforeApply, this.options)) {
      return null;
    }
    const { datasheetId } = data.context;
    if (!datasheetId) return null;
    try {
      if (job.name === OPEventNameEnums.FormSubmitted) {
        const datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.FormSubmitted);
        const triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.FormSubmitted);
        const { datasheetName, recordId, eventFields, formId } = data.context;
        await this.triggerFlows(datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          formId,
        });
      } else if (job.name === OPEventNameEnums.RecordCreated) {
        let datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordUpdated);
        const { datasheetName, recordId, eventFields, fields, diffFields, fieldMap } = data.context;
        let triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordMatchesConditions);
        await this.triggerFlows(datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          fields,
          diffFields,
          fieldMap,
        });
        datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordCreated);
        triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordCreated);
        await this.triggerFlows(datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
        });
      } else if (job.name === OPEventNameEnums.RecordUpdated) {
        const datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordUpdated);
        const { datasheetName, recordId, eventFields, fields, diffFields, fieldMap } = data.context;
        const triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordMatchesConditions);
        await this.triggerFlows(datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          fields,
          diffFields,
          fieldMap,
        });
      }
      return datasheetId;
    } catch (error) {
      this.logger.error(`the [${datasheetId}] datasheet's robot execute failure.`, (error as Error).message);
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

  private async getDatasheetTriggers(datasheetId: string, triggerType: string): Promise<ResourceRobotTriggerDto[]> {
    switch (triggerType) {
      case OPEventNameEnums.FormSubmitted:
        return await this.triggerService.getTriggersByResourceAndEventType(datasheetId, EventTypeEnums.FormSubmitted);
      case OPEventNameEnums.RecordUpdated:
        return await this.triggerService.getTriggersByResourceAndEventType(datasheetId, EventTypeEnums.RecordMatchesConditions);
      case OPEventNameEnums.RecordCreated:
        return await this.triggerService.getTriggersByResourceAndEventType(datasheetId, EventTypeEnums.RecordCreated);
      default:
        return [];
    }
  }

  private async triggerFlows(
    datasheetTriggers: ResourceRobotTriggerDto[],
    triggerFactory: ITriggerFactory<any> | undefined,
    extra: any,
  ): Promise<void> {
    if (!triggerFactory) {
      throw new Error('unknown trigger');
    }
    const flows = datasheetTriggers
      .filter(item => Boolean(item.input))
      .reduce((prev, item) => {
        const trigger = triggerFactory.createTrigger({ input: item.input!, extra });
        if (trigger !== null) {
          prev.push({
            robotId: item.robotId,
            trigger,
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);
    for (const flow of flows) {
      await this.automationService.handleTask(flow.robotId, flow.trigger);
    }
  }
}

type IShouldFireRobot = {
  robotId: string;
  trigger: ITrigger;
};
