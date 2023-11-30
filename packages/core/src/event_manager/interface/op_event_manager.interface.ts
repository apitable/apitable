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

import { IChangeset } from 'engine/ot/interface';
import { OP2Event } from 'event_manager/op2event';
import { IReduxState } from '../../exports/store/interfaces';
import { IEventInstance, IOPEvent } from './event.interface';
import { IEventManager } from './event_manager.interface';

export interface IOPEventManagerOptions {
  op2Event: OP2Event;
  /**
   * How to get state
   */
  getState: (resourceMap?: any) => IReduxState | Promise<IReduxState>;
  options: {
    // Whether to enable virtual events
    enableVirtualEvent?: boolean;
    // Whether to enable combined events
    enableCombEvent?: boolean;
    // Whether to enable event completion
    enableEventComplete?: boolean;
  }
}
type IEvents = IEventInstance<IOPEvent>[];
export interface IOPEventManager extends IEventManager {
  // The following two methods have the same processing logic, the difference is when getState
  // The room layer needs to check the database asynchronously;
  // the front end is a direct synchronous operation, otherwise the state will be inconsistent.
  asyncHandleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): Promise<IEvents>
  handleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): IEvents
}