import { IContentWindow, IMessage, IResponse, MessageType } from './interface';
import { Protocol } from './protocol';
import { isSafeOrigin } from '../utils';
import { messageMap } from './message_map';

/**
 * Communication by post message.
 * For sandbox rendering widget.
 */
export class PostMessage extends Protocol {
  enable: boolean = false;
  /**
   * As the window that sends the message, it can communicate with more than one window, 
   * and there can be more than one window.
   */
  private contentWindows: {
    [key: string]: IContentWindow;
  } = {};

  constructor() {
    super();
    window.addEventListener('message', (event: MessageEvent<IMessage>) => {
      const { origin, data } = event;
      if (!isSafeOrigin(origin)) {
        return;
      }
      const { type, response, messageId } = data;
      const callbacks = this.getCallbacks(type);
      callbacks.forEach(cb => {
        cb(response, messageId);
      });
    }, false);
  }
  
  emit(type: MessageType, data: IResponse, key?: string, messageId?: string, allowTimeout: boolean = false) {
    return new Promise((resolve, reject) => {
      if (key) {
        if (this.contentWindows[key]) {
          const { window: messageWindow, origin } = this.contentWindows[key]!;
          messageWindow.postMessage({
            messageId,
            response: data,
            type
          }, origin);
          messageId && messageMap.push(messageId, resolve, reject, allowTimeout);
          return;
        }
        return;
      }
      Object.keys(this.contentWindows).forEach(key => {
        if (!this.contentWindows[key]) {
          return;
        }
        const { window: messageWindow, origin } = this.contentWindows[key]!;
        messageWindow && messageWindow.postMessage({
          messageId,
          response: data,
          type
        }, origin);
        messageId && messageMap.push(messageId, resolve, reject, allowTimeout);
      });
    }).catch((e) => {
      console.warn(e);
    });
  }

  /**
   * Add window
   * @param key Unique window ID, generally widgetId for applet forms, and datasheet for main threads.
   * @param window
   */
  addWindow(key: string, window: IContentWindow) {
    this.contentWindows[key] = window;
  }

  /**
   * Remove window
   * @param widgetId 
   */
  removeWindow(key: string) {
    if (!this.contentWindows[key]) {
      console.warn('%s have no window', key);
      return;
    }
    delete this.contentWindows[key];
    // Clear the corresponding window event listener after removing the window.
    this.removeListenEventByKey(key);
  }
}

export const postMessage = process.env.SSR ? null as any : new PostMessage();