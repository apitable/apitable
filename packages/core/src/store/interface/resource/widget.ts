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
  /**
   * space self-created
   */
  Space = 0,
  /**
   * official recommend
   */
  Global = 1,
  /**
   * censorship preview
   */
  Preview = 10
}

export enum WidgetPackageStatus {
  /**
   * under development
   */
  Developing = 0,
  /**
   * Banned(forbidden)
   */
  Ban = 1,
  /**
   * Published
   */
  Published = 3,
  /**
   * Unpublished(down)
   */
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
