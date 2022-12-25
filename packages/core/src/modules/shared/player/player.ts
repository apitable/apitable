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

/*
 * 
 * Player user system, including novice guide, event system binding, red dot, notification and other managers closely related to user experience
 * Provide an initialization function, which can execute the initialization (init) function during restart, 
 * and read and explain the player configuration table
 *
 * @Author: Kelly Peilin Chan (kelly@apitable.com)
 * @Date: 2020-03-10 14:16:06
 * @Last Modified by: Kelly Peilin Chan (kelly@apitable.com)
 * @Last Modified time: 2020-03-21 17:58:29
 */
import {
  AppHook, TriggerCommand, FilterCommand,
  // ITrigger,
} from 'apphook';

// The apphook engine is declared here and becomes a global singleton
const apphook = new AppHook();

export interface IEvent {
  module: string;
  name: string;
}

/**
 * When configuring, module and name are configured separately, which is convenient for product planning to identify events and better readability
 * When the system is actually used, splicing module and name: modulexxx_namexxx
 *
 * @param {IEvent} event
 * @returns
 */
export function _getEventName(event: IEvent) {
  return event?.module + '_' + event?.name;
}

/**
 * Bind events.
 * Why use bindTrigger here instead of addTrigger?
 * addTrigger can be added, that is, it can bind a lot of actions, which is suitable for the unrestrained development of third-party plug-ins;
 * In our own program code, we do not respect the use of add, so our own code is difficult to maintain, so we put it in the event_bindings.ts file.
 *
 * @export
 * @param {IEvent} event
 * @param {TriggerCommand} command
 * @param {number} [priority=0]
 * @returns
 */
export function bindTrigger(event: IEvent, command: TriggerCommand, priority = 0, force = false) {
  const eventStr = _getEventName(event);

  if (!force && apphook.hasAnyTriggers(eventStr)) {
    console.error(`Event ${eventStr} has triggers, cannot bind anymore`);
    return undefined;
  }

  return apphook.addTrigger(_getEventName(event), command, [], undefined, priority);
}

/**
 * execute event
 *
 * @export
 * @param {IEvent} event
 * @param {*} [eventState]
 */
export function doTrigger(event: IEvent, eventState?: any) {
  const eventStr = _getEventName(event);

  // console.debug('[DO_EVENT] ' + eventStr + ' ' + eventState);
  apphook.doTriggers(eventStr, eventState);
}

/**
 * Apply filters
 *
 * @export
 * @param {IEvent} event
 * @param {*} defaultValue
 * @param {*} [eventState]
 * @returns
 */
export function applyFilters(event: IEvent, defaultValue: any, eventState?: any) {
  const eventStr = _getEventName(event);
  return apphook.applyFilters(eventStr, defaultValue, eventState);
}

export function bindFilter(
  event: IEvent, command: FilterCommand, commandArg: any,
  priority = 0, force = false,
) {
  const eventStr = _getEventName(event);
  if (!force && apphook.hasAnyFilters(eventStr)) {
    console.error(`Event ${eventStr} has triggers, cannot bind anymore`);
    return;
  }
  apphook.addFilter(eventStr, command, commandArg, undefined, priority);
}

/**
 * Direct access to apphook event manager
 *
 * @export
 * @returns
 */
export function getAppHook() {
  return apphook;
}
