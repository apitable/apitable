import { APIMetaFieldPropertyFormatEnums, APIMetaMemberType, TSymbolAlign } from '../field_api_enums';
import { IFormat } from '../field_api_property_types';
import { BasicValueType, CollectType, IMultiSelectedIds, RollUpFuncType } from '../field_types';

export interface IOpenField {
  /** fieldId */
  id: string;
  /** fieldName */
  name: string;
  /** fieldType string格式 */
  type: string;
  /** 是否是主列 */
  isPrimary?: boolean;
  /** 列描述 */
  description?: string;
  /** 字段配置 */
  property?: IOpenFieldProperty;
  /** 可编辑，字段权限 */
  editable?: boolean;
  /** 神奇表单必填 */
  required?: boolean;
}

export type IOpenFieldProperty = IOpenTextFieldProperty
  | IOpenURLFieldProperty
  | IOpenEmailFieldProperty
  | IOpenPhoneFieldProperty
  | IOpenSingleTextFieldProperty
  | IOpenNumberFieldProperty
  | IOpenCheckboxFieldProperty
  | IOpenRatingFieldProperty
  | IOpenPercentFieldProperty
  | IOpenCurrencyFieldProperty
  | IOpenSingleSelectFieldProperty
  | IOpenMultiSelectFieldProperty
  | IOpenMemberFieldProperty
  | IOpenDateTimeFieldProperty
  | IOpenAttachmentFieldProperty
  | IOpenMagicLinkFieldProperty
  | IOpenMagicLookUpFieldProperty
  | IOpenFormulaFieldProperty
  | IOpenAutoNumberFieldProperty
  | IOpenCreatedTimeFieldProperty
  | IOpenLastModifiedTimeFieldProperty
  | IOpenCreatedByFieldProperty
  | IOpenLastModifiedByFieldProperty;

export interface IOpenSingleTextFieldProperty {
  defaultValue?: string;
}

export type IOpenTextFieldProperty = null;

export type IOpenURLFieldProperty = null;

export type IOpenEmailFieldProperty = null;

export type IOpenPhoneFieldProperty = null;

export interface IOpenNumberFieldProperty {
  defaultValue?: string;
  precision: number;
  symbol?: string;
}

export interface IOpenCheckboxFieldProperty {
  icon: string;
}

export interface IOpenRatingFieldProperty {
  /** 最大值 1 - 10 */
  max: number;
  /** Emoji slug */
  icon: string;
}

export interface IOpenPercentFieldProperty {
  /** 新增记录默认值 */
  defaultValue?: string;
  /** 保留小数位 */
  precision: number;
}

export interface IOpenCurrencyFieldProperty {
  /** 新增记录默认值 */
  defaultValue?: string;
  /** 单位 */
  symbol: string;
  /** 保留小数位 */
  precision: number;
  /** 单位对齐方式 */
  symbolAlign?: TSymbolAlign;
}

export type IOpenSingleSelectFieldProperty = IOpenSelectBaseFieldProperty;

export type IOpenMultiSelectFieldProperty = IOpenSelectBaseFieldProperty;

export interface IOpenSelectBaseFieldProperty {
  defaultValue?: string | IMultiSelectedIds;
  /** 选项配置 */
  options: {
    id: string;
    name: string;
    color: {
      name: string;
      value: string;
    }
  }[]
}

export interface IOpenMemberOption {
  id: string;
  name: string;
  /** 成员类型 */
  type: APIMetaMemberType;
  /** 头像URl */
  avatar?: string;
}

export interface IOpenMemberFieldProperty {
  /** 当前列所有值集合 */
  options: IOpenMemberOption[];
  // 是否允许添加多个成员
  isMulti?: boolean;
  // 是否发送通知
  shouldSendMsg?: boolean;
}

export interface IOpenDateTimeFieldProperty {
  /** 日期格式 */
  dateFormat: string;
  /** 时间格式 */
  timeFormat?: string;
  /** 新增记录时是否自动填入创建时间 */
  autoFill?: boolean;
  /** 是否包含时间 */
  includeTime?: boolean;
}

export type IOpenAttachmentFieldProperty = null;

export interface IOpenMagicLinkFieldProperty {
  /** 关联表ID */
  foreignDatasheetId: string;
  /** 关联表的关联字段ID */
  brotherFieldId?: string;
  /** 指定视图 ID 筛选记录 */
  limitToViewId?: string;
  /** 是否限制只能选择单条记录 */
  limitSingleRecord?: boolean;
}

export interface IOpenComputedFormat {
  type: APIMetaFieldPropertyFormatEnums;
  format: IFormat
}

export interface IOpenMagicLookUpFieldProperty {
  /** 引用的当前表的关联字段 ID */
  relatedLinkFieldId: string;
  /** 关联表中查询的字段 ID */
  targetFieldId: string;
  /** 当神奇引用的依赖的关联字段被删除或者转化类型时，可能无法正常获取引用值 */
  hasError?: boolean;
  /** 最终引用到的实体字段，不包含神奇引用类型的字段。存在错误时，实体字段可能不存在。 */
  entityField?: {
    datasheetId: string; 
    field: IOpenField;
  };
  /** 汇总函数 */
  rollupFunction?: RollUpFuncType;
  /** 返回值类型 */
  valueType?: 'String' | 'Boolean' | 'Number' | 'DateTime' | 'Array';
  /** 格式，由于引用字段有区别，格式也不一样（数字、百分比、日期、货币） */
  format?: IOpenComputedFormat;
}

export interface IOpenFormulaFieldProperty {
  /** 公式表达式 */
  expression: string;
  /** 返回值类型，取值包括 String、Boolean、Number、DateTime、Array */
  valueType: BasicValueType;
  /** 当公式依赖的相关字段被删除或者转化类型时，可能无法正常获取计算值 */
  hasError?: boolean;
  /** 格式，由于引用字段有区别，格式也不一样（数字、百分比、日期、货币） */
  format?: IOpenComputedFormat;
}

export type IOpenAutoNumberFieldProperty = null;

export type IOpenCreatedTimeFieldProperty = Omit<IOpenDateTimeFieldProperty, 'autoFill'>;
export interface IOpenLastModifiedTimeFieldProperty {
  /** 日期格式 */
  dateFormat: string;
  /** 时间格式 */
  timeFormat: string;
  /** 是否包含时间 */
  includeTime: boolean;
  /** 指定字段类型：0 所有可编辑，1 指定字段 */
  collectType: CollectType;
  /** 是否指定字段，数组类型可指定多个字段，不填为所有 */
  fieldIdCollection?: string[];
}

export type IOpenCreatedByFieldProperty = null;

export interface IOpenLastModifiedByFieldProperty {
  /** 指定字段类型：0 所有可编辑，1 指定字段 */
  collectType: CollectType;
  /** 是否指定字段，数组类型可指定多个字段，不填为所有 */
  fieldIdCollection?: string[];
}
