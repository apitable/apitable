import {
  ICollaCommandExecuteResult, ICollaCommandOptions, IUnitInfo, IPageParams, ILabs, IShareInfo, IDatasheetMap, IViewRow, IMirrorMap,
  IUserInfo
} from 'core';
import { loadWidget, WidgetLoadError } from 'initialize_widget';
import { IDatasheetClient, IDatasheetMainSimple, IExpandRecordProps, IWidgetConfigIframe, IWidgetDashboardState } from 'interface';
import { IExpireCalcCachePayload } from 'store';
import {
  IResponse, WidgetMessageType, IMessage, IContentWindow, ISyncOperations, IConnectResponse, IInitResponse, MouseListenerType
} from './interface';
import { isSafeOrigin } from './utils';

type IWidgetListenEvents = {
  [key in WidgetMessageType]: (res: IResponse) => void;
};

class WidgetMessageBase {
  widgetId: string;
  /** 作为发消息的 window */
  private contentWindow: IContentWindow | null = null;

  private listenEvents: IWidgetListenEvents | {} = {};

  constructor(widgetId: string) {
    this.widgetId = widgetId;
    window.addEventListener('message', (event: MessageEvent<IMessage>) => {
      const { origin, data } = event;
      if (!isSafeOrigin(origin)) {
        return;
      }
      const { type } = data;
      this.listenEvents[type]?.(data.response);
    }, false);
  }
  
  /**
   * 发送消息
   * @param type 
   * @param data 
   */
  emit(type: WidgetMessageType, data: IResponse) {
    if (!this.contentWindow) {
      return;
    }
    const { window: messageWindow, origin } = this.contentWindow;
    messageWindow && messageWindow.postMessage({
      response: data,
      type,
      targetId: this.widgetId
    }, origin);
  }

  on(type: WidgetMessageType, callback: (data: IResponse) => void) {
    this.listenEvents[type] = callback;
  }

  setContentWindow(contentWindow: IContentWindow) {
    this.contentWindow = contentWindow;
  }
}

class WidgetMessage extends WidgetMessageBase {
  connected = false;

  constructor(widgetId: string) {
    super(widgetId);
    this.on(WidgetMessageType.CONNECT_IFRAME, (res: IResponse<IConnectResponse>) => {
      if (res.data?.origin) {
        this.setContentWindow({
          origin: res.data?.origin,
          window: window.parent
        });
        this.connected = true;
        this.emit(WidgetMessageType.CONNECT_IFRAME, { success: true });
      }
    });
  }

  /**
   * 小组件初始化，去找主应用获取数据
   */
  initWidget(): Promise<IInitResponse> {
    this.emit(WidgetMessageType.INIT_WIDGET, { success: true, data: this.widgetId });
    return new Promise((resolve, reject) => {
      this.on(WidgetMessageType.INIT_WIDGET, (res: IResponse<IInitResponse>) => {
        if (res.success && res.data) {
          resolve(res.data);
        } else {
          reject(res.message);
        }
      });
    });
  }

  /**
   * 监听来自主应用的 operations 推送
   * @param callback 
   */
  onSyncOperations(callback: (res: IResponse<ISyncOperations>) => void) {
    this.on(WidgetMessageType.SYNC_OPERATIONS, (res: IResponse<ISyncOperations>) => {
      return callback(res);
    });
  }

  /**
   * 监听来自主应用的 config 更新消息
   * @param callback 
   */
  onSyncWidgetConfig(callback: (res: IResponse<IWidgetConfigIframe>) => void) {
    this.on(WidgetMessageType.SYNC_WIDGET_CONFIG, (config: IResponse<IWidgetConfigIframe>) => callback(config));
  }

  /**
   * 刷新小组件
   * @param callback 
   */
  onRefreshWidget(callback: (res: IResponse<string>) => void) {
    this.on(WidgetMessageType.REFRESH_WIDGET, (res: IResponse<string>) => callback(res));
  }

  onRefreshSnapshot(callback: (datasheetId: string) => void) {
    this.on(WidgetMessageType.REFRESH_SNAPSHOT, (res: IResponse<string>) => {
      if (res.success && res.data) {
        callback(res.data);
      }
    });
  }

  /**
   * 向主应用同步 config 数据
   */
  syncWidgetConfig(config: IWidgetConfigIframe) {
    this.emit(WidgetMessageType.SYNC_WIDGET_CONFIG, { success: true, data: config });
  }

  /**
   * 向主应用同步协同数据所产生的 operation
   */
  syncCmd(cmdOptions: ICollaCommandOptions): Promise<ICollaCommandExecuteResult<any>> {
    this.emit(WidgetMessageType.SYNC_COMMAND, { success: true, data: cmdOptions });
    return new Promise((resolve, reject) => {
      this.on(WidgetMessageType.SYNC_COMMAND_RESULT, (res: IResponse<ICollaCommandExecuteResult<any>>) => {
        if (res.success && res.data) {
          resolve(res.data);
          return;
        }
        reject(res.message);
      });
    });
  }

