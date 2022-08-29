import { defaultEventListenerOptions, EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from './const';
import { IEventListenerMap, IEventListenerOptions, IEventManager } from './interface';
import {
  IOPEvent,
  IEventInstance,
  AnyObject
} from './interface/event.interface';
import { isEqual } from 'lodash';

/**
 * 管理事件监听
 */
export class EventManager implements IEventManager {
  // 维护注册事件和绑定动作的映射关系
  eventListenerMap: IEventListenerMap = {};

  /**
   * 监听事件
   * @param event 事件名
   * @param actionFunc 动作函数
   */
  addEventListener(eventName: OPEventNameEnums, actionFunc: (context: any) => void, _options: IEventListenerOptions = defaultEventListenerOptions) {
    const options = { ...defaultEventListenerOptions, ..._options };
    const eventListener = {
      actionFunc,
      options,
    };
    if (this.eventListenerMap[eventName]) {
      this.eventListenerMap[eventName].push(eventListener);
    } else {
      this.eventListenerMap[eventName] = [eventListener];
    }
  }

  /**
   * 取消事件监听
   * @param event 
   * @param actionFunc 
   * @param options 
   */
  removeEventListener(
    eventName: OPEventNameEnums,
    actionFunc: (context: any) => void,
    _options: IEventListenerOptions = defaultEventListenerOptions
  ) {
    const options = { ...defaultEventListenerOptions, ..._options };
    const eventListeners = this.eventListenerMap[eventName];
    const thisEventListenerSignature = {
      actionFunc: actionFunc.toString(),
      options,
    };
    if (eventListeners) {
      const listenerIndex = eventListeners.findIndex(item => {
        const itemSignature = {
          actionFunc: item.actionFunc.toString(),
          options: item.options,
        };
        return isEqual(itemSignature, thisEventListenerSignature);
      });
      if (listenerIndex > -1) {
        eventListeners.splice(listenerIndex, 1);
      }
    }
  }

  /**
   * 触发事件，op 流会自动触发事件，也可以手动触发。
   * @param event 
   * @param context 
   */
  dispatchEvent(event: IEventInstance<IOPEvent>, beforeApply: boolean, metaContext: AnyObject = {}) {
    const eventListeners = this.eventListenerMap[event.eventName];
    if (eventListeners) {
      eventListeners.forEach(({ actionFunc, options }) => {
        if (options?.realType !== EventRealTypeEnums.ALL && options?.realType !== event.realType) {
          return;
        }
        if (options?.sourceType !== EventSourceTypeEnums.ALL && options?.sourceType !== event.sourceType) {
          return;
        }
        if (Boolean(options.beforeApply) !== beforeApply) {
          return;
        }
        actionFunc(event.context, metaContext);
      });
    }
  }

  handleEvents(events: IEventInstance<IOPEvent>[], beforeApply: boolean, context = {}) {
    events.forEach(event => {
      this.dispatchEvent(event, beforeApply, context);
    });
  }
}