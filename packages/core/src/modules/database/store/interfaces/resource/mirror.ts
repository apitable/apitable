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

import { ICollaborator, IDashboard, INodeMeta, ISourceDatasheetInfo, ITemporaryView, IWidgetPanel, IWidgetPanelStatus } from 'exports/store/interfaces';
import * as ActionConstants from '../../../../shared/store/action_constants';
import * as actions from '../../../../shared/store/action_constants';

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
