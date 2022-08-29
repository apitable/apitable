import { ICollaborator, IDashboard, INodeMeta, ISourceDatasheetInfo, ITemporaryView, IWidgetPanel, IWidgetPanelStatus } from 'store';
import * as ActionConstants from 'store/action_constants';
import * as actions from 'store/action_constants';

// 服务端数据结构
export interface IServerMirror {
  mirror: INodeMeta;
  sourceInfo: ISourceDatasheetInfo;
}

export interface IMirrorMap {
  [mirrorId: string]: IMirrorPack;
}

export interface IMirrorPack {
  syncing: boolean; // 标记数据是否在协同中
  loading: boolean; // 数据是否在加载中
  connected: boolean; // 标记协同状态
  mirror?: IMirror | null;
  errorCode?: number | null;
  client: IMirrorClient;
}

export interface IMirror extends INodeMeta {
  sourceInfo: ISourceDatasheetInfo;
  temporaryView?: ITemporaryView;
  snapshot: IMirrorSnapshot;
}

export interface IMirrorSnapshot {
  // 组件面板和小组件
  widgetPanels?: IWidgetPanel[];
}

export interface IUpdateMirrorInfo {
  type: typeof ActionConstants.UPDATE_DASHBOARD_INFO;
  dashboardId: string,
  payload: Partial<IDashboard>,
}

export interface IMirrorClient {
  collaborators?: ICollaborator[];
  widgetPanelStatus: IWidgetPanelStatus;
}

export interface ICacheTemporaryView {
  type: typeof actions.CACHE_TEMPORARY_VIEW;
  payload: ITemporaryView;
  mirrorId: string;
}
