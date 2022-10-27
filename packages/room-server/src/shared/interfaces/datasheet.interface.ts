import { CellFormatEnum, ICellValue, IFieldMap, IRecord, IRecordMap, IViewColumn, IViewRow } from '@apitable/core';

export interface IApiRecord {
  recordId: string;
  fields: IFieldValueMap;
  createdAt: number;
}

export interface IApiDatasheetField {
  id: string;
  name: string;
  type: string;
  desc?: string
  property?: Object
  permissionLevel?: string
}

export interface IApiDatasheetView {
  id: string;
  name: string;
  type: string;
}

/**
 * <p>
 * 字段属性定义
 * </p>
 * @author Zoe zheng
 * @date 2020/7/31 2:53 下午
 */
export type IFieldValueBase = number | string | boolean | { [key: string]: any };
/**
 * <p>
 * 字段属性定义的数组
 * </p>
 * @author Zoe zheng
 * @date 2020/7/31 3:00 下午
 */
export type IFieldValue = IFieldValueBase | IFieldValueBase[] | null;

/**
 * <p>
 * 字段值的集合
 * </p>
 * @author Zoe zheng
 * @date 2020/7/31 2:54 下午
 */
export interface IFieldValueMap {
  [field: string]: IFieldValue;
}

export interface IFieldVoTransformOptions {
  /**
   * 数表字段属性
   */
  fieldMap?: IFieldMap;
  /**
   * 单条记录，主要用于公式字段
   */
  record?: IRecord;
  /**
   * 关联表的records
   */
  foreignSheetMap?: IDatasheetDataMap;
  /**
   * 格式化方式
   */
  cellFormat: CellFormatEnum;

  store?: any;
}

export interface ICellValueMap {
  [fieldId: string]: ICellValue;
}

/**
 * <p>
 * datasheet中的data map
 * </p>
 * @author Zoe zheng
 * @date 2020/8/21 1:48 下午
 */
export interface IDatasheetDataMap {
  [dstId: string]: IRecordMap;
}

/**
 * <p>
 * record fusionAPI转换需要的条件
 * </p>
 * @author Zoe zheng
 * @date 2020/9/8 5:36 下午
 */
export interface IRecordsTransformOptions {
  rows: IViewRow[];
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  store: any;
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
 * 关联表记录ID
 */
export interface ILinkedRecordMap {
  [dstId: string]: string[];
}

/**
 * fetchData的参数选项
 */
export interface IFetchDataOptions {
  /**
   * 记录ID数组
   */
  recordIds?: string[];
  /**
   * 关联表记录map
   */
  linkedRecordMap?: ILinkedRecordMap;
}

/**
 * fetchDataOrigin的参数选项
 */
export interface IFetchDataOriginOptions {
  /**
   * 内部标志
   */
  internal: boolean;
  /**
   * 主表标志
   */
  main?: boolean;
  /**
   * 分享ID
   */
  shareId?: string;
  /**
   * 非数表标记
   */
  notDst?: boolean;
  /**
   * 神奇表单标记
   */
  form?: boolean;
  /**
   * 记录ID数组
   */
  recordIds?: string[];
}

export interface INodeExtra {
  showRecordHistory: boolean
}
