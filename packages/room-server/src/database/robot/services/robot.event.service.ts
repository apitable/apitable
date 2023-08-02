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

import {
  clearComputeCache,
  IEventInstance,
  IEventResourceMap,
  IOPEvent,
  IReduxState,
  IRemoteChangeset,
  IServerDatasheetPack,
  OP2Event,
  OPEventManager,
  OPEventNameEnums,
  ResourceType,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypeEnums } from 'automation/events/domains/event.type.enums';
import { OFFICIAL_SERVICE_SLUG } from 'automation/events/helpers/trigger.event.helper';
import { RobotTriggerService } from 'automation/services/robot.trigger.service';
import { RobotTriggerTypeService } from 'automation/services/robot.trigger.type.service';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';

/**
 * Event listener service, convert op to domains, and handle related domains listening.
 */
@Injectable()
export class RobotEventService {
  opEventManager: OPEventManager;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private datasheetService: DatasheetService,
    private commandService: CommandService,
    private robotTriggerService: RobotTriggerService,
    private robotTriggerTypeService: RobotTriggerTypeService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Server side only listens to record content CRUD domains.
    const clientWatchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCreated,
      OPEventNameEnums.RecordDeleted,
      OPEventNameEnums.RecordUpdated,
    ];
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: true,
        enableCombEvent: true,
        enableEventComplete: true,
      },
      getState: (resourceMap) => this.makeState(resourceMap),
      op2Event: new OP2Event(clientWatchedEvents),
    });
  }

  /**
   * Analyze ops, figure out op resource dependency, query database and construct sparse store.
   */
  private async makeState(resourceMap: IEventResourceMap): Promise<IReduxState> {
    const datasheetPacks: IServerDatasheetPack[] = await this.datasheetService.getTinyBasePacks(resourceMap);
    this.logger.debug('datasheetPacks', datasheetPacks);
    return this.commandService.fillTinyStore(datasheetPacks).getState();
  }

  private getResourceIdsByEvents(events: IEventInstance<IOPEvent>[]) {
    const resourceIds = events.reduce((prev, item) => {
      if (item.scope === ResourceType.Datasheet) {
        prev.add(item.context.datasheetId);
      }
      return prev;
    }, new Set<string>());
    return Array.from(resourceIds);
  }

  async handleChangesets(changesets: IRemoteChangeset[]) {
    const msgIds = changesets.map((cs) => cs.messageId);
    // core event manager
    const events = await this.opEventManager.asyncHandleChangesets(changesets);
    if (events.length === 0) {
      return;
    }
    const resourceIds = this.getResourceIdsByEvents(events);
    if (resourceIds.length === 0) {
      return;
    }
    // Clear cache after domains computation, make sure compute field cache is cleared
    resourceIds.forEach((resourceId) => {
      clearComputeCache(resourceId);
    });
    const dstIdTriggersMap = await this.robotTriggerService.getTriggersGroupByResourceId(resourceIds);
    const triggerSlugTypeIdMap = await this.robotTriggerTypeService.getServiceSlugToTriggerTypeId(
      [EventTypeEnums.RecordMatchesConditions, EventTypeEnums.RecordCreated],
      OFFICIAL_SERVICE_SLUG,
    );
    this.logger.info(`messageIds:automation:[${msgIds}]:`, { slug: OFFICIAL_SERVICE_SLUG, triggerMap: dstIdTriggersMap });
    await Promise.all(
      events.map((event) => {
        return this.eventEmitter.emitAsync(event.eventName, {
          ...event,
          beforeApply: false,
          metaContext: {
            dstIdTriggersMap,
            triggerSlugTypeIdMap,
            msgIds,
          },
        });
      }),
    );
  }
}
