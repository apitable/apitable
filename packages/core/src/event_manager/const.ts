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

import { EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from './enum';
import { datasheetEvent } from './events/datasheet';
import type { IEventListenerOptions } from './interface/event_manager.interface';

/**
 * When listening for events, you can pass in option parameters. 
 * By default, all events are subscribed, and the event is triggered after the event op apply to the store.
 */
export const defaultEventListenerOptions: IEventListenerOptions = {
  realType: EventRealTypeEnums.ALL,
  sourceType: EventSourceTypeEnums.ALL,
  beforeApply: false,
};

export const REMOTE_NEW_CHANGES = 'REMOTE_NEW_CHANGES';
export const EMPTY_ARRAY = [];
export const DEFAULT_EVENT_MANAGER_OPTIONS = {
  enableVirtualEvent: false,
  enableCombEvent: false,
  enableEventComplete: false
};

// Mapping relationship between event name and event definition class
export const EventNameClsMap = {
  // cell
  [OPEventNameEnums.CellUpdated]: datasheetEvent.OPEventCellUpdated,
  // field
  [OPEventNameEnums.FieldUpdated]: datasheetEvent.OPEventFieldUpdated,
  // record
  [OPEventNameEnums.RecordCommentUpdated]: datasheetEvent.OPEventRecordCommentUpdated,
  [OPEventNameEnums.RecordMetaUpdated]: datasheetEvent.OPEventRecordMetaUpdated,
  [OPEventNameEnums.RecordCreated]: datasheetEvent.OPEventRecordCreated,
  [OPEventNameEnums.RecordDeleted]: datasheetEvent.OPEventRecordDeleted,
  [OPEventNameEnums.RecordUpdated]: datasheetEvent.OPEventRecordUpdated,
  [OPEventNameEnums.RecordArchived]: datasheetEvent.OPEventRecordArchived,
  [OPEventNameEnums.RecordUnarchived]: datasheetEvent.OPEventRecordUnarchived,
};

