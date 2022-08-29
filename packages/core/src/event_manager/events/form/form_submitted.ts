import { EventRealTypeEnums } from 'event_manager';
import { ResourceType } from '../../../types/resource_types';
import { IAtomEventType } from '../interface';
import { OPEventNameEnums } from './../../const';
import { AnyObject, IOPBaseContext } from './../../interface/event.interface';

interface IFormSubmitted {
  formId: string;
  datasheet: {
    id: string;
    name: string;
  };
  record: {
    id: string;
    url: string;
    fields: AnyObject;
  }
}

export class OPEventFormSubmitted extends IAtomEventType<IFormSubmitted> {
  eventName = OPEventNameEnums.FormSubmitted;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Form;

  // form 表单的事件不是通过 test op 生成的，而是直接在唯一的入口函数中 dispatch 事件。
  test(opContext: IOPBaseContext) {
    return {
      pass: false,
      context: null
    };
  }
}