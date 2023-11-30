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

import { IChangeset } from 'engine';
import { IReduxState } from '../exports/store/interfaces';
import { EventManager } from './event_manager';
import { IOPEventManager, IOPEventManagerOptions } from './interface';
import { ICombEvent, IEventInstance, IRealAtomEvent, IVirtualAtomEvent } from './interface/event.interface';

export class OPEventManager extends EventManager implements IOPEventManager {
  options: IOPEventManagerOptions;
  constructor(options: IOPEventManagerOptions) {
    super();
    this.options = options;
  }

  private getAllEvents(realAtomEvents: IEventInstance<IRealAtomEvent>[], virtualAtomEvents: IEventInstance<IVirtualAtomEvent>[]) {
    const { op2Event, options: { enableCombEvent } } = this.options;
    let combEvents: IEventInstance<ICombEvent>[] = [];
    const atomEvents = [...realAtomEvents, ...virtualAtomEvents];
    if (enableCombEvent) {
      combEvents = op2Event.makeCombEvents(atomEvents);
    }
    const events = [...atomEvents, ...combEvents];
    // console.log('events', events);
    return events;
  }

  public async asyncHandleChangesets(changesets: Omit<IChangeset, 'messageId'>[]) {
    const { op2Event, options: { enableVirtualEvent, enableEventComplete, enableCombEvent }, getState } = this.options;
    const realAtomEvents = op2Event.parseOps2Events(changesets);
    let virtualAtomEvents: IEventInstance<IVirtualAtomEvent>[] = [];
    let state;
    if (enableVirtualEvent) {
      const resourceMap = op2Event.getOpsResources(realAtomEvents);
      state = await getState(resourceMap);
      virtualAtomEvents = op2Event.makeVirtualEvents(realAtomEvents, state);
    }
    if (enableEventComplete) {
      if (!state) {
        const resourceMap = op2Event.getOpsResources(realAtomEvents);
        state = await getState(resourceMap);
      }
      let combEvents: IEventInstance<ICombEvent>[] = [];
      const atomEvents = [...realAtomEvents, ...virtualAtomEvents];
      if (enableCombEvent) {
        combEvents = op2Event.makeCombEvents(atomEvents);
      }
      const events = [...atomEvents, ...combEvents];
      return op2Event.fillEvents(events, state);
    }
    return this.getAllEvents(realAtomEvents, virtualAtomEvents);
  }

  public handleChangesets(changesets: Omit<IChangeset, 'messageId'>[]) {
    const { op2Event, options: { enableVirtualEvent }, getState } = this.options;
    const realAtomEvents = op2Event.parseOps2Events(changesets);
    let virtualAtomEvents: IEventInstance<IVirtualAtomEvent>[] = [];
    if (enableVirtualEvent) {
      const resourceMap = op2Event.getOpsResources(realAtomEvents);
      const state = getState(resourceMap) as IReduxState;
      virtualAtomEvents = op2Event.makeVirtualEvents(realAtomEvents, state);
    }
    return this.getAllEvents(realAtomEvents, virtualAtomEvents);
  }
}