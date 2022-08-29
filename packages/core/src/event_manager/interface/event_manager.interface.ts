import { EventRealTypeEnums, EventSourceTypeEnums } from 'index';
import { AnyObject, IEventInstance, IOPEvent } from './event.interface';

export interface IEventListenerMap {
  [event: string]: {
    actionFunc(context: AnyObject, metaContext: AnyObject): void;
    options?: IEventListenerOptions;
  }[];
}

export interface IEventListenerOptions {
  // 事件来源
  sourceType?: EventSourceTypeEnums,
  // 事件的真实性
  realType?: EventRealTypeEnums;
  // 每个事件的变更都会应用到对于的 state 树中，是在应用之前触发事件回掉还是在应用之后触发。
  beforeApply?: boolean;
}

export interface IEventManager {
  // 监听事件的维护
  eventListenerMap: IEventListenerMap;
  // 注册事件监听器
  addEventListener(eventName: string, actionFunc: Function, options?: IEventListenerOptions): void;
  // 移除事件监听器
  removeEventListener(eventName: string, actionFunc: Function): void;
  // 分发事件
  dispatchEvent(event: IEventInstance<IOPEvent>, beforeApply: boolean, context?: any): void;
  // 接收事件流
  handleEvents(events: IEventInstance<IOPEvent>[], beforeApply: boolean, context?: any): void;
}