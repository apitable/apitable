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
  type: string;
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