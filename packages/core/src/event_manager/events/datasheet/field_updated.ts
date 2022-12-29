import { testPath } from 'event_manager';
import { ResourceType } from 'types';
import { IAtomEventType } from '../interface';
import { EventRealTypeEnums, OPEventNameEnums } from './../../const';
import { IOPBaseContext } from './../../interface/event.interface';

interface IFieldUpdated {
  fieldId: string;
  datasheetId: string;
}

export class OPEventFieldUpdated extends IAtomEventType<IFieldUpdated> {
  eventName = OPEventNameEnums.FieldUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;

  test({ action, resourceId }: IOPBaseContext) {
    const { pass, fieldId } = testPath(action.p, ['meta', 'fieldMap', ':fieldId']);
    return {
      pass,
      context: {
        fieldId,
        datasheetId: resourceId,
      }
    };
  }
}