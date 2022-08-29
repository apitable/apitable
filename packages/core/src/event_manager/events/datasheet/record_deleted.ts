import { EventRealTypeEnums, OPEventNameEnums } from 'event_manager/const';
import { testPath } from 'event_manager/helper';
import { ResourceType } from 'types/resource_types';
import { IAtomEventType } from '../interface';
import { IOPBaseContext } from './../../interface/event.interface';

interface IRecordDelete {
  datasheetId: string;
  recordId: string;
}
export class OPEventRecordDeleted extends IAtomEventType<IRecordDelete> {
  eventName = OPEventNameEnums.RecordDeleted;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  test(args: IOPBaseContext) {
    const { action, resourceId } = args;
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId'], action.n === 'OD');
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
      }
    };
  }
}