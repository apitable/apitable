import { IJOTAction, IOperation } from 'engine/ot/interface';
import { ResourceType } from '../../types/resource_types';
import { EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from '../const';

export type AnyObject = Record<string, any>;

// 事件基础接口
export interface IEventBase {
  eventName: OPEventNameEnums;
  realType: EventRealTypeEnums;
  atomType: EventAtomTypeEnums;
  scope: ResourceType;
}

export interface IEventTestResult<T> {
  pass: boolean; // 事件是否触发
  context: null | AnyObject & T; // 事件返回的自定义上下文
}

export interface IRealAtomEvent extends IEventBase {
  realType: EventRealTypeEnums.REAL;
  atomType: EventAtomTypeEnums.ATOM;
}

export interface IVirtualAtomEvent extends IEventBase {
  realType: EventRealTypeEnums.VIRTUAL;
  atomType: EventAtomTypeEnums.ATOM;
}

export interface IRealCombEvent extends IEventBase {
  realType: EventRealTypeEnums.REAL;
  atomType: EventAtomTypeEnums.COMB;
}

export interface IVirtualCombEvent extends IEventBase {
  realType: EventRealTypeEnums.VIRTUAL;
  atomType: EventAtomTypeEnums.COMB;
}

export type IAtomEvent = IRealAtomEvent | IVirtualAtomEvent;
export type ICombEvent = IRealCombEvent | IVirtualCombEvent;
export type IOPEvent = IAtomEvent | ICombEvent;

export type IEventInstance<T> = T & {
  context: AnyObject,
  sourceType: EventSourceTypeEnums;
};

// changeset 组装出来的 op 上下文
export interface IOPBaseContext {
  // cmd 产生的 ops
  op: IOperation;
  // 单个 op action
  action: IJOTAction;
  // 资源类型
  resourceType: ResourceType;
  // 资源 id
  resourceId: string;
}
