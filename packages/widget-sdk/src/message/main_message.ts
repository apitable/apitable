import { ICollaCommandExecuteResult, ICollaCommandOptions } from 'core';
import { IExpandRecordProps, IWidgetConfigIframe, IWidgetConfigIframePartial } from 'interface';
import { differenceBy } from 'lodash';
import { AnyAction } from 'redux';
import { IInitData, ISubscribeView, IFetchDatasheet } from './interface';
import { MessageType, PostMessage, postMessage, IContentWindow, MouseListenerType, IResponse, ConnectStatus } from './protocol';
import { interceptor } from './utils';

interface IWidget {
  /** Widget connection status */
  connect: ConnectStatus;
  /** Manage widget view cache subscriptions */
  subscribeViews: ISubscribeView[];
  /** bind datasheet ID */
  bindDatasheetId: string;
}

/**
 * Manage sending messages for the main thread.
 */
class MainMessage {
  // Current form marking.
  origin: string = 'main';
  /**
   * Widget Map loaded by the main thread, managing connection status and 
   * view calculation subscriptions.
   * key => widgetId
   */
  widgets: Map<string, IWidget> = new Map;

  private messageBridge: PostMessage;

  constructor() {
    this.messageBridge = postMessage;
  }

  /**
   * Wraps the emit parameter with the current form identifier.
   * @param data
   */
  private wrapEmitData(data: IResponse) {
    return {
      ...data,
      origin: this.origin
    };
  }

