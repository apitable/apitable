import {
  ICollaCommandExecuteResult, ICollaCommandOptions, IDatasheetMap, ILabs, IMirrorMap, IOperation, IPageParams, IShareInfo, IUnitInfo, IUserInfo,
  IViewRow, ResourceType
} from 'core';
import { WidgetLoadError } from 'initialize_widget';
import { IDatasheetClient, IDatasheetMainSimple, IExpandRecordProps, IWidgetConfigIframe, IWidgetDashboardState } from 'interface/modal';
import { IContentWindow, IInitResponse, IResponse, MouseListenerType, WidgetMessageType } from './interface';
import { isSafeOrigin } from './utils';

interface IMessage {
  type: string;
  response: IResponse;
  targetId?: string;
}

type IWidgetListenEvents = {
  [key in WidgetMessageType]: (res: IResponse) => void;
};
interface IListenEvents {
  [key: string]: IWidgetListenEvents
}

interface IListenDatasheetMap {
  [key: string]: {
    loading?: boolean;
    // 作为订阅的数据视图ID
    subscribeViewIds?: Set<string>;
  }
}

class MainWidgetMessageBase {
  enable = true;
  /** 作为发消息的 window */
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
        targetId && this.listenEvents?.[targetId]?.[type]?.(data.response);
      }, false);
    }
  }

  /**
   * 发送消息，如果有 key，则只会发送到指定 key 的 window，否则就广播到全体
   * @param type
   * @param data
   * @param widgetId
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
    this.listenEvents[widgetId] = {
      ...this.listenEvents[widgetId],
      [type]: callback,
    };
  }

  removeListenEvent(widgetId: string, type?: WidgetMessageType) {
    if (widgetId && !type) {
      this.listenEvents[widgetId] && delete this.listenEvents[widgetId];
    } else if (widgetId && type) {
      this.listenEvents?.[widgetId]?.[type] && delete this.listenEvents[widgetId][type];
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
   * 检查小程序是否在 iframe
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
   * 监听小组件初始化，发送小组件所需要的初始化数据
   * @param callback
   */
  onInitWidget(widgetId: string, callback: (res: IResponse<string>) => IInitResponse | null) {
    this.on({ type: WidgetMessageType.INIT_WIDGET, callback: (res: IResponse<string>) => {
      this.emit(WidgetMessageType.INIT_WIDGET, { success: true, data: callback(res) }, widgetId);
    }, widgetId });
  }

  /**
   * 当小组件或者数表的数据发生变化同步 operations 到小组件中应用
   * @param operations
   * @param resourceType 资源类型
   * @param resourceId 资源ID
   */
  syncOperations(operations: IOperation[], resourceType: ResourceType, resourceId: string) {
    this.emit(
      WidgetMessageType.SYNC_OPERATIONS,
      { success: true, data: { operations, resourceType, resourceId }},
      resourceType === ResourceType.Widget ? resourceId : undefined
    );
  }

  /**
   * 同步 config
   * @param widgetId 来源ID
   * @param config
   */
  syncWidgetConfig(widgetId: string, config: IWidgetConfigIframe) {
    this.emit(WidgetMessageType.SYNC_WIDGET_CONFIG, { success: true, data: config }, widgetId);
  }

  /**
   * 刷新小组件
   * @param widgetId
   */
  refreshWidget(widgetId: string) {
    this.emit(WidgetMessageType.REFRESH_WIDGET, { success: true, data: null }, widgetId);
  }

  /**
   * 当关联表更新的时候，需要强制刷新 snapshot 去触发重新计算 visibleRows
   * 强制刷新 snapshot
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
   * 监听来自小组件的 widget config 同步
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
   * 监听来自小组件同步过来应用的cmd
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
   * 同步主应用应用 cmd 的结果
   */
  syncCmdOptionsResult(widgetId: string, cmdOptionsResult: ICollaCommandExecuteResult<any>) {
    this.emit(WidgetMessageType.SYNC_COMMAND_RESULT, { success: true, data: cmdOptionsResult }, widgetId);
  }

  /**
   * 同步主应用 datasheet 中 client 相关数据同步
   */
  syncClient(client: IDatasheetClient) {
    this.emit(WidgetMessageType.SYNC_DATASHEET_CLIENT, { success: true, data: client });
  }

  /**
   * 同步主应用 unitInfo 相关数据同步
   */
  syncUnitInfo(unitInfo: IUnitInfo) {
    this.emit(WidgetMessageType.SYNC_UNIT_INFO, { success: true, data: unitInfo });
  }

  /**
   * 同步主应用 pageParams 相关数据同步
   */
  syncPageParams(pageParams: IPageParams) {
    this.emit(WidgetMessageType.SYNC_PAGE_PARAMS, { success: true, data: pageParams });
  }

  /**
   * 同步主应用 labs 相关数据同步
   */
  syncLabs(labs: ILabs) {
    this.emit(WidgetMessageType.SYNC_LABS, { success: true, data: labs });
  }

  /**
   * 同步主应用 share 相关数据同步
   */
  syncShare(share: IShareInfo) {
    this.emit(WidgetMessageType.SYNC_SHARE, { success: true, data: share });
  }

  /**
   * 同步 dashboard 数据
   * @param dashboard
   */
  syncDashboard(dashboard: Partial<IWidgetDashboardState>) {
    this.emit(WidgetMessageType.SYNC_DASHBOARD, { success: true, data: dashboard });
  }

  /**
   * 同步主应用 mirrorMap 相关数据同步
   */
  syncMirrorMap(mirrorMap: IMirrorMap) {
    this.emit(WidgetMessageType.SYNC_MIRROR, { success: true, data: mirrorMap });
  }

  /**
   * 监听小组件发起的加载其他关联表数据请求
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
   * 其他关联表数据加载完成之后发送给小组件
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
   * 其他关联表更新数据发送给小组件
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
   * 监听来自小组件的 展开卡片请求
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
   * 鼠标进入和离开小组件 iframe
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
   * 广播缓存更新，只要有依赖的小组件 全部发送
   * 只在数表情况下更新当前视图的缓存数据
   * @param cache visibleRowsBase 缓存
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
   * 监听来自小组件的缓存获取，并加入入订阅中
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
   * 定向发送缓存更新
   */
  syncCalcCacheWidget(widgetId: string, datasheetId: string, viewId: string, cache: IViewRow[]) {
    this.emit(WidgetMessageType.CALC_CACHE, { success: true, data: { datasheetId, viewId, cache }}, widgetId);
  }

  /**
   * 进入开发者模式
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
   * 加载小程序
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
   * 监听加载结果
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
   * 标记缓存过期
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
   * 同步主应用 userInfo 相关数据
   * @param userInfo
   */
  syncUserInfo(userInfo: IUserInfo) {
    this.emit(WidgetMessageType.SYNC_USER_INFO, { success: true, data: userInfo });
  }
}

export const mainWidgetMessage = new MainWidgetMessage();
