import { RECEIVE_INSTALLATIONS_WIDGET, RESET_WIDGET } from '../../action_constants';

export interface IWidgetSnapshot {
  widgetName: string;
  datasheetId?: string;
  sourceId?: string;
  storage: {
    [key: string]: any
  };
}

export enum WidgetPackageType {
  Custom = 0,
  Official = 1,
}

export enum WidgetReleaseType {
  /** 空间站自建 */
  Space = 0,
  /** 官方推荐 */
  Global = 1,
  /** 审核预览 */
  Preview = 10
}

export enum WidgetPackageStatus {
  /** 开发中 */
  Developing = 0,
  /** 封禁中 */
  Ban = 1,
  /** 已发布 */
  Published = 3,
  /** 已下架 */
  Unpublished = 4,
}

export interface IWidgetPackage {
  widgetPackageId: string;
  authorEmail: string;
  authorIcon: string;
  authorLink: string;
  authorName: string;
  packageType: WidgetPackageType;
  releaseType: WidgetReleaseType;
  status: WidgetPackageStatus;
  cover: string;
  description: string;
  icon: string;
  name: string;
  version: string;
  ownerUuid: string;
  isEmpower: boolean;
  ownerMemberId: string;
  extras: {[key: string]: any};
  installEnv?: WidgetInstallEnv[];
  runtimeEnv?: WidgetRuntimeEnv[];
}

export enum WidgetInstallEnv {
  Dashboard = 'dashboard',
  Panel = 'panel'
}

export enum WidgetRuntimeEnv {
  Mobile = 'mobile',
  Desktop = 'desktop'
}

export interface IWidget {
  id: string;
  revision: number;
  authorEmail: string;
  authorIcon: string;
  authorLink: string;
  authorName: string;
  packageType: WidgetPackageType;
  releaseType: WidgetReleaseType;
  status: WidgetPackageStatus;
  releaseCodeBundle: string;
  widgetPackageId: string;
  widgetPackageName: string;
  widgetPackageIcon: string;
  widgetPackageVersion: string;
  fatherWidgetPackageId?: string;
  sandbox: boolean;
  snapshot: IWidgetSnapshot;
  installEnv?: WidgetInstallEnv[];
  runtimeEnv?: WidgetRuntimeEnv[];
}

export interface IWidgetPack {
  loading: boolean;
  syncing: boolean;
  connected: boolean;
  widget: IWidget;
  errorCode?: number | null;
}

export type IWidgetMap = { [widgetId: string]: IWidgetPack };

export interface IUnMountWidget {
  type: typeof RESET_WIDGET,
  payload: string[];
  widgetId?: string;
}

export interface IReadInstallationsWidget {
  type: typeof RECEIVE_INSTALLATIONS_WIDGET,
  payload: IWidget;
  widgetId?: string;
}
