import {
  OPEventNameEnums, EventRealTypeEnums, EventAtomTypeEnums,
  IOPBaseContext, EventSourceTypeEnums, IEventTestResult, IEventInstance, IAtomEvent, IOPEvent
} from 'index';
import { ResourceType } from 'types';

export abstract class IAtomEventType<T> {
  abstract eventName: OPEventNameEnums;
  abstract realType: EventRealTypeEnums;
  abstract scope: ResourceType;
  atomType = EventAtomTypeEnums.ATOM;
  // 测试 op 是否符合事件特征
  abstract test(opContext: IOPBaseContext, sourceType?: EventSourceTypeEnums.ALL): IEventTestResult<T>;
}

export abstract class ICombEventType {
  abstract eventName: OPEventNameEnums;
  abstract realType: EventRealTypeEnums;
  abstract scope: ResourceType;
  // 这个复合事件接受如下原子事件做聚合。
  abstract acceptEventNames: OPEventNameEnums[];
  atomType = EventAtomTypeEnums.COMB;
  abstract comb(events: IEventInstance<IAtomEvent>[]): IEventInstance<IOPEvent>[];
}

export type IEventType = IAtomEventType<any> | ICombEventType;