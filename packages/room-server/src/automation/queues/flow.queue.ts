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
import { ConnectionOptions, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { AUTOMATION_REDIS_CLIENT, FLOW_QUEUE } from '../constants';
import {
  defaultEventListenerOptions,
  IEventListenerOptions,
  OPEventNameEnums
} from '@apitable/core';
import { EventTypeEnums, isHandleEvent } from '../workers/worker.helper';
import { InjectLogger } from '../../shared/common';
import { RobotTriggerService } from '../services/robot.trigger.service';
import { Logger } from 'winston';
import {
  FormSubmittedTriggerFactory, ITrigger, ITriggerFactory,
  RecordCreatedTriggerFactory,
  RecordMatchesConditionsTriggerFactory
} from '../triggers';
import { ResourceRobotTriggerDto } from '../dtos/trigger.dto';

@Injectable()
export class FlowQueue {

  private flowQueue: Queue;
  private readonly options: IEventListenerOptions = defaultEventListenerOptions;
  private eventNameToTriggerFactoryMap = new Map<string, ITriggerFactory<any>>();

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly triggerService: RobotTriggerService,
    @Inject(AUTOMATION_REDIS_CLIENT) readonly redisClient: IORedis
  ) {
    this.flowQueue = new Queue(FLOW_QUEUE, { connection: redisClient as ConnectionOptions });
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.RecordMatchesConditions, new RecordMatchesConditionsTriggerFactory());
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.FormSubmitted, new FormSubmittedTriggerFactory());
    this.eventNameToTriggerFactoryMap.set(EventTypeEnums.RecordCreated, new RecordCreatedTriggerFactory());
  }

  public async add(jobName: string, data: any): Promise<void> {
    if (!isHandleEvent(data, data.beforeApply, this.options)) {
      return;
    }
    const { datasheetId } = data.context;
    if (!datasheetId) return;
    try {
      if (jobName === OPEventNameEnums.FormSubmitted) {
        const datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.FormSubmitted);
        const triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.FormSubmitted);
        const { datasheetName, recordId, eventFields, formId } = data.context;
        await this.triggerFlows(jobName, datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          formId,
        });
      } else if (jobName === OPEventNameEnums.RecordCreated) {
        let datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordUpdated);
        const { datasheetName, recordId, eventFields, fields, diffFields, state } = data.context;
        let triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordMatchesConditions);
        await this.triggerFlows(jobName, datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          fields,
          diffFields,
          state,
        });
        datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordCreated);
        triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordCreated);
        await this.triggerFlows(jobName, datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
        });
      } else if (jobName === OPEventNameEnums.RecordUpdated) {
        const datasheetTriggers = await this.getDatasheetTriggers(datasheetId, OPEventNameEnums.RecordUpdated);
        const { datasheetName, recordId, eventFields, fields, diffFields, state } = data.context;
        const triggerFactory = this.eventNameToTriggerFactoryMap.get(EventTypeEnums.RecordMatchesConditions);
        await this.triggerFlows(jobName, datasheetTriggers, triggerFactory, {
          datasheetId,
          datasheetName,
          recordId,
          eventFields,
          fields,
          diffFields,
          state,
        });
      }
    } catch (error) {
      this.logger.error(`the [${datasheetId}] datasheet's add robot message failure.`, (error as Error).message);
    }
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
    jobName: string,
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
    if (flows && flows.length != 0) {
      await this.flowQueue.add(jobName, flows);
    }
  }
}

type IShouldFireRobot = {
  robotId: string;
  trigger: ITrigger;
};
