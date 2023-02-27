import { IResponse, MessageType } from './interface';

type ICallBack = (res: IResponse, messageId?: string) => void;

type IEventMap = Map<MessageType, {[key: string]: ICallBack[]}>;

/**
 * Make a layer of callback proxy, if the message body declares origin source form, 
 * when joining the listener will declare that only the source will be processed.
 */
const getProxyCallback = (callback: (data: IResponse, messageId?: string) => void, origin?: string) => {
  return (data: IResponse, messageId?: string) => {
    // Calibrate source form.
    if (origin && data.origin && origin !== data.origin) {
      return;
    }
    callback(data, messageId);
  };
};

/**
 * Communication protocol base class definition.
 * Define the communication method, will be eventBus, 
 * postMessage two communication method inheritance.
 * emit send message
 * on receiving message
 */
export abstract class Protocol {
  /**
   * Communication event map.
   */
  protected eventMap: IEventMap = new Map();
  /**
   * Send the message, if it has a key, only to the window with the specified key, 
   * otherwise it is broadcast to all.
   * @param type message type
   * @param data response data body
   * @param key window ID
   */
  abstract emit(type: MessageType, data: IResponse, key?: string): void;
  /**
   * Remove the message listener, clear the entire message type listener without specifying the window listener.
   * @param type message type
   * @param key window ID
   */
  removeListenEvent(type: MessageType, key?: string) {
    const event = this.eventMap.get(type);
    if (!event) {
      return;
    }
    if (key) {
      delete event?.[key];
      this.eventMap.set(type, event);
      return;
    }
    this.eventMap.delete(type);
  }
  /**
   * When adding a listener, you need to pass in your own form identifier to 
   * facilitate receiving data from the specified form.
   * @param type message type
   * @param callback
   * @param key window key, the window identifier for the listener, is stored in the EventMap.
   * @param origin Source window, indicating that only messages window the source form will be processed,
   * or if declared, any person sending a message to this form will be processed.
   */
  on(type: MessageType, callback: (data: IResponse, messageId?: string) => void, key: string, origin?: string) {
    let event = this.eventMap.get(type);
    const proxyCallback = getProxyCallback(callback, origin);
    const callbacks = event && event[key] ? [...event[key]!, proxyCallback] : [proxyCallback];
    if (event) {
      event = {
        ...event,
        [key]: callbacks
      };
    } else {
      event = { [key]: callbacks };
    }
    this.eventMap.set(type, event);
  }

  /**
   * Get the callback array.
   * @param type message type
   * @param key window ID
   */
  getCallbacks(type: MessageType, key?: string): ICallBack[] {
    const event = this.eventMap.get(type);
    if (!event) {
      return [];
    }
    if (key) {
      return event?.[key] || [];
    }
    return Object.values(event).reduce((total, item) => {
      return [...total, ...item];
    }, []);
  }

  /**
   * Remove all event listeners for the specified window ID.
   * @param key window ID
   */
  removeListenEventByKey(key: string) {
    this.eventMap.forEach((v) => {
      delete v?.[key];
    });
  }
}
