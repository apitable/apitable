import { Store } from 'redux';
import {
  DateFormat, ICollaborator, IFieldPermissionMap, ILabs, IPageParams, IPermissions, IReduxState, ISelection, IShareInfo, ISnapshot, IUnitInfo,
  IViewRow, IWidget, TimeFormat, WidgetPackageStatus, WidgetReleaseType, IMirrorMap, IActiveRowInfo, IUserInfo
} from 'core';
import { ThemeName } from '@vikadata/components';
import { IResourceService } from '../resource/interface';

/** 单元格行、列唯一标识符 uuid */
export interface ICell {
  /** 单元格行唯一标识符 uuid */
  recordId: string;
  /** 单元格列唯一标识符 uuid */
  fieldId: string;
}

export {
  BasicValueType, StatType, IFieldMap, DateFormat, TimeFormat, SymbolAlign,
  IField, IDateTimeFieldProperty, Conversion, IEffectOption
} from 'core';

export enum WidgetType {
  Chart = 'chart',
  Summary = 'summary',
}

export enum WidgetMountType {
  Part = 'part',
  Full = 'Full',
}

/** Plain Array */
export type ICloudStorageArray = ReadonlyArray<ICloudStorageValue>;

/** Plain Object */
export interface ICloudStorageObject {
  readonly [key: string]: ICloudStorageValue | undefined;
}

/** The types of value that can be stored in CloudStorage. */
export declare type ICloudStorageValue = null | boolean | number | string | ICloudStorageArray | ICloudStorageObject;

export type ICloudStorageData = Record<string, ICloudStorageValue> | null;

export interface IDatasheetClient {
  collaborators: ICollaborator[] | undefined;
  selection?: ISelection | null;
  activeRowInfo?: IActiveRowInfo;
}

export type IDatasheetMainSimple = Partial<Omit<IDatasheetMain, 'snapshot'>>;

export interface IDatasheetMain {
  id: string;
  datasheetId: string;
  datasheetName: string;
  permissions: IPermissions;
  snapshot: ISnapshot;
  fieldPermissionMap?: IFieldPermissionMap,
  activeView?: string;
  isPartOfData?: boolean;
}

export type IWidgetDatasheetState = {
  connected?: boolean;
  datasheet: IDatasheetMain;
  client: IDatasheetClient
};

export type IDatasheetMap = { [key: string]: IWidgetDatasheetState | null };

export interface IWidgetDashboardState {
  collaborators?: ICollaborator[];
  permissions: IPermissions;
}

export type ICalcCache = {[datasheetId: string]: {
  [viewId: string]: { cache: IViewRow[], expire?: boolean }
}};

export interface IWidgetState {
  widget: IWidget | null;
  errorCode: number | null;
  datasheetMap: IDatasheetMap;
  dashboard: IWidgetDashboardState | null;
  unitInfo: IUnitInfo | null;
  widgetConfig: IWidgetConfigIframe;
  pageParams?: IPageParams,
  labs: ILabs;
  share: IShareInfo;
  // 计算缓存数据
  calcCache?: ICalcCache;
  mirrorMap?: IMirrorMap;
  user: IUserInfo | null;
}

/**
 * @hidden
 */
export type IWidgetConfigIframe = Pick<IWidgetConfig, 'isShowingSettings' | 'isFullscreen'> & { isDevMode?: boolean };

/**
 * @hidden
 */
export interface IGlobalContext {
  resourceService: IResourceService;
  globalStore: Store<IReduxState>;
  unSubscribe: () => void;
}

export interface IExpandRecordProps {
  recordIds: string[];
  datasheetId: string;
  activeRecordId: string;
  viewId?: string;
  onClose?: () => void;
}

/* 小程序外部配置信息 */
export interface IWidgetConfig {
  /* 小程序挂载时唯一 ID（同一个小程序被多次 mount 时 mountId 不相同，update 时 mountId 不变)*/
  mountId: string;
  /* 小程序是否被展开 */
  isFullscreen: boolean;
  /* 小程序设置面板是否被开启 */
  isShowingSettings: boolean;

  datasheetId?: string;

  toggleSettings(state?: boolean);

  toggleFullscreen(state?: boolean);

  expandRecord(props: IExpandRecordProps);
}

/**
 * 数表和小程序之间的通信桥梁。
 *
 * 通过 bind 方法实现数表调用小程序函数。
 *
 * 通过 caller 方法实现小程序调用数表函数
 */
export interface IWidgetContext {
  /** 小程序 ID */
  id: string;
  /** 国际化语言配置 */
  locale: string;
  /** 系统主题 */
  theme: ThemeName;
  /** 小程序数据服务 */
  resourceService: IResourceService;
  /** 数表 Store */
  globalStore: Store<IReduxState>;
  /** 小组件数据源表 Store */
  widgetStore: Store<IWidgetState>;
  /** 运行环境 */
  runtimeEnv?: RuntimeEnv
}

export interface ICurrencyFormat {
  precision: number;
  symbol: string;
}

export interface IPercentFormat {
  precision: number;
}

export interface INumberFormat {
  precision: number;
  commaStyle?: string;
}

