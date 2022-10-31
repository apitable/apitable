import { IReduxState } from 'store';
import { ResourceType } from 'types';
import { IChangeset, IOperation } from '../engine/ot/interface';
import {
  EventAtomTypeEnums,
  EventNameClsMap, EventRealTypeEnums, EventSourceTypeEnums,
  OPEventNameEnums, REMOTE_NEW_CHANGES
} from './const';
import { OPEventCellUpdated } from './events/datasheet/cell_updated';
import { IAtomEventType } from './events/interface';
import {
  IAtomEvent,
  ICombEvent,
  IEventInstance, IOPBaseContext, IOPEvent,
  IRealAtomEvent, IVirtualAtomEvent
} from './interface/event.interface';
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
    events.forEach(event => {
      // datasheet resources
      if (event.scope === ResourceType.Datasheet) {
        const { datasheetId, recordId } = event.context;
        if (res.has(datasheetId)) {
          recordId && res.get(datasheetId)!.push(recordId);
        } else {
          recordId && res.set(datasheetId, [recordId]);
        }
      }
    });
    return res;
  }

  parseOps2Events(changesets: Omit<IChangeset, 'messageId'>[]): IEventInstance<IRealAtomEvent>[] {
    const events: IEventInstance<IRealAtomEvent>[] = [];
    changesets.forEach(({ operations, resourceId, resourceType }) => {
      operations.forEach(op => {
        events.push(...this.parseOp2Event(op, resourceId, resourceType));
      });
    });
    return events;
  }

  makeVirtualEvents(events: IEventInstance<IRealAtomEvent>[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[] {
    // For example: an update of field A causes an update of field B
    const virtualEvents: IEventInstance<IVirtualAtomEvent>[] = [];
    Object.keys(this.eventNameClsInstanceMap).forEach((eventName: OPEventNameEnums) => {
      const eventClsInstance = this.eventNameClsInstanceMap[eventName];
      const _events = events.filter(event => event.eventName === eventName);
      // The field update event only has the processing logic of the calculation event
      if (eventName === OPEventNameEnums.CellUpdated) {
        virtualEvents.push(...(eventClsInstance as OPEventCellUpdated).computeEvent(_events, state));
      }
    });
    return virtualEvents;
  }

  makeCombEvents(events: IEventInstance<IAtomEvent>[]): IEventInstance<ICombEvent>[] {
    const res: IEventInstance<ICombEvent>[] = [];
    Object.entries(this.eventNameClsInstanceMap).forEach(eventCls => {
      const [, eventClsInstance] = eventCls;
      if (eventClsInstance.atomType === EventAtomTypeEnums.COMB) {
        res.push(...eventClsInstance.comb(events));
      }
    });
    return res;
  }

  fillEvents(events: IEventInstance<IOPEvent>[], state: IReduxState): IEventInstance<IOPEvent>[] {
    return Object.entries(this.eventNameClsInstanceMap).reduce(
      (res, [, eventClsInstance]) => {
        if (eventClsInstance.fill) {
          res = eventClsInstance.fill(res, state);
        }
        return res;
      }
      , events);
  }

  /**
   * op to real atomic event
   */
  parseOp2Event(op: IOperation, resourceId: string, resourceType: ResourceType): IEventInstance<IRealAtomEvent>[] {
    const events: IEventInstance<IRealAtomEvent>[] = [];
    op.actions.forEach(action => {
      const opContext: IOPBaseContext = { op, action, resourceId, resourceType };
      Object.keys(this.eventNameClsInstanceMap).forEach((eventName: OPEventNameEnums) => {
        const eventClsInstance = this.eventNameClsInstanceMap[eventName];
        if (eventClsInstance.scope !== resourceType || eventClsInstance.atomType !== EventAtomTypeEnums.ATOM) {
          return;
        }
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
