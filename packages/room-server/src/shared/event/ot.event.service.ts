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

import { OPEventManager, OPEventNameEnums, IReduxState, OP2Event, IRemoteChangeset } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { IOtEventContext } from 'database/ot/interfaces/ot.interface';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { OTEventManager } from './ot.event.manager';

/**
 * Event listener service, convert op to domains, and handle related domains listening.
 */
@Injectable()
export class OTEventService {
  opEventManager: OPEventManager;

  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
  ) {
    const watchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCreated,
      OPEventNameEnums.RecordDeleted,
      OPEventNameEnums.RecordUpdated,
      OPEventNameEnums.RecordCommentUpdated,
      OPEventNameEnums.RecordArchived,
      OPEventNameEnums.RecordUnarchived,
    ];
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: false,
        enableCombEvent: false,
        enableEventComplete: false,
      },
      getState: () => {
        return {} as IReduxState;
      },
      op2Event: new OP2Event(watchedEvents),
    });
  }

  async handleChangesets(changesets: IRemoteChangeset[], context: IOtEventContext) {
    if (OTEventManager.isEmpty()) {
      this.logger.debug('OT event executor is empty');
      return;
    }
    this.logger.debug('Begin parse ot events');
    const events = await this.opEventManager.asyncHandleChangesets(changesets);
    if (events.length === 0) {
      return;
    }
    // Execute all
    await OTEventManager.execute(events, context);
  }
}