export interface IDateTimeFormat {
  // 日期格式
  dateFormat: DateFormat;
  // 时间格式
  timeFormat: TimeFormat;
  // 是否包含时间
  includeTime: boolean;
}

export type IFormatType = {
  type: 'currency' | 'number' | 'datetime' | 'percent';
  formatting: INumberFormat | ICurrencyFormat | IPercentFormat | IDateTimeFormat;
} | null;

export type INumberBaseFormatType = INumberFormat | ICurrencyFormat | IPercentFormat;

export type IPermissionResult = { acceptable: true } | { acceptable: false, message: string };

export interface IFieldQuery {
  /** 指定查询哪些 fieldId 数据, 显式传入 undefined 返回空数据，不传入此参数则不进行过滤 */
  ids?: string[] | undefined,
  /** 仅返回视图中字段，设置为true会默认过滤视图中隐藏字段 */
  visible?: boolean
}

export interface IRecordQuery {
  /** 指定查询哪些 recordId 数据, 显式传入 undefined 返回空数据，不传入此参数则不进行过滤 */
  ids?: string[] | undefined,
}

export interface IUpdatePropertyError {
  reasonString: string;
}

/**
 * `useExpandRecord()` 返回的函数的参数类型定义
 * */
export interface IExpandRecord {
  /** 需要展开记录的数组，默认数组中第一个 recordId 所对应的记录将会被展开，其他的记录可以通过上下按钮切换展示 */
  recordIds: string[];
  /** 可选，记录默认会使用表格中第一个视图中的的列顺序/隐藏情况进行展示，传入后可以指定视图 */
  viewId?: string;
  /** 可选，默认会从小程序关联的表格中尝试展开记录，如果需要展开其他表格的记录，则需要显式传入 */
  datasheetId?: string;
}

export enum InstallPosition {
  /** 小程序面板 */
  WidgetPanel = 'WidgetPanel',
  /** 仪表盘 */
  Dashboard = 'Dashboard'
}

export enum RuntimeEnv {
  /** 移动端 */
  Mobile = 'Mobile',
  /** 桌面端 */
  Desktop = 'Desktop'
}

export interface IMetaType {
  /** 小程序在运行环境中唯一ID */
  id: string;
  /** 小程序名称 */
  name?: string;
  /** 小程序图标 */
  widgetPackageIcon?: string;
  /** 小程序发布名称 */
  widgetPackageName?: string;
  /** 小程序线上最新版本号 */
  widgetPackageVersion?: string;
  /** 小程序发布ID */
  widgetPackageId?: string;
  /** 作者邮箱 */
  authorEmail?: string;
  /** 作者头像 */
  authorIcon?: string;
  /** 作者主页 */
  authorLink?: string;
  /** 作者名称 */
  authorName?: string;
  /** 小程序类型  */
  releaseType?: WidgetReleaseType;
  /** 小程序发布代码地址 */
  releaseCodeBundle?: string;
  /** 小程序关联维格表ID */
  datasheetId?: string;
  /** 小程序关联维格表名称 */
  datasheetName?: string;
  /** 小程序当前状态 */
  status?: WidgetPackageStatus;
  /** 小程序在运行环境中唯一ID */
  widgetId?: string;
  /** 来源ID，区分小程序绑定自维格表还是镜像 */
  sourceId?: string;
  /** 小程序安装位置 */
  installPosition?: InstallPosition;
  /** 小程序运行空间站 */
  spaceId?: string;
  /** 系统主题 */
  theme: ThemeName
  /** 当前运行环境 */
  runtimeEnv: RuntimeEnv;
}

/**
 * 新增记录时，指定它在视图中的位置（默认在最后插入）
 */
export interface IInsertPosition {
  /** 需要插入记录的视图ID */
  viewId: string;
  /** 锚点的记录 ID，将以条记录为基准向前或者向后插入 */
  anchorRecordId: string;
  /** 插入到锚点记录前还是后 */
  position: 'before' | 'after';
}

/**
 * 获取字段在视图中的特征属性
 */
export interface IPropertyInView {
  /**
   * 是否隐藏
   */
  hidden?: boolean
}

export enum RollUpFuncType {
  /** 原样引用 */
  VALUES = 'VALUES',
  /** 平均值 */
  AVERAGE = 'AVERAGE',
  /** 非空数值计数 */
  COUNT = 'COUNT',
  /** 非空值计数 */
  COUNTA = 'COUNTA',
  /** 全计数 */
  COUNTALL = 'COUNTALL',
  /** 总和 */
  SUM = 'SUM',
  /** 最小值 */
  MIN = 'MIN',
  /** 最大值 */
  MAX = 'MAX',
  /** 和运算 */
  AND = 'AND',
  /** 或运算 */
  OR = 'OR',
  /** 异或运算 */
  XOR = 'XOR',
  /** 连接成文本 */
  CONCATENATE = 'CONCATENATE',
  /** 逗号连接 */
  ARRAYJOIN = 'ARRAYJOIN',
  /** 去重 */
  ARRAYUNIQUE = 'ARRAYUNIQUE',
  /** 过滤所有空值 */
  ARRAYCOMPACT = 'ARRAYCOMPACT',
}

export enum CollectType {
  /** 所有字段 */
  AllFields,
  /** 指定字段 */
  SpecifiedFields,
}