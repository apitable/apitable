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

import type { CellFormatEnum, ICellValue, IFieldMap, IMeta, IRecord, IRecordMap, IReduxState, ISnapshot, ISortedField } from '@apitable/core';
import type { Store } from 'redux';
import type { IBaseException } from 'shared/exception/base.exception';

export interface IApiRecord {
  recordId: string;
  fields: IFieldValueMap;
  createdAt: number;
}

export interface IApiDatasheetField {
  id: string;
  name: string;
  type: string;
  desc?: string;
  property?: Object;
  permissionLevel?: string;
}

export interface IApiDatasheetView {
  id: string;
  name: string;
  type: string;
}

/**
 * Field Properties
 * @author Zoe zheng
 * @date 2020/7/31 2:53 PM
 */
export type IFieldValueBase = number | string | boolean | { [key: string]: any };
/**
 * Array of field properties
 * @author Zoe zheng
 * @date 2020/7/31 3:00 PM
 */
export type IFieldValue = IFieldValueBase | IFieldValueBase[] | null;

/**
 * Map of filed values
 * @author Zoe zheng
 * @date 2020/7/31 2:54 PM
 */
export interface IFieldValueMap {
  [field: string]: IFieldValue;
}

export interface IFieldVoTransformOptions {
  /**
   * datasheet field name properties
   */
  fieldMap?: IFieldMap;
  /**
   * single record, works for formula fields
   */
  record?: IRecord;
  /**
   * related datasheet's records
   */
  foreignSheetMap?: IDatasheetDataMap;
  /**
   * formatting type enum
   */
  cellFormat: CellFormatEnum;

  store?: Store<IReduxState>;
}

export interface ICellValueMap {
  [fieldId: string]: ICellValue;
}

/**
 * Datasheet data map
 * @author Zoe zheng
 * @date 2020/8/21 1:48 PM
 */
export interface IDatasheetDataMap {
  [dstId: string]: IRecordMap;
}

export interface IViewInfoOptions {
  recordIds?: string[];
  viewId?: string;
  sortRules: ISortedField[];
  snapshot: ISnapshot;
  state: IReduxState;
}

export interface IFieldRoTransformOptions {
  fieldMap?: IFieldMap;
  spaceId?: string;
}

export interface INodeShareProps {
  onlyRead?: boolean;
  canBeEdited?: boolean;
  canBeStored?: boolean;
}

/**
 * related datasheet recordIds
 */
export interface ILinkedRecordMap {
  [dstId: string]: string[];
}

/**
 * options of fetching data
 */
export interface IFetchDataOptions {
  /**
   * array of recordIds. The returned data pack may contain more records if needExtendMainDstRecords is true.
   */
  recordIds?: string[];
  /**
   * related datasheet record map
   */
  linkedRecordMap?: ILinkedRecordMap;
  /**
   * datasheet meta
   */
  meta?: IMeta;

  /**
   * The records specified by recordIds may require extra main datasheet records to render themselves,
   * if this field is set to true, these extra records will be included in the returned data pack in adition to
   * records specified by recordIds.
   */
  needExtendMainDstRecords?: boolean;

  /** If comment count is queried. Default to false */
  includeCommentCount?: boolean;

  /**  Default to false */
  includeArchivedRecords?: boolean;
}

export interface IFetchDataPackOptions extends IFetchDataOptions {
  isTemplate?: boolean;
  metadataException?: IBaseException;
  /**
   * If true, the returned `resourceIds` will contain foreign datasheet IDs and widget IDs. Otherwise,
   * `resourceIds` will contain the datasheet ID and foreign datasheet IDs.
   */
  isDatasheet?: boolean;
}

/**
 * origin options of fetching data
 */
export interface IFetchDataOriginOptions {
  /**
   * internal flag
   */
  internal: boolean;
  /**
   * main datasheet flag
   */
  main?: boolean;
  /**
   * shared ID
   */
  shareId?: string;
  /**
   * not a datasheet
   */
  notDst?: boolean;
  /**
   * form flag
   */
  form?: boolean;
}

export interface INodeExtra {
  showRecordHistory: boolean;
}

export interface ILoadBasePackOptions {
  /** if all linked datasheet is included. Default to true */
  includeLink?: boolean;

  /** If comment count is queried. Default to false */
  includeCommentCount?: boolean;

  /** If deleted flag is ignoerd. Default to false */
  ignoreDeleted?: boolean;

  /** If load record metadata. Default to false */
  loadRecordMeta?: boolean;

  filterViewFilterInfo?: boolean;
}