  /**
   * 监听来自主应用的 datasheet client 更新消息
   */
  onSyncDatasheetClient(callback: (res: IDatasheetClient) => void) {
    this.on(WidgetMessageType.SYNC_DATASHEET_CLIENT, (res: IResponse<IDatasheetClient>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 unitInfo 更新消息
   */
  onSyncUnitInfo(callback: (res: IUnitInfo) => void) {
    this.on(WidgetMessageType.SYNC_UNIT_INFO, (res: IResponse<IUnitInfo>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 pageParams 更新消息
   */
  onSyncPageParams(callback: (res: IPageParams) => void) {
    this.on(WidgetMessageType.SYNC_PAGE_PARAMS, (res: IResponse<IPageParams>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 labs 更新消息
   */
  onSyncLabs(callback: (res: ILabs) => void) {
    this.on(WidgetMessageType.SYNC_LABS, (res: IResponse<ILabs>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 share 更新消息
   */
  onSyncShare(callback: (res: IShareInfo) => void) {
    this.on(WidgetMessageType.SYNC_SHARE, (res: IResponse<IShareInfo>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 dashboard 相关数据更新
   * @param callback 
   */
  onSyncDashboard(callback: (dashboard: IWidgetDashboardState) => void) {
    this.on(WidgetMessageType.SYNC_DASHBOARD, (res: IResponse<IWidgetDashboardState>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自主应用的 mirrorMap 更新消息
   */
  onSyncMirrorMap(callback: (res: IMirrorMap) => void) {
    this.on(WidgetMessageType.SYNC_MIRROR, (res: IResponse<IMirrorMap>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 加载其他关联表数据，首次初始化
   */
  loadOtherDatasheetInit(datasheetId: string) {
    this.emit(WidgetMessageType.LOAD_OTHER_DATASHEET_INIT, { success: true, data: datasheetId });
  }

  /**
   * 监听来自其他关联表数据的初始化返回
   */
  onLoadOtherDatasheet(callback: (res: IDatasheetMap) => void) {
    this.on(WidgetMessageType.LOAD_OTHER_DATASHEET_INIT, res => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 监听来自其他关联表数据的更新返回 (除开 snapshot 之外的)
   */
  onDatasheetSimpleUpdate(callback: (res: {[datasheetId: string]: IDatasheetMainSimple}) => void) {
    this.on(WidgetMessageType.LOAD_OTHER_DATASHEET_UPDATE, res => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 触发expandRecord
   */
  expandRecord(expandRecordParams: IExpandRecordProps) {
    this.emit(WidgetMessageType.EXPAND_RECORD, { success: true, data: expandRecordParams });
  }

  /**
   * 鼠标进入和离开小组件 iframe
   */
  mouseListener(type: MouseListenerType) {
    this.emit(WidgetMessageType.MOUSE_EVENT, { success: true, data: type });
  }

  /**
   * 监听来自主应用的缓存更新
   */
  onSyncCalcCache(callback: (res: { datasheetId: string, viewId: string, cache: IViewRow[]}) => void) {
    this.on(WidgetMessageType.CALC_CACHE, res => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }

  /**
   * 初始化缓存
   * @param datasheetId 
   * @param viewId 
   */
  initCache(datasheetId: string, viewId: string) {
    this.emit(WidgetMessageType.CALC_CACHE, { success: true, data: { datasheetId, viewId }});
  }

  /**
   * 展开进入开发者模式弹窗
   */
  expandDevConfig() {
    this.emit(WidgetMessageType.EXPAND_DEV_CONFIG, { success: true });
  }

  /**
   * 发送加载小程序结果
   * @param widgetId 
   * @param devUrl 
   * @param widgetPackageId 
   * @param refresh 
   */
  sendLoadWidget(error?: WidgetLoadError) {
    this.emit(WidgetMessageType.LOAD_WIDGET_RESULT, { success: true, data: error });
  }

  /**
   * 监听加载小程序
   * @param callback 
   */
  onLoadWidget() {
    this.on(WidgetMessageType.LOAD_WIDGET,
      (res: IResponse<{ devUrl: string, widgetPackageId: string, refresh?: boolean }>) => {
        if (res.success && res.data) {
          const { devUrl, widgetPackageId, refresh } = res.data;
          loadWidget(devUrl, widgetPackageId, refresh).then(() => {
            this.sendLoadWidget();
          }).catch(error => this.sendLoadWidget(error));
        }
      }
    );
  }

  /**
   * 标记缓存过期
   * @param callback 
   */
  onCalcExpire(callback: (params: IExpireCalcCachePayload) => void) {
    this.on(WidgetMessageType.CALC_EXPIRE, (res: IResponse<IExpireCalcCachePayload>) => {
      if (res.success && res.data) {
        callback(res.data);
      } else {
        console.log(res.message);
      }
    });
  }

  /**
   * 同步主应用 userInfo 相关数据
   * @param userInfo
   */
  onSyncUserInfo(callback: (res: IUserInfo) => void) {
    this.on(WidgetMessageType.SYNC_USER_INFO, (res: IResponse<IUserInfo>) => {
      if (res.success && res.data) {
        callback(res.data);
        return;
      }
      console.error(res.message);
    });
  }
}

export let widgetMessage: WidgetMessage;

export const initWidgetMessage = (widgetId: string) => {
  if (widgetMessage) {
    console.log('请勿重复初始化 widgetMessage');
    return widgetMessage;
  }
  widgetMessage = new WidgetMessage(widgetId);
  return widgetMessage;
};