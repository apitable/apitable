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

import { OPEventNameEnums, EventRealTypeEnums, EventAtomTypeEnums,EventSourceTypeEnums } from 'event_manager/enum';
import { IOPBaseContext, IEventTestResult, IEventInstance, IAtomEvent, IOPEvent } from 'event_manager/interface/event.interface';
import { ResourceType } from 'types';

export abstract class IAtomEventType<T> {
  abstract eventName: OPEventNameEnums;
  abstract realType: EventRealTypeEnums;
  abstract scope: ResourceType;
  atomType = EventAtomTypeEnums.ATOM;
  // Test if op matches the event characteristics
  abstract test(opContext: IOPBaseContext, sourceType?: EventSourceTypeEnums.ALL): IEventTestResult<T>;
}

export abstract class ICombEventType {
  abstract eventName: OPEventNameEnums;
  abstract realType: EventRealTypeEnums;
  abstract scope: ResourceType;
  // This composite event accepts the following atomic events for aggregation.
  abstract acceptEventNames: OPEventNameEnums[];
  atomType = EventAtomTypeEnums.COMB;
  abstract comb(events: IEventInstance<IAtomEvent>[]): IEventInstance<IOPEvent>[];
}

export type IEventType = IAtomEventType<any> | ICombEventType;

export interface ICellUpdatedContext {
  recordId: string;
  fieldId: string;
  datasheetId: string;
  action: any;
  change: {
    from: any;
    to: any;
  }
  linkDatasheetId?: string;
}