  /**
   * Change connect status.
   */
  changeConnectStatus(widgetId: string, status: ConnectStatus) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.connect = status;
    }
  }

  /**
   * @param widgetId 
   * @returns 
   */
  getConnectStatus(widgetId: string) {
    const widget = this.widgets.get(widgetId);
    return widget?.connect;
  }

  /**
   * Set widget window
   * @param widgetId 
   * @param window 
   * @returns 
   */
  initWidgetWindow(widgetId: string, window: IContentWindow, bindDatasheetId: string) {
    // SYN_SENT
    const widget = this.widgets.get(widgetId);
    // Parameter checking, sandbox type widget must be passed in window.
    if (!window) {
      throw new Error(`widget(${widgetId}) declare sandbox, you must pass it into window`);
    }
    if (widget) {
      console.log('Please do not connect the widget repeatedly.');
      return;
    }
    this.widgets.set(widgetId, {
      connect: ConnectStatus.SYN_SENT,
      subscribeViews: [],
      bindDatasheetId
    });
    this.messageBridge.addWindow(widgetId, window!);
  }

  /**
   * Send messages.
   * @param widgetId 
   * @param type 
   * @param data 
   */
  emit(widgetId: string, type: MessageType, data?: any, messageId?: string) {
    this.messageBridge.emit(type, this.wrapEmitData({ success: true, data: data }), widgetId, messageId);
  }

  /**
   * Broadcast messages.
   * @param type 
   * @param data 
   */
  emitBroadcast(type: MessageType, data?: any) {
    this.messageBridge.emit(type, this.wrapEmitData({ success: true, data: data }));
  }

  /**
   * Receiving messages.
   * @param widgetId 
   * @param type 
   * @param callback 
   */
  on(widgetId: string, type: MessageType, callback: (data: any, messageId?: string) => void) {
    this.messageBridge.on(type, interceptor(callback), widgetId, widgetId);
  }

  /**
   * Clear the relevant data when the widget is uninstalled.
   * @param widgetId
   */
  unMounted(widgetId: string) {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      return;
    }
    this.widgets.delete(widgetId);
    this.messageBridge.removeWindow(widgetId);
    this.messageBridge.removeListenEventByKey(widgetId);
  }

  /**
   * Remove the message listener, clear the entire message type listener without specifying the window listener.
   * @param widgetId
   * @param type message type
   * @param key window ID
   */
  removeListenEvent(widgetId: string, type: MessageType) {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      return;
    }
    this.messageBridge.removeListenEvent(type, widgetId);
  }

  /**
   * Get the view of all widget in the main thread or a subscribed widget.
   * @param widgetId 
   */
  subscribeViews(widgetId?: string): ISubscribeView[] {
    if (widgetId) {
      return this.widgets.get(widgetId)?.subscribeViews || [];
    }
    return [...this.widgets.values()].reduce((collected: ISubscribeView[], item) => {
      collected.push(...item.subscribeViews);
      return collected;
    }, []);
  }

  /**
   * Receive connect a widget.
   * @param widgetId 
   * @param callback 
   * @param window
   */
  onConnectWidget(widgetId: string, callback: (status: ConnectStatus) => void) {
    this.on(widgetId, MessageType.WIDGET_CONNECT, () => {
      callback(ConnectStatus.SYN_SENT);
      this.emit(widgetId, MessageType.MAIN_CONNECT_WIDGET, { origin });
      this.on(widgetId, MessageType.WIDGET_CONNECT_ES, () => {
        // ESTABLISHED
        this.changeConnectStatus(widgetId, ConnectStatus.ESTABLISHED);
        callback(ConnectStatus.ESTABLISHED);
      });
    });
  }

  /**
   * Listening to widget initialization and sending the initialization data required by the widget.
   * @param callback
   */
  initWidget(widgetId: string, data: IInitData) {
    this.emit(widgetId, MessageType.MAIN_INIT_WIDGET_DATA, data);
  }

  /**
   * Sync widget config.
   * @param widgetId
   * @param config
   */
  syncWidgetConfig(widgetId: string, config: IWidgetConfigIframe) {
    this.emit(widgetId, MessageType.MAIN_SYNC_WIDGET_CONFIG, config);
  }
  
  /**
   * @param widgetId 
   */
  refreshWidget(widgetId: string) {
    this.emit(widgetId, MessageType.MAIN_REFRESH_WIDGET);
  }

  /**
   * Listening for widget config sync from widgets.
   * @param widgetId
   * @param callback
   */
  onWidgetConfig(widgetId: string, callback: (res: IWidgetConfigIframePartial) => void) {
    this.on(widgetId, MessageType.WIDGET_SYNC_WIDGET_CONFIG, callback);
  }

  /**
   * Listen to the cmd from the widget synced to the application.
   */
  onSyncCmdOptions(widgetId: string, callback: (res: ICollaCommandOptions) => void) {
    this.on(widgetId, MessageType.WIDGET_SYNC_COMMAND, callback);
  }

  /**
   * Synchronize the results of the main application application cmd.
   */
  syncCmdOptionsResult(widgetId: string, cmdOptionsResult: ICollaCommandExecuteResult<any>) {
    this.emit(widgetId, MessageType.MAIN_SYNC_COMMAND_RESULT, cmdOptionsResult);
  }

  /**
   * Synchronized RecordPicker selection results.
   */
  syncRecordPickerResult(widgetId: string, recordIds: string[], messageId?: string) {
    this.emit(widgetId, MessageType.MAIN_SYNC_RECORD_PICKER_RESULT, recordIds, messageId);
  }

  /**
   * Listening for expand card requests from the widget.
   */
  onExpandRecord(widgetId: string, callback: (expandRecordParams: IExpandRecordProps) => void) {
    this.on(widgetId, MessageType.WIDGET_EXPAND_RECORD, callback);
  }

  /**
   * Listens for requests to expand the record selector from the widget.
   */
  onExpandRecordPicker(widgetId: string, callback: (datasheetId: string, messageId?: string) => void) {
    this.on(widgetId, MessageType.WIDGET_EXPAND_RECORD_PICKER, callback);
  }

  /**
   * Mouse in and mouse out widgets iframe.
   */
  onMouseListener(widgetId: string, callback: (type: MouseListenerType) => void) {
    this.on(widgetId, MessageType.WIDGET_MOUSE_EVENT, callback);
  }

  /**
   * Enter developer mode.
   */
  onExpandDevConfig(widgetId: string, callback: () => void) {
    this.on(widgetId, MessageType.WIDGET_EXPAND_DEV_CONFIG, callback);
  }

  /**
   * Broadcast action.
   * @param action
   */
  syncActionBroadcast(action: AnyAction) {
    this.emitBroadcast(MessageType.MAIN_SYNC_ACTION, action);
  }
  
  /**
   * Synchronize the action to the specified widget.
   * @param widgetId 
   * @param action 
   */
  syncAction(widgetId: string, action: AnyAction, messageId?: string) {
    this.emit(widgetId, MessageType.MAIN_SYNC_ACTION, action, messageId);
  }

  onFetchDatasheet(widgetId: string, callback: (fetchDatasheet: IFetchDatasheet, messageId?: string) => void) {
    this.on(widgetId, MessageType.WIDGET_FETCH_DATASHEET, callback);
  }

  /**
   * Synchronizing view subscription data.
   * @param widgetId 
   * @param callback Pick out the new subscriptions, the user determines if there is currently a view-derived cache,
   * and if not, go to dispatch to trigger the computation.
   */
  onSyncWidgetSubscribeView(widgetId: string, callback: (subscribeViews: ISubscribeView[]) => void) {
    this.on(widgetId, MessageType.WIDGET_SUBSCRIBE_CHANGE, (subscribeViews: ISubscribeView[]) => {
      const widget = this.widgets.get(widgetId);
      if (widget) {
        const currentSubscribeViews = widget.subscribeViews;
        this.widgets.set(widgetId, {
          ...widget,
          subscribeViews
        });
        const newSubscribeViews = differenceBy(subscribeViews, currentSubscribeViews, ({ datasheetId, viewId }) => `${datasheetId}-${viewId}`);
        callback(newSubscribeViews);
      }
    });
  }
}

export const mainMessage = new MainMessage();