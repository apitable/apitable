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

import { IReduxState } from '../exports/store/interfaces';
import { ResourceType } from 'types';
import { IChangeset, IOperation } from '../engine/ot/interface';
import { EventNameClsMap, REMOTE_NEW_CHANGES } from './const';
import { EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from './enum';
import { OPEventCellUpdated } from './events/datasheet/cell_updated';
import { IAtomEventType } from './events/interface';
import { IAtomEvent, ICombEvent, IEventInstance, IOPBaseContext, IOPEvent, IRealAtomEvent, IVirtualAtomEvent } from './interface/event.interface';
import { IEventResourceMap, IOP2Event } from './interface/op2event.interface';

export class OP2Event implements IOP2Event {
  eventNameClsInstanceMap: {
    [name in OPEventNameEnums]: any;
  };
  constructor(watchedEvents: OPEventNameEnums[]) {
    this.eventNameClsInstanceMap = watchedEvents.reduce((res, event) => {
      res[event] = new EventNameClsMap[event]();
      return res;
    }, {} as any);
  }
  getOpsResources(events: IEventInstance<IOPEvent>[]): IEventResourceMap {
    const res: IEventResourceMap = new Map();
    events.forEach((event) => {
      // datasheet resources
      if (event.scope === ResourceType.Datasheet) {
        const { datasheetId, recordId, linkDatasheetId, change } = event.context;
        if (res.has(datasheetId)) {
          recordId && res.get(datasheetId)!.push(recordId);
        } else {
          recordId && res.set(datasheetId, [recordId]);
        }
        if (linkDatasheetId && linkDatasheetId != datasheetId && change?.to) {
          if (res.has(linkDatasheetId)) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            res.get(linkDatasheetId)!.push(...change?.to);
          } else {
            // eslint-disable-next-line no-unsafe-optional-chaining
            res.set(linkDatasheetId, [...change?.to]);
          }
        }
      }
    });
    return res;
  }

  parseOps2Events(changesets: Omit<IChangeset, 'messageId'>[]): IEventInstance<IRealAtomEvent>[] {
    const events: IEventInstance<IRealAtomEvent>[] = [];
    changesets.forEach(({ operations, resourceId, resourceType }) => {
      operations.forEach((op) => {
        events.push(...this.parseOp2Event(op, resourceId, resourceType));
      });
    });
    return events;
  }

  makeVirtualEvents(events: IEventInstance<IRealAtomEvent>[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[] {
    // For example: an update of field A causes an update of field B
    const virtualEvents: IEventInstance<IVirtualAtomEvent>[] = [];
    (Object.keys(this.eventNameClsInstanceMap) as OPEventNameEnums[]).forEach((eventName: OPEventNameEnums) => {
      const eventClsInstance = this.eventNameClsInstanceMap[eventName];
      const _events = events.filter((event) => event.eventName === eventName);
      // The field update event only has the processing logic of the calculation event
      if (eventName === OPEventNameEnums.CellUpdated) {
        virtualEvents.push(...(eventClsInstance as OPEventCellUpdated).computeEvent(_events, state));
      }
    });
    return virtualEvents;
  }

  makeCombEvents(events: IEventInstance<IAtomEvent>[]): IEventInstance<ICombEvent>[] {
    const res: IEventInstance<ICombEvent>[] = [];
    Object.entries(this.eventNameClsInstanceMap).forEach((eventCls) => {
      const [, eventClsInstance] = eventCls;
      if (eventClsInstance.atomType === EventAtomTypeEnums.COMB) {
        res.push(...eventClsInstance.comb(events));
      }
    });
    return res;
  }

  fillEvents(events: IEventInstance<IOPEvent>[], state: IReduxState): IEventInstance<IOPEvent>[] {
    return Object.entries(this.eventNameClsInstanceMap).reduce((res, [, eventClsInstance]) => {
      if (eventClsInstance.fill) {
        res = eventClsInstance.fill(res, state);
      }
      return res;
    }, events);
  }

  /**
   * op to real atomic event
   */
  parseOp2Event(op: IOperation, resourceId: string, resourceType: ResourceType): IEventInstance<IRealAtomEvent>[] {
    const events: IEventInstance<IRealAtomEvent>[] = [];
    op.actions.forEach((action) => {
      const opContext: IOPBaseContext = { op, action, resourceId, resourceType };
      (Object.keys(this.eventNameClsInstanceMap) as OPEventNameEnums[]).forEach((eventName: OPEventNameEnums) => {
        const eventClsInstance = this.eventNameClsInstanceMap[eventName];
        if (eventClsInstance.scope !== resourceType || eventClsInstance.atomType !== EventAtomTypeEnums.ATOM) {
          return;
        }
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { pass, context } = (eventClsInstance as IAtomEventType<any>)?.test(opContext);
        if (pass) {
          events.push({
            eventName,
            realType: EventRealTypeEnums.REAL,
            atomType: EventAtomTypeEnums.ATOM,
            scope: resourceType,
            context,
            sourceType: op.cmd === REMOTE_NEW_CHANGES ? EventSourceTypeEnums.REMOTE : EventSourceTypeEnums.LOCAL,
          });
        }
      });
    });
    return events;
  }
}
