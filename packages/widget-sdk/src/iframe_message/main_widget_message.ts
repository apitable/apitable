/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  ICollaCommandExecuteResult, ICollaCommandOptions, IDatasheetMap, ILabs, IMirrorMap, IOperation, IPageParams, IShareInfo, IUnitInfo, IUserInfo,
  IViewRow, ResourceType
} from 'core';
import { WidgetLoadError } from 'initialize_widget';
import { IDatasheetClient, IDatasheetMainSimple, IExpandRecordProps, IWidgetConfigIframe, IWidgetDashboardState } from 'interface/modal';
import { IContentWindow, IInitResponse, IResponse, MouseListenerType, WidgetMessageType } from './interface';
import { isSafeOrigin } from './utils';

interface IMessage {
  type: WidgetMessageType;
  response: IResponse;
  targetId?: string;
}

type IWidgetListenEvents = Map<WidgetMessageType, (res: IResponse) => void>;

interface IListenEvents {
  [key: string]: IWidgetListenEvents
}

interface IListenDatasheetMap {
  [key: string]: {
    loading?: boolean;
    // data view ID as a subscription
    subscribeViewIds?: Set<string>;
  }
}

class MainWidgetMessageBase {
  enable = true;
  /** as the window for sending messages */
  private contentWindows: {
    [key: string]: IContentWindow;
  } = {};

  private listenEvents: IListenEvents = {};

  constructor() {
    if(!process.env.SSR){
      window.addEventListener('message', (event: MessageEvent<IMessage>) => {
        const { origin, data } = event;
        if (!isSafeOrigin(origin)) {
          return;
        }
        const { type, targetId } = data;
        const widgetEventMap = targetId ? this.listenEvents[targetId] : undefined;
        if (!widgetEventMap) {
          return;
        }
        const func = widgetEventMap.get(type);
        typeof func === 'function' && func(data.response);
      }, false);
    }
  }

  /**
   * This is a method that sends a message, if the third parameter key is passed, 
   * it will only be sent to the window with the specified key, otherwise it will be broadcast to all.
   * @param type
   * @param data
   * @param key General is widgetId.
   */
  emit(type: WidgetMessageType, data: IResponse, key?: string) {
    if (key) {
      const { window: messageWindow, origin } = this.contentWindows[key] || {};
      messageWindow && messageWindow.postMessage({
        response: data,
        type
      }, origin);
      return;
    }
    Object.keys(this.contentWindows).forEach(key => {
      const { window: messageWindow, origin } = this.contentWindows[key] || {};
      messageWindow.postMessage({
        response: data,
        type
      }, origin);
    });
  }

  on(props: { widgetId: string, type: WidgetMessageType, callback: (data: IResponse) => void }) {
    const { widgetId, type, callback } = props;
    if (!this.listenEvents[widgetId]) {
      this.listenEvents[widgetId] = new Map();
    }
    const widgetEventMap = this.listenEvents[widgetId];
    widgetEventMap.set(type, callback);
  }

  removeListenEvent(widgetId: string, type?: WidgetMessageType) {
    if (widgetId && !type) {
      this.listenEvents[widgetId] && delete this.listenEvents[widgetId];
    } else if (widgetId && type) {
      const widgetEventMap = this.listenEvents[widgetId];
      widgetEventMap && widgetEventMap.delete(type);
    } else {
      console.warn('removeListenEvent have no params');
    }
  }

  addWindow(widgetId: string, window: IContentWindow) {
    this.contentWindows[widgetId] = window;
  }

  removeWindow(widgetId: string) {
    if (!this.contentWindows[widgetId]) {
      console.warn(`${widgetId} have no window`);
      return;
    }
    delete this.contentWindows[widgetId];
    this.removeListenEvent(widgetId);
  }

  /**
   * Check whether the widget is in an iframe window.
   * @param widgetId
   */
  widgetInIframe(widgetId: string) {
    return Boolean(this.contentWindows[widgetId]);
  }
}

