import { ICollaCommandExecuteResult, ICollaCommandOptions } from 'core';
import { IExpandRecordProps, IWidgetConfigIframe, IWidgetConfigIframePartial } from 'interface';
import { AnyAction } from 'redux';
import { IFetchDatasheet, IInitData, ISubscribeView } from './interface';
import { ConnectStatus, IResponse, MessageType, MouseListenerType, PostMessage, postMessage } from './protocol';
import { interceptor } from './utils';

let seed = 0;

const getMessageId = () => {
  const id = seed;
  seed ++;
  return `widget-message_${Date.now()}_${id}`;
};

class WidgetMessage {
  private target: string = 'main';
  // Current form marking.
  private origin: string;
  // Communication method.
  private messageBridge: PostMessage;
  /** Connect status */
  connect: ConnectStatus = ConnectStatus.CLOSED;

  constructor(widgetId: string) {
    this.origin = widgetId;
    this.messageBridge = postMessage;
  }

  /**
   * Messages in the widget, will only communicate with the main thread and will only accept messages from the main thread, 
   * so simplify the parameters here.
   * @param type 
   * @param callback 
   */
  private on(type: MessageType, callback: (data: IResponse<any>) => void) {
    return this.messageBridge.on(type, callback, this.origin, this.target);
  }

  /**
   * Messages in the widget, will only communicate with the main thread and 
   * will only accept messages from the main thread, so simplify the parameters here.
   * @param type 
   * @param data 
   */
  private async emit(type: MessageType, data: IResponse<any>, messageId?: string, allowTimeout: boolean = false) {
    return await this.messageBridge.emit(type, { ...data, origin: this.origin }, this.target, messageId, allowTimeout);
  }

  /**
   * Listening for connections.
   * @param callback 
   */
  connectWidget(callback: () => void) {
    (this.messageBridge as PostMessage).addWindow(this.target, {
      window: window.parent,
      origin: window.parent.origin
    });
    this.emit(MessageType.WIDGET_CONNECT, { success: true });
    this.connect = ConnectStatus.SYN_SENT;

    // Initializing the connection listener.
    const connectCb = () => {
      this.emit(MessageType.WIDGET_CONNECT_ES, { success: true });
      this.connect = ConnectStatus.ESTABLISHED;
      callback();
    };
    this.on(MessageType.MAIN_CONNECT_WIDGET, interceptor(connectCb));
  }

  /**
   * Listening for initialization data from the main thread.
   */
  onInitWidget(callback: (res: IInitData) => void) {
    this.on(MessageType.MAIN_INIT_WIDGET_DATA, interceptor(callback));
  }

  /**
   * Listening for config update messages from the main application.
   * @param callback 
   */
  onSyncWidgetConfig(callback: (res: IWidgetConfigIframe) => void) {
    this.on(MessageType.MAIN_SYNC_WIDGET_CONFIG, interceptor(callback));
  }

  /**
   * Refresh widget.
   * @param callback 
   */
  onRefreshWidget(callback: (res: string) => void) {
    this.on(MessageType.MAIN_REFRESH_WIDGET, interceptor(callback));
  }

  /**
   * Listening from autonomous application action.
   * @param callback 
   */
  onSyncAction(callback: (res: AnyAction, messageId?: string) => void) {
    this.on(MessageType.MAIN_SYNC_ACTION, interceptor(callback));
  }

  /**
   * Listening to the selection results from the autonomous application RecordPicker.
   * @param callback 
   */
  onSyncRecordPickerResult(callback?: (res: string[], messageId?: string) => void) {
    this.on(MessageType.MAIN_SYNC_RECORD_PICKER_RESULT, interceptor(callback));
  }

  /**
   * Synchronize config data to the main application.
   * @param config 
   */
  syncWidgetConfig(config: IWidgetConfigIframePartial) {
    this.emit(MessageType.WIDGET_SYNC_WIDGET_CONFIG, { success: true, data: config });
  }

  /**
   * Send cmd to main application.
   * @param cmdOptions 
   */
  syncCmd(cmdOptions: ICollaCommandOptions): Promise<ICollaCommandExecuteResult<any>> {
    this.emit(MessageType.WIDGET_SYNC_COMMAND, { success: true, data: cmdOptions });
    return new Promise((resolve, reject) => {
      this.on(MessageType.MAIN_SYNC_COMMAND_RESULT, (res: IResponse<ICollaCommandExecuteResult<any>>) => {
        if (res.success && res.data) {
          resolve(res.data);
          return;
        }
        reject(res.message);
      });
    });
  }

  /**
   * Trigger expandRecord.
   * @param expandRecordParams 
   */
  expandRecord(expandRecordParams: IExpandRecordProps) {
    this.emit(MessageType.WIDGET_EXPAND_RECORD, { success: true, data: expandRecordParams });
  }

  /**
   * Expand Record Selector.
   */
  async expandRecordPicker(datasheetId: string): Promise<unknown> {
    const messageId = getMessageId();
    return await this.emit(MessageType.WIDGET_EXPAND_RECORD_PICKER, { success: true, data: datasheetId }, messageId, true);
  }

  /**
   * Mouse in and mouse out widgets iframe.
   * @param type 
   */
  mouseListener(type: MouseListenerType) {
    this.emit(MessageType.WIDGET_MOUSE_EVENT, { success: true, data: type });
  }

  /**
   * Expand to enter the developer mode pop-up window.
   */
  expandDevConfig() {
    this.emit(MessageType.WIDGET_EXPAND_DEV_CONFIG, { success: true });
  }
  
  /**
   * Loading other datasheet data.
   * @param datasheetId
   */
  async fetchDatasheet(fetchDatasheet: IFetchDatasheet) {
    const messageId = getMessageId();
    return await this.emit(MessageType.WIDGET_FETCH_DATASHEET, { success: true, data: fetchDatasheet }, messageId);
  }

  /**
   * Synchronizing View Reference Count Subscription Data.
   * @param subscribeViews 
   */
  syncWidgetSubscribeView(subscribeViews: ISubscribeView[]) {
    this.emit(MessageType.WIDGET_SUBSCRIBE_CHANGE, { success: true, data: subscribeViews });
  }

  removeListenEvent(type: MessageType) {
    this.messageBridge.removeListenEvent(type);
  }

}

/**
 * Only one message can exist in an widget runtime environment by definition.
 */
export let widgetMessage: WidgetMessage;

/**
 * Initialize the widget communication class, 
 * you need to pass in the widgetId identifier and the current widget rendering mode.
 * @param widgetId 
 * @param sandbox 
 */
export const initWidgetMessage = (widgetId: string) => {
  widgetMessage = new WidgetMessage(widgetId);
  return widgetMessage;
};

