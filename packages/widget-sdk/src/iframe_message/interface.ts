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
  IDatasheetMap, IWidget, IDashboardPack, IOperation, IUnitInfo, ResourceType, ILabs, IPageParams, IShareInfo, IMirrorMap, IUserInfo
} from 'core';
import { IWidgetConfigIframe } from 'interface';

export interface IConnectResponse {
  contentWindow: IContentWindow;
}

export interface IInitResponse {
  datasheetMap: IDatasheetMap;
  widget: IWidget;
  unitInfo: IUnitInfo;
  dashboard?: IDashboardPack;
  widgetConfig: IWidgetConfigIframe;
  labs: ILabs;
  pageParams: IPageParams;
  share: IShareInfo;
  mirrorMap?: IMirrorMap;
  user: IUserInfo | null;
}

export interface ISyncOperations {
  operations: IOperation[];
  resourceType: ResourceType;
  resourceId: string
}

export interface IConnectResponse {
  widgetId: string;
  origin: string;
}

export enum WidgetMessageType {
  CONNECT_IFRAME = 'CONNECT_IFRAME',
  INIT_WIDGET = 'INIT_WIDGET',
  SYNC_OPERATIONS = 'SYNC_OPERATIONS',
  SYNC_WIDGET_CONFIG = 'SYNC_WIDGET_CONFIG',
  WIDGET_CONNECT = 'WIDGET_CONNECT',
  REFRESH_WIDGET = 'REFRESH_WIDGET',
  SYNC_COMMAND = 'SYNC_COMMAND',
  SYNC_COMMAND_RESULT = 'SYNC_COMMAND_RESULT',
  SYNC_DATASHEET_CLIENT = 'SYNC_DATASHEET_CLIENT',
  SYNC_UNIT_INFO = 'SYNC_UNIT_INFO',
  SYNC_PAGE_PARAMS = 'SYNC_PAGE_PARAMS',
  SYNC_LABS = 'SYNC_LABS',
  SYNC_SHARE = 'SYNC_SHARE',
  SYNC_DASHBOARD = 'SYNC_DASHBOARD',
  LOAD_OTHER_DATASHEET_UPDATE = 'LOAD_OTHER_DATASHEET_UPDATE',
  LOAD_OTHER_DATASHEET_INIT = 'LOAD_OTHER_DATASHEET_INIT',
  EXPAND_RECORD = 'EXPAND_RECORD',
  MOUSE_EVENT = 'MOUSE_EVENT',
  CALC_CACHE = 'CALC_CACHE',
  SYNC_MIRROR = 'SYNC_MIRROR',
  REMOVE_CACHE = 'REMOVE_CACHE',
  REFRESH_SNAPSHOT = 'REFRESH_SNAPSHOT',
  EXPAND_DEV_CONFIG = 'EXPAND_DEV_CONFIG',
  LOAD_WIDGET = 'LOAD_WIDGET',
  LOAD_WIDGET_RESULT = 'LOAD_WIDGET_RESULT',
  CALC_EXPIRE = 'CALC_EXPIRE',
  SYNC_USER_INFO = 'SYNC_USER_INFO'
}

export interface IMessage {
  type: WidgetMessageType;
  response: IResponse;
  targetId?: string;
}

export interface IResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface IContentWindow {
  window: Window;
  origin: string;
}

export enum MouseListenerType {
  ENTER = 'mouseenter',
  LEAVE = 'mouseleave'
}