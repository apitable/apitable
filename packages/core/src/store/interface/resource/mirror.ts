import { ICollaborator, IDashboard, INodeMeta, ISourceDatasheetInfo, ITemporaryView, IWidgetPanel, IWidgetPanelStatus } from 'store';
import * as ActionConstants from 'store/action_constants';
import * as actions from 'store/action_constants';

/**
 * server-side data struct
 */
export interface IServerMirror {
  mirror: INodeMeta;
  sourceInfo: ISourceDatasheetInfo;
}

export interface IMirrorMap {
  [mirrorId: string]: IMirrorPack;
}

export interface IMirrorPack {
  /**
   * whether the data is under collaboration
   */
  syncing: boolean; 
  /**
   * whether or not the data is loading
   */
  loading: boolean; 

  /**
   * a mark to indicate collaboration status
   */
  connected: boolean; 

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
  // widget panels and widgets
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
