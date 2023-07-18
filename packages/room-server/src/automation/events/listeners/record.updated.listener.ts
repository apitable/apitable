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

import { defaultEventListenerOptions, IEventListenerOptions, OPEventNameEnums } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RecordUpdatedEvent } from '../domains/record.updated.event';
import { isHandleEvent } from '../helpers/listener.helper';
import { TriggerEventHelper } from '../helpers/trigger.event.helper';

@Injectable()
export class RecordUpdatedListener {
  private readonly options: IEventListenerOptions;

  constructor(private readonly triggerEventHelper: TriggerEventHelper) {
    this.options = defaultEventListenerOptions;
  }

  @OnEvent(OPEventNameEnums.RecordUpdated)
  public async handleRecordUpdatedEvent(event: RecordUpdatedEvent) {
    if (!isHandleEvent(event, event.beforeApply, this.options)) {
      return;
    }

    await this.triggerEventHelper.recordMatchConditionsTriggerHandler(event.context, event.metaContext);
  }
}
