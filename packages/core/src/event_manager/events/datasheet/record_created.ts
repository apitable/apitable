import { IOperation } from 'engine/ot/interface';
import { testPath } from 'event_manager';
import { IReduxState, Selectors } from 'store';
import { ResourceType } from 'types';
import { transformOpFields } from '../../helper';
import { IAtomEventType } from '../interface';
import { EventRealTypeEnums, OPEventNameEnums } from './../../const';
import { AnyObject, IEventInstance, IOPBaseContext, IOPEvent } from './../../interface/event.interface';

interface IRecordCreated {
  datasheetId: string;
  recordId: string;
  op: IOperation;
  fields: AnyObject;
  diffFields: string[];
}

export class OPEventRecordCreated extends IAtomEventType<IRecordCreated> {
  eventName = OPEventNameEnums.RecordCreated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;

  test({ action, resourceId, op }: IOPBaseContext) {
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId'], ('oi' in action));
    if (!pass) {
      return {
        pass: false,
        context: null
      };
    }
    // fill 阶段会覆盖 diffFields
    const diffFields = Object.keys(action['oi'].data);
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
        op,
        fields: action['oi'].data,
        diffFields
      }
    };
  }
  /**
   * 补全事件上下文
   */
  fill(events: IEventInstance<IOPEvent>[], state: IReduxState) {
    return events.map(event => {
      if (event.eventName === OPEventNameEnums.RecordCreated) {
        const { datasheetId, recordId } = event.context as IRecordCreated;
        const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
        const fieldKeys = Object.keys(fieldMap);
        event.context.datasheetName = Selectors.getDatasheet(state, datasheetId)?.name;
        event.context.state = state;
        const { fields, eventFields } = transformOpFields({
          recordData: event.context.fields,
          state: state,
          datasheetId,
          recordId,
        });
        event.context.eventFields = eventFields;
        event.context.fields = fields;
        // 新增记录时，从无到有，所有字段都变更了。这个的 diffFields 应该包含全部字段。
        event.context.diffFields = fieldKeys;
      }
      return event;
    });
  }
}