class MainWidgetMessage extends MainWidgetMessageBase {
  widgets: {[key: string]: { connected: boolean, listenDatasheetMap: IListenDatasheetMap }} = {};

  getSubscribeViewIds(datasheetId: string) {
    const viewIds = Object.values(this.widgets).map(val => {
      return Array.from(val.listenDatasheetMap[datasheetId]?.subscribeViewIds || []);
    }).flat(1);
    return [...new Set(viewIds)];
  }

  removeWindow(widgetId: string) {
    super.removeWindow(widgetId);
    delete this.widgets?.[widgetId];
  }

  connectWidget(widgetId: string, origin: string, callback: () => void) {
    this.emit(WidgetMessageType.CONNECT_IFRAME, { success: true, data: { origin }}, widgetId);
    this.on({ type: WidgetMessageType.CONNECT_IFRAME, callback: () => {
      this.widgets[widgetId] = {
        ...this.widgets[widgetId],
        connected: true,
        listenDatasheetMap: {}
      };
      callback();
    }, widgetId });
  }

  /**
   * Listen to widget initialization and send the initialization data required by the widget.
   * @param callback
   */
  onInitWidget(widgetId: string, callback: (res: IResponse<string>) => IInitResponse | null) {
    this.on({ type: WidgetMessageType.INIT_WIDGET, callback: (res: IResponse<string>) => {
      this.emit(WidgetMessageType.INIT_WIDGET, { success: true, data: callback(res) }, widgetId);
    }, widgetId });
  }

  /**
   * Synchronize operations to the widget when the data in the widget or datasheet changes 
   * @param operations
   * @param resourceType
   * @param resourceId
   */
  syncOperations(operations: IOperation[], resourceType: ResourceType, resourceId: string) {
    this.emit(
      WidgetMessageType.SYNC_OPERATIONS,
      { success: true, data: { operations, resourceType, resourceId }},
      resourceType === ResourceType.Widget ? resourceId : undefined
    );
  }

  /**
   * Synchronize configuration on some widget behaviors, such as setting and expanding widget.
   * @param widgetId
   * @param config
   */
  syncWidgetConfig(widgetId: string, config: IWidgetConfigIframe) {
    this.emit(WidgetMessageType.SYNC_WIDGET_CONFIG, { success: true, data: config }, widgetId);
  }

  /**
   * Trigger the widget reloading.
   * @param widgetId
   */
  refreshWidget(widgetId: string) {
    this.emit(WidgetMessageType.REFRESH_WIDGET, { success: true, data: null }, widgetId);
  }

  /**
   * This method is a forced refresh of the snapshot.
   * When the associated table is updated, you need to force a snapshot refresh to trigger a recalculation of visibleRows.
   * @param datasheetId
   */
  refreshSnapshot(datasheetId: string) {
    if (datasheetId) {
      Object.keys(this.widgets).forEach(widgetId => {
        const widget = this.widgets[widgetId];
        if (widget.listenDatasheetMap[datasheetId]) {
          this.emit(WidgetMessageType.REFRESH_SNAPSHOT, { success: true, data: datasheetId }, widgetId);
        }
      });
    }
  }

  /**
   * Listening for widget config sync from widgets.
   */
  onWidgetConfig(widgetId: string, callback: (res: IWidgetConfigIframe) => void) {
    this.on({
      type: WidgetMessageType.SYNC_WIDGET_CONFIG,
      callback: (res: IResponse<IWidgetConfigIframe>) => {
        if (res.success && res.data) {
          callback(res.data);
          return;
        }
        console.error(res.message);
      },
      widgetId
    });
  }

