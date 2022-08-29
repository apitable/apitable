import { ICollaborator, INodeMeta } from './datasheet';
import * as ActionConstants from '../../action_constants';

// 支持储存多个 dashboard 的状态
export interface IDashboardMap {
  [dashboardId: string]: IDashboardPack;
}

export interface IDashboardPack {
  syncing: boolean; // 标记数据是否在协同中
  loading: boolean; // 数据是否在加载中
  connected: boolean; // 标记协同状态
  dashboard?: IDashboard | null;
  errorCode?: number | null;
  client: IDashboardClient;
}

// INodeMeta 见下面的 code
export interface IDashboard extends INodeMeta {
  snapshot: IDashboardSnapshot;
}

export interface IDashboardClient {
  isFullScreen: boolean;
  showRecommendPanel: boolean; // 是否展示底部的推荐面板
  collaborators?: ICollaborator[];
}

export interface IDashboardSnapshot {
  widgetInstallations: {
    layout?: IDashboardLayout[];
    installWidgetIds?: string[];
  };
}

export interface IDashboardLayout {
  id: string;
  row: number;
  column: number;
  widthInColumns: number;
  heightInRoes: number;
}

export interface IUpdateDashboardInfo {
  type: typeof ActionConstants.UPDATE_DASHBOARD_INFO;
  dashboardId: string,
  payload: Partial<IDashboard>,
}
