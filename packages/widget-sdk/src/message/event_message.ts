import { ICollaCommandExecuteResult, ICollaCommandOptions } from '@apitable/core';
import { differenceBy } from 'lodash';
import { AnyAction } from 'redux';
import { IFetchDatasheet, ISubscribeView } from './interface';
import { IResponse, MessageType } from './protocol';
import { eventEmitter, EventEmitter } from './protocol/event_emitter';
import { interceptor } from './utils';

interface IWidget {
  /** Manage widget view cache subscriptions */
  subscribeViews: ISubscribeView[];
}

class EventMessage {
  widgets: Map<string, IWidget> = new Map();

  private messageBridge: EventEmitter;

  constructor() {
    this.messageBridge = eventEmitter;
  }

  emit(type: MessageType, data: any, key?: string) {
    this.messageBridge.emit(type, { success: true, data }, key);
  }

  on(type: MessageType, callback: (data: IResponse<any>) => void, key: string) {
    this.messageBridge.on(type, callback, key);
  }

  removeListenEvent(widgetId: string, type: MessageType) {
    this.messageBridge.removeListenEvent(type, widgetId);
  }

  removeListenEventByKey(key: string) {
    this.messageBridge.removeListenEventByKey(key);
  }

  mountWidget(widgetId: string) {
    this.widgets.set(widgetId, {
      subscribeViews: []
    });
  }

  unMounted(widgetId: string) {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      return;
    }
    this.widgets.delete(widgetId);
    this.messageBridge.removeListenEventByKey(widgetId);
  }

  syncAction(action: AnyAction, widgetId?: string) {
    this.emit(MessageType.MAIN_SYNC_ACTION, action, widgetId);
  }

  onSyncAction(widgetId: string, callback: (res: AnyAction, messageId?: string) => void) {
    this.on(MessageType.MAIN_SYNC_ACTION, interceptor(callback), widgetId);
  }

  refreshWidget(widgetId: string) {
    this.emit(MessageType.MAIN_REFRESH_WIDGET, widgetId);
  }

  onRefreshWidget(widgetId: string, callback: (res: string) => void) {
    this.on(MessageType.MAIN_REFRESH_WIDGET, interceptor(callback), widgetId);
  }

  subscribeViews(widgetId?: string): ISubscribeView[] {
    if (widgetId) {
      return this.widgets.get(widgetId)?.subscribeViews || [];
    }
    return [...this.widgets.values()].reduce((collected: ISubscribeView[], item) => {
      collected.push(...item.subscribeViews);
      return collected;
    }, []);
  }

  onSyncWidgetSubscribeView(widgetId: string, callback: (subscribeViews: ISubscribeView[]) => void) {
    this.on(MessageType.WIDGET_SUBSCRIBE_CHANGE, interceptor((subscribeViews: ISubscribeView[]) => {
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
    }), widgetId);
  }

  syncWidgetSubscribeView(subscribeViews: ISubscribeView[], widgetId: string) {
    this.emit(MessageType.WIDGET_SUBSCRIBE_CHANGE, subscribeViews, widgetId);
  }

  fetchDatasheet(fetchDatasheet: IFetchDatasheet, widgetId: string) {
    return this.emit(MessageType.WIDGET_FETCH_DATASHEET, fetchDatasheet, widgetId);
  }

  onFetchDatasheet(widgetId: string, callback: (fetchDatasheet: IFetchDatasheet, messageId?: string) => void) {
    this.on(MessageType.WIDGET_FETCH_DATASHEET, interceptor(callback), widgetId);
  }

  syncCmd(cmdOptions: ICollaCommandOptions, widgetId: string): Promise<ICollaCommandExecuteResult<any>> {
    this.emit(MessageType.WIDGET_SYNC_COMMAND, cmdOptions);
    return new Promise((resolve, reject) => {
      this.on(MessageType.MAIN_SYNC_COMMAND_RESULT, interceptor((res: IResponse<ICollaCommandExecuteResult<any>>) => {
        if (res.success && res.data) {
          resolve(res.data);
          return;
        }
        reject(res.message);
      }), widgetId);
    });
  }

  onSyncCmdOptions(widgetId: string, callback: (res: ICollaCommandOptions) => void) {
    this.on(MessageType.WIDGET_SYNC_COMMAND, interceptor(callback), widgetId);
  }

  syncCmdOptionsResult(widgetId: string, cmdOptionsResult: ICollaCommandExecuteResult<any>) {
    this.emit(MessageType.MAIN_SYNC_COMMAND_RESULT, cmdOptionsResult, widgetId);
  }
}

export const eventMessage = new EventMessage();