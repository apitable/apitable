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

import { Store } from 'redux';
import {
  DateFormat, ICollaborator, IPermissions, IReduxState,
  IViewRow, TimeFormat, WidgetPackageStatus, WidgetReleaseType,
  IOpenFilterInfo
} from 'core';
import { ThemeName } from '@apitable/components';
import { IResourceService } from '../resource/interface';
import { IWidgetState } from './store';

/** Cell row and column unique identifiers uuid */
export interface ICell {
  recordId: string;
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

export interface IWidgetDashboardState {
  collaborators?: ICollaborator[];
  permissions: IPermissions;
}

export type ICalcCache = {[datasheetId: string]: {
  [viewId: string]: { cache: IViewRow[], expire?: boolean }
}};

/**
 * @hidden
 */
export type IWidgetConfigIframe = Pick<IWidgetConfig, 'isShowingSettings' | 'isFullscreen'> & { isDevMode?: boolean };

/**
 * @hidden
 */
export type IWidgetConfigIframePartial = Partial<IWidgetConfigIframe>;

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

/* Widget external configuration information */
export interface IWidgetConfig {
  /* Is the widget being expanded as full screen */
  isFullscreen: boolean;
  /* Whether the widget settings panel is enabled or not */
  isShowingSettings: boolean;

  datasheetId?: string;

  toggleSettings(state?: boolean): void;

  toggleFullscreen(state?: boolean): void;

  expandRecord(props: IExpandRecordProps): void;
}

/**
 * Widget Run Context.
 */
export interface IWidgetContext {
  /** widget ID */
  id: string;
  /** internationalized language configuration */
  locale: string;
  /** system Theme */
  theme: ThemeName;
  /** widgets data source datasheet Store */
  widgetStore: Store<IWidgetState>;
  /** widget runtime environment */
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
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  includeTime: boolean;
}

export type IFormatType = {
  type: 'currency' | 'number' | 'datetime' | 'percent';
  formatting: INumberFormat | ICurrencyFormat | IPercentFormat | IDateTimeFormat;
} | null;

export type INumberBaseFormatType = INumberFormat | ICurrencyFormat | IPercentFormat;

export type IPermissionResult = { acceptable: true } | { acceptable: false, message: string };

export interface IFieldQuery {
  /** Specify which fieldId data to query, explicitly pass undefined to return null data, do not pass this parameter to not filter. */
  ids?: string[] | undefined,
  /** Returns only the fields in the view, set to true will filter the hidden fields in the view by default. */
  visible?: boolean
}

export interface IRecordQuery {
  /** Specify which recordId data to query, explicitly pass undefined to return empty data, do not pass this parameter to not filter. */
  ids?: string[] | undefined,
  /** filter condition */
  filter?: IOpenFilterInfo;
}

export interface IUpdatePropertyError {
  reasonString: string;
}

/**
 * `useExpandRecord()` definition of the parameter type of the returned function.
 * */
export interface IExpandRecord {
  /** 
   * You need to expand the array of records. By default, 
   * the record corresponding to the first recordId in the array will be expanded, 
   * and the other records can be displayed by toggling the up and down buttons. 
   */
  recordIds: string[];
  /**
   * Optional, records will be displayed by default using the column order/hiding in the first view in the datasheet, 
   * pass in and specify the view .
   */
  viewId?: string;
  /** 
   * Optional, by default it will try to expand records from the datasheet associated with the widget, 
   * if you need to expand records from other datasheet, you need to explicitly pass 
   */
  datasheetId?: string;
}

export enum InstallPosition {
  WidgetPanel = 'WidgetPanel',
  Dashboard = 'Dashboard'
}

export enum RuntimeEnv {
  Mobile = 'Mobile',
  Desktop = 'Desktop'
}

export interface IMetaType {
  /** Unique ID of the widget in the runtime environment. */
  id: string;
  /** Widget name. */
  name?: string;
  /** Widget icon. */
  widgetPackageIcon?: string;
  /** Widget release name */
  widgetPackageName?: string;
  /** Widget version */
  widgetPackageVersion?: string;
  /** Widget release ID */
  widgetPackageId?: string;
  /** Author email */
  authorEmail?: string;
  /** Author icon */
  authorIcon?: string;
  /** Author personal website */
  authorLink?: string;
  /** Author name */
  authorName?: string;
  /** Widget release type  */
  releaseType?: WidgetReleaseType;
  /** The running code url of the widget release  */
  releaseCodeBundle?: string;
  /** Widget associated datasheet ID */
  datasheetId?: string;
  /** Widget associated datasheet name */
  datasheetName?: string;
  /** Current status of the widget */
  status?: WidgetPackageStatus;
  /** Unique ID of the widget in the runtime environment */
  widgetId?: string;
  /** Source ID to distinguish whether the widget is bound from a datasheet or a mirror */
  sourceId?: string;
  /** Widget installation location */
  installPosition?: InstallPosition;
  /** Widget installation space */
  spaceId?: string;
  /** System Theme */
  theme: ThemeName
  /** Current operating environment */
  runtimeEnv: RuntimeEnv;
}

/**
 * When adding a new record, specify its position in the view (default is inserted at the end)
 */
export interface IInsertPosition {
  /** ID of the view where the record needs to be inserted */
  viewId: string;
  /** The record ID of the anchor point will be inserted forward or backward based on the bar */
  anchorRecordId: string;
  /** Insert before or after the anchor record */
  position: 'before' | 'after';
}

/**
 * Get the characteristic properties of the field in the view.
 */
export interface IPropertyInView {
  /**
   * Whether the field is hidden in the view
   */
  hidden?: boolean
}

export enum RollUpFuncType {
  /** No operation */
  VALUES = 'VALUES',
  /** Average value */
  AVERAGE = 'AVERAGE',
  /** Non-null value count */
  COUNT = 'COUNT',
  /** Non-null count */
  COUNTA = 'COUNTA',
  /** Full Count */
  COUNTALL = 'COUNTALL',
  /** Find the total */
  SUM = 'SUM',
  /** Minimum value */
  MIN = 'MIN',
  /** Maximum value */
  MAX = 'MAX',
  /** And operation */
  AND = 'AND',
  /** Or operation */
  OR = 'OR',
  /** eXclusive OR operation */
  XOR = 'XOR',
  /** CONCATENATE */
  CONCATENATE = 'CONCATENATE',
  /** Comma Link as text */
  ARRAYJOIN = 'ARRAYJOIN',
  /** Remove duplicates */
  ARRAYUNIQUE = 'ARRAYUNIQUE',
  /** Remove nils */
  ARRAYCOMPACT = 'ARRAYCOMPACT',
}

export enum CollectType {
  AllFields,
  SpecifiedFields,
}

// Permission to manipulate the contents of a datasheet using a hook.
export enum DatasheetOperationPermission {
  AddRecord,
  EditRecord,
  DeleteRecord,
  AddField,
  EditFieldName,
  EditFieldProperty,
  DeleteField
}
