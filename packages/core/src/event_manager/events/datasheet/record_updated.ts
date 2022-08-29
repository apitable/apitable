import { EventAtomTypeEnums, EventRealTypeEnums, testPath, transformOpFields } from 'event_manager';
import { groupBy } from 'lodash';
import { IReduxState, Selectors } from 'store';
import { ResourceType } from 'types';
import { IAtomEventType, ICombEventType } from '../interface';
import { EventSourceTypeEnums, OPEventNameEnums } from './../../const';
import {
  IAtomEvent, IEventInstance, IEventTestResult, IOPBaseContext, IOPEvent
} from './../../interface/event.interface';

interface IRecordMetaUpdated {
  datasheetId: string;
  recordId: string;
  action: any;
}
export class OPEventRecordMetaUpdated extends IAtomEventType<IRecordMetaUpdated> {
  eventName = OPEventNameEnums.RecordMetaUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  test({ action, resourceId }: IOPBaseContext) {
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId', 'recordMeta']);
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
        action,
      }
    };
  }
}
export class OPEventRecordCommentUpdated implements IAtomEventType<any> {
  eventName = OPEventNameEnums.RecordCommentUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  atomType = EventAtomTypeEnums.ATOM;
  test(opContext: IOPBaseContext, sourceType?: EventSourceTypeEnums.ALL): IEventTestResult<any> {
    const { action, resourceId } = opContext;
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId', 'comments', ':commentIndex']);
    return {
      pass: pass,
      context: {
        datasheetId: resourceId,
        recordId: recordId,
        action,
      }
    };
  }
}

export class OPEventRecordUpdated extends ICombEventType {
  eventName = OPEventNameEnums.RecordUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  acceptEventNames = [OPEventNameEnums.CellUpdated];
  comb(events: IEventInstance<IAtomEvent>[]): IEventInstance<IOPEvent>[] {
    const res: IEventInstance<IOPEvent>[] = [];
    const eventBuffer = events.filter(event => this.acceptEventNames.includes(event.eventName));
    const groupEvents = groupBy(eventBuffer, ({ context }) => {
      const { datasheetId, recordId } = context;
      return `${datasheetId}-${recordId}`;
    });
    Object.keys(groupEvents).forEach(dstRecordId => {
      const [datasheetId, recordId] = dstRecordId.split('-');
      // 记录的所有单元格更新事件
      const events = groupEvents[dstRecordId];
      const recordChange = {};
      const diffFields: string[] = [];
      // console.log('comb events', events);
      events.forEach(event => {
        if (event.context.change) {
          recordChange[event.context.fieldId] = event.context.change.to;
        }
        diffFields.push(event.context.fieldId);
      });
      res.push({
        eventName: OPEventNameEnums.RecordUpdated,
        context: {
          datasheetId,
          recordId,
          fields: recordChange,
          diffFields
        },
        scope: this.scope,
        realType: this.realType as any, // FIXME: 类型
        atomType: this.atomType,
        sourceType: EventSourceTypeEnums.ALL,
      });
    });
    return res;
  }
  /**
   * 通过 op 生成 event 时，部分字段需要借助 state 上下文才能补全。在这里补全事件上下文
   */
  fill(events: IEventInstance<IOPEvent>[], state: IReduxState) {
    return events.map(event => {
      if (event.eventName === OPEventNameEnums.RecordUpdated) {
        const { datasheetId, recordId } = event.context;
        event.context.datasheetName = Selectors.getDatasheet(state, datasheetId)?.name;
        event.context.state = state;
        const { fields, eventFields } = transformOpFields({
          recordData: event.context.fields,
          state: state,
          datasheetId,
          recordId
        });
        // 这个 fields 给 trigger filter 校验用的，这里 fieldValue 是 op 过来的 cellValue
        event.context.fields = fields;
        // 这个 eventFields 给 trigger output 用的，这里 fieldValue 是经过 cv 转化的 eventCV
        event.context.eventFields = eventFields;
      }
      return event;
    });
  }
}

