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

import * as actions from '../action_constants';

export interface IEmbedInfo {
  viewControl?: {
    viewId?: string,
    tabBar?: boolean,
    titleBar?: boolean,
    nodeInfoBar?: boolean;
    collaboratorStatusBar?: boolean;
    toolBar: {
      shareBtn?: boolean,
      widgetBtn?: boolean,
      apiBtn?: boolean,
      formBtn?: boolean,
      historyBtn?: boolean,
      robotBtn?: boolean,
      addWidgetBtn?: boolean;
      fullScreenBtn?: boolean;
      formSettingBtn?: boolean;
    },
  },
  primarySideBar?: boolean,
  bannerLogo?: boolean,
  spaceId?: string
  permissionType?: PermissionType,
  isShowEmbedToolBar?: boolean,
  viewManualSave?: boolean
}

export enum PermissionType {
  READONLY = 'readOnly',
  PUBLICEDIT = 'publicEdit',
  PRIVATEEDIT = 'privateEdit'
}

export interface IEmbedInfoAction {
  type: typeof actions.SET_EMBED_INFO;
  payload: IEmbedInfo;
}
