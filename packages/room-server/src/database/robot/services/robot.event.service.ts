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
  clearComputeCache, IEventInstance, IEventResourceMap,
  IOPEvent, IReduxState, IRemoteChangeset, IServerDatasheetPack,
  OP2Event, OPEventManager, OPEventNameEnums, ResourceType,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { FlowQueue } from 'automation/queues';

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
    private readonly flowQueue: FlowQueue,
  ) {
    // Server side only listens to record content CRUD domains.
    const clientWatchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCreated,
      OPEventNameEnums.RecordDeleted,
      OPEventNameEnums.RecordUpdated
    ];
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: true,
        enableCombEvent: true,
        enableEventComplete: true
      },
      getState: (resourceMap) => this.makeState(resourceMap),
      op2Event: new OP2Event(clientWatchedEvents)
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
    const msgIds = changesets.map(cs => cs.messageId);
    const events = await this.opEventManager.asyncHandleChangesets(changesets);
    if (events.length === 0) {
      return;
    }
    const resourceIds = this.getResourceIdsByEvents(events);
    if (resourceIds.length === 0) {
      return;
    }
    // Clear cache after domains computation, make sure compute field cache is cleared
    resourceIds.forEach(resourceId => {
      clearComputeCache(resourceId);
    });
    for (const event of events) {
      try {
        if (event.eventName === OPEventNameEnums.RecordCreated  || event.eventName === OPEventNameEnums.RecordUpdated) {
          await this.flowQueue.add(event.eventName, {
            realType: event.realType,
            atomType: event.atomType,
            scope: event.scope,
            sourceType: event.sourceType,
            context: {
              datasheetName: event.context.datasheetName,
              datasheetId: event.context.datasheetId,
              recordId: event.context.recordId,
              fields: event.context.fields,
              diffFields: event.context.diffFields,
              eventFields: event.context.eventFields,
              state: event.context.state,
            },
            beforeApply: false,
          });
        }
      } catch (e: any) {
       this.logger.error(`messageIds[${ msgIds }]: add job error`, e);
      }
    }
  }
}