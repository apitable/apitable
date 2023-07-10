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

import { IWidget } from 'modules/database/store/interfaces/resource/widget';
import * as ActionConstants from '../../../../shared/store/action_constants';
import { ICollaborator, INodeMeta } from './datasheet';

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

export type IDashboardWidgetMap = { [widgetId: string]: IWidget };

export interface IServerDashboardPack {
  dashboard: IDashboard;
  widgetMap: IDashboardWidgetMap;
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
