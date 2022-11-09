import { ICollaborator, INodeMeta } from './datasheet';
import * as ActionConstants from '../../../../shared/store/action_constants';

// support store multi states of dashboard
export interface IDashboardMap {
  [dashboardId: string]: IDashboardPack;
}

export interface IDashboardPack {
  /**
   * whether the data is under collaboration
   */
  syncing: boolean; 
  /**
   * whether the data is under loading
   */
  loading: boolean; 
  /**
   * whether the dashboard is connected
   * 
   * see also the IDatasheetPack's comments
   */
  connected: boolean; 
  dashboard?: IDashboard | null;
  errorCode?: number | null;
  client: IDashboardClient;
}

// INodeMeta see code below
export interface IDashboard extends INodeMeta {
  snapshot: IDashboardSnapshot;
}

export interface IDashboardClient {
  isFullScreen: boolean;
  showRecommendPanel: boolean; // whether or not to show the recommended panel below
  collaborators?: ICollaborator[];
}

export interface IDashboardSnapshot {
  widgetInstallations: {
    layout?: IDashboardLayout[];
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
  dashboardId: string;
  payload: Partial<IDashboard>;
}