  /**
   * Listening for cmd sync from widgets.
   */
  onSyncCmdOptions(widgetId: string, callback: (res: ICollaCommandOptions) => void) {
    this.on({ type: WidgetMessageType.SYNC_COMMAND, callback: (res: IResponse<ICollaCommandOptions>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Listening for the results of the main application application cmd sync.
   */
  syncCmdOptionsResult(widgetId: string, cmdOptionsResult: ICollaCommandExecuteResult<any>) {
    this.emit(WidgetMessageType.SYNC_COMMAND_RESULT, { success: true, data: cmdOptionsResult }, widgetId);
  }

  /**
   * Synchronize client-related data in the main application datasheet.
   */
  syncClient(client: IDatasheetClient) {
    this.emit(WidgetMessageType.SYNC_DATASHEET_CLIENT, { success: true, data: client });
  }

  /**
   * Synchronize userInfo-related data in the main application datasheet.
   */
  syncUnitInfo(unitInfo: IUnitInfo) {
    this.emit(WidgetMessageType.SYNC_UNIT_INFO, { success: true, data: unitInfo });
  }

  /**
   * Sync main application pageParams related data synchronization.
   */
  syncPageParams(pageParams: IPageParams) {
    this.emit(WidgetMessageType.SYNC_PAGE_PARAMS, { success: true, data: pageParams });
  }

  /**
   * Sync main application labs related data synchronization.
   */
  syncLabs(labs: ILabs) {
    this.emit(WidgetMessageType.SYNC_LABS, { success: true, data: labs });
  }

  /**
   * Sync main application share related data synchronization.
   */
  syncShare(share: IShareInfo) {
    this.emit(WidgetMessageType.SYNC_SHARE, { success: true, data: share });
  }

  /**
   * Synchronizing dashboard data.
   * @param dashboard
   */
  syncDashboard(dashboard: Partial<IWidgetDashboardState>) {
    this.emit(WidgetMessageType.SYNC_DASHBOARD, { success: true, data: dashboard });
  }

  /**
   * Sync main application mirrorMap related data synchronization.
   */
  syncMirrorMap(mirrorMap: IMirrorMap) {
    this.emit(WidgetMessageType.SYNC_MIRROR, { success: true, data: mirrorMap });
  }

  /**
   * Listening to widget-initiated requests to load other linked table data.
   */
  onLoadOtherDatasheetInit(widgetId: string, callback: (res: string) => void) {
    this.on({ type: WidgetMessageType.LOAD_OTHER_DATASHEET_INIT, callback: (res: IResponse<string>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Send to the widget after the other linked table data is loaded.
   */
  loadOtherDatasheetInit(datasheetId: string, datasheetMap: IDatasheetMap) {
    if (datasheetId) {
      Object.keys(this.widgets).forEach(widgetId => {
        const widget = this.widgets[widgetId];
        if (widget.listenDatasheetMap[datasheetId]) {
          this.emit(WidgetMessageType.LOAD_OTHER_DATASHEET_INIT, { success: true, data: datasheetMap }, widgetId);
        }
      });
    }
  }

  /**
   * Other related tables update data to send to the widget.
   */
  datasheetSimpleUpdate(datasheetIds: string[], datasheetSimple: {[datasheetId: string]: IDatasheetMainSimple}) {
    if (datasheetIds.length) {
      Object.keys(this.widgets).forEach(widgetId => {
        const widget = this.widgets[widgetId];
        if (datasheetIds.some(datasheetId => widget.listenDatasheetMap[datasheetId])) {
          this.emit(WidgetMessageType.LOAD_OTHER_DATASHEET_UPDATE, { success: true, data: datasheetSimple }, widgetId);
        }
      });
    }
  }

  /**
   * Listening for expand card requests from the widget.
   */
  onExpandRecord(widgetId: string, callback: (expandRecordParams: IExpandRecordProps) => void) {
    this.on({ type: WidgetMessageType.EXPAND_RECORD, callback: (res: IResponse<IExpandRecordProps>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Mouse in and out of the widget iframe window.
   */
  onMouseListener(widgetId: string, callback: (type: MouseListenerType) => void) {
    this.on({ type: WidgetMessageType.MOUSE_EVENT, callback: (res: IResponse<MouseListenerType>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Broadcast the cache updates to the widget, and send all the widgets that have dependencies.
   * In the case of a datasheet, only the cached data of the current view is updated.
   * @param cache visibleRowsBase cache.
   */
  syncCalcCache(datasheetId: string, viewId: string, cache: IViewRow[]) {
    Object.keys(this.widgets).forEach(widgetId => {
      const widget = this.widgets[widgetId];
      if (widget.listenDatasheetMap[datasheetId]?.subscribeViewIds?.has(viewId)) {
        this.emit(WidgetMessageType.CALC_CACHE, { success: true, data: { datasheetId, viewId, cache }}, widgetId);
      }
    });
  }

  /**
   * Listen for cache fetches from the widget and add them to the subscription.
   */
  onInitCalcCache(widgetId: string, callback: (datasheetId: string, viewId: string) => void) {
    this.on({ type: WidgetMessageType.CALC_CACHE, callback: (res: IResponse<{ datasheetId: string, viewId: string }>) => {
      if (res.success && res.data) {
        const { datasheetId, viewId } = res.data;
        const datasheetListen = this.widgets[widgetId].listenDatasheetMap[datasheetId] || {};
        if (datasheetListen.subscribeViewIds) {
          datasheetListen.subscribeViewIds.add(viewId);
        } else {
          datasheetListen.subscribeViewIds = new Set([viewId]);
        }
        callback(datasheetId, viewId);
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Send targeted updates to the cache of a view.
   */
  syncCalcCacheWidget(widgetId: string, datasheetId: string, viewId: string, cache: IViewRow[]) {
    this.emit(WidgetMessageType.CALC_CACHE, { success: true, data: { datasheetId, viewId, cache }}, widgetId);
  }

  /**
   * Enter developer mode.
   */
  onExpandDevConfig(widgetId: string, callback: () => void) {
    this.on({ type: WidgetMessageType.EXPAND_DEV_CONFIG, callback: (res: IResponse) => {
      if (res.success) {
        callback();
        return;
      }
      console.error(res.message);
    }, widgetId });
  }

  /**
   * Go to loading widget.
   * @param devUrl
   * @param widgetPackageId
   * @param refresh
   */
  loadWidget(widgetId: string, devUrl: string, widgetPackageId: string, refresh?: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.removeListenEvent(widgetId, WidgetMessageType.LOAD_WIDGET_RESULT);
      this.emit(WidgetMessageType.LOAD_WIDGET, { success: true, data: {
        devUrl,
        widgetPackageId,
        refresh
      }}, widgetId);
      this.onLoadWidget(widgetId, (error?: WidgetLoadError) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * Listening for loading widget results.
   * @param widgetId
   * @param callback
   */
  onLoadWidget(widgetId: string, callback: (error?: WidgetLoadError) => void) {
    this.on({
      type: WidgetMessageType.LOAD_WIDGET_RESULT,
      callback: (res: IResponse<WidgetLoadError | undefined>) => {
        if (res.success) {
          callback(res?.data);
        }
      },
      widgetId
    });
  }

  /**
   * Marking cache expiration.
   * @param callback
   */
  calcExpire(datasheetId: string, viewId: string) {
    Object.keys(this.widgets).forEach(widgetId => {
      const widget = this.widgets[widgetId];
      const subscribeViewIds = widget.listenDatasheetMap[datasheetId]?.subscribeViewIds;
      if (widget.listenDatasheetMap[datasheetId]?.subscribeViewIds?.has(viewId)) {
        subscribeViewIds?.delete(viewId);
        this.emit(WidgetMessageType.CALC_EXPIRE, { success: true, data: { datasheetId, viewId }}, widgetId);
      }
    });
  }

  /**
   * Synchronize data related to the main application userInfo.
   * @param userInfo
   */
  syncUserInfo(userInfo: IUserInfo) {
    this.emit(WidgetMessageType.SYNC_USER_INFO, { success: true, data: userInfo });
  }
}

export const mainWidgetMessage = new MainWidgetMessage();
