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

import { EventRealTypeEnums, EventSourceTypeEnums } from 'event_manager/enum';
import { AnyObject, IEventInstance, IOPEvent } from './event.interface';

export interface IEventListenerMap {
  [event: string]: {
    actionFunc(context: AnyObject, metaContext: AnyObject): void;
    options?: IEventListenerOptions;
  }[];
}

export interface IEventListenerOptions {
  // event source
  sourceType?: EventSourceTypeEnums,
  // the authenticity of the event
  realType?: EventRealTypeEnums;
  // The change of each event will be applied to the corresponding state tree,
  // whether the event callback is triggered before the application or after the application.
  beforeApply?: boolean;
}

export interface IEventManager {
  // maintenance of listening events
  eventListenerMap: IEventListenerMap;
  // register event listener
  addEventListener(eventName: string, actionFunc: Function, options?: IEventListenerOptions): void;
  // remove event listener
  removeEventListener(eventName: string, actionFunc: Function): void;
  // dispatch event
  dispatchEvent(event: IEventInstance<IOPEvent>, beforeApply: boolean, context?: any): void;
  // receive event stream
  handleEvents(events: IEventInstance<IOPEvent>[], beforeApply: boolean, context?: any): void;
}