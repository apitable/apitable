import { CellFormatEnum, ICellValue, IFieldMap, IRecord, IRecordMap, IReduxState, ISnapshot, ISortedField, IViewColumn, IViewRow } from '@apitable/core';
import { Store } from 'redux';

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

/**
 * Record transform options for Fusion API
 * @author Zoe zheng
 * @date 2020/9/8 5:36 PM
 */
export interface IRecordsTransformOptions {
  rows: IViewRow[];
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  store: Store<IReduxState>;
}

export interface IRecordTransformOptions {
  fieldMap: IFieldMap;
  store: Store<IReduxState>;
  recordMap: IRecordMap;
  fieldKeys: string[];
  columnMap: Record<string, IViewColumn>;
}

export interface IViewInfoOptions {
  partialRecordsInDst: boolean,
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
   * array of recordIds
   */
  recordIds?: string[];
  /**
   * related datasheet record map
   */
  linkedRecordMap?: ILinkedRecordMap;
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
  /**
   * record IDs
   */
  recordIds?: string[];
}

export interface INodeExtra {
  showRecordHistory: boolean;
}
