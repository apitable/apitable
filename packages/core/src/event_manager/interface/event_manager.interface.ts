import { EventRealTypeEnums, EventSourceTypeEnums } from 'index';
import { AnyObject, IEventInstance, IOPEvent } from './event.interface';

export interface IEventListenerMap {
  [event: string]: {
    actionFunc(context: AnyObject, metaContext: AnyObject): void;
    options?: IEventListenerOptions;
  }[];
}

export interface IEventListenerOptions {
  // event source
  sourceType?: EventSourceTypeEnums,
  // the authenticity of the event
  realType?: EventRealTypeEnums;
  // The change of each event will be applied to the corresponding state tree, 
  // whether the event callback is triggered before the application or after the application.
  beforeApply?: boolean;
}

export interface IEventManager {
  // maintenance of listening events
  eventListenerMap: IEventListenerMap;
  // register event listener
  addEventListener(eventName: string, actionFunc: Function, options?: IEventListenerOptions): void;
  // remove event listener
  removeEventListener(eventName: string, actionFunc: Function): void;
  // dispatch event
  dispatchEvent(event: IEventInstance<IOPEvent>, beforeApply: boolean, context?: any): void;
  // receive event stream
  handleEvents(events: IEventInstance<IOPEvent>[], beforeApply: boolean, context?: any): void;
}