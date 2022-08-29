import { IChangeset } from 'engine/ot/interface';
import { OP2Event } from 'event_manager/op2event';
import { IReduxState } from 'store';
import { IEventInstance, IOPEvent } from './event.interface';
import { IEventManager } from './event_manager.interface';

export interface IOPEventManagerOptions {
  op2Event: OP2Event;
  /**
   * 如何获取 state
   */
  getState: (resourceMap?: any) => IReduxState | Promise<IReduxState>;
  options: {
    // 是否开启虚拟事件
    enableVirtualEvent?: boolean;
    // 是否开启组合事件
    enableCombEvent?: boolean;
    // 是否开启事件补全
    enableEventComplete?: boolean;
  }
}

type IEvents = IEventInstance<IOPEvent>[];
export interface IOPEventManager extends IEventManager {
  // 下面2个方法是一样的处理逻辑，不同的是在 getState 时
  // room 层需要异步查库；前端则是直接同步操作，否者状态会不一致。
  asyncHandleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): Promise<IEvents>
  handleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): IEvents
}