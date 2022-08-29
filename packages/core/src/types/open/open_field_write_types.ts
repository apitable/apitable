import {
  IOpenCheckboxFieldProperty, IOpenComputedFormat, IOpenCreatedTimeFieldProperty, IOpenCurrencyFieldProperty,
  IOpenDateTimeFieldProperty,
  IOpenField, IOpenNumberFieldProperty, IOpenPercentFieldProperty,
  IOpenRatingFieldProperty, IOpenSingleTextFieldProperty
} from './open_field_read_types';
import { CollectType, IMultiSelectedIds, RollUpFuncType } from '../field_types';

export enum Conversion {
  /** 删除关联表的关联字段 */
  Delete = 'delete',
  /** 保留关联表的关联字段，并转换成文本类型 */
  KeepText = 'keepText'
}

/**
 * 更新字段的副作用
 */
export interface IEffectOption {
  /**
   * 是否允许删除 options
   */
  enableSelectOptionDelete?: boolean
}
 
export interface IAddOpenField extends Omit<IOpenField, 'isPrimary' | 'id' | 'property'> {
  property: IAddOpenFieldProperty
}

export interface IUpdateOpenField extends Omit<IOpenField, 'isPrimary' | 'id' | 'property'> {
  property: IUpdateOpenFieldProperty
}

export interface IWriteOpenSelectBaseFieldProperty {
  defaultValue?: string | IMultiSelectedIds;
  /** 选项配置 */
  options: {
    id?: string;
    name: string;
    /** color name */
    color?: string;
  }[]
}

export type IAddOpenTextFieldProperty = null;

export type IAddOpenURLFieldProperty = null;

export type IAddOpenEmailFieldProperty = null;

export type IAddOpenPhoneFieldProperty = null;

export type IAddOpenSingleTextFieldProperty = IOpenSingleTextFieldProperty;

export type IAddOpenNumberFieldProperty = IOpenNumberFieldProperty;

export type IAddOpenCheckboxFieldProperty = IOpenCheckboxFieldProperty;

export type IAddOpenRatingFieldProperty = IOpenRatingFieldProperty;

export type IAddOpenPercentFieldProperty = IOpenPercentFieldProperty;

export type IAddOpenCurrencyFieldProperty = IOpenCurrencyFieldProperty;

export type IAddOpenSingleSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;

export type IAddOpenMultiSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;

export interface IAddOpenMemberFieldProperty {
  /* 是否允许添加多个成员 **/
  isMulti?: boolean;
  /** 是否发送通知 */
  shouldSendMsg?: boolean;
}

export type IAddOpenDateTimeFieldProperty = IOpenDateTimeFieldProperty;

export type IAddOpenAttachmentFieldProperty = null;

export interface IAddOpenMagicLinkFieldProperty {
  /** 关联表ID，切换关联表，之前的brotherField会转成文本字段 */
  foreignDatasheetId: string;
  /** 指定视图 ID 筛选记录 */
  limitToViewId?: string;
  /** 是否限制只能选择单条记录 */
  limitSingleRecord?: boolean;
}

export interface IAddOpenMagicLookUpFieldProperty {
  /** 引用的当前表的关联字段 ID */
  relatedLinkFieldId: string;
  /** 关联表中查询的字段 ID */
  targetFieldId: string;
  /** 汇总函数 */
  rollupFunction?: RollUpFuncType;
  /** 格式，由于引用字段有区别，格式也不一样（数字、百分比、日期、货币） */
  format?: IOpenComputedFormat;
}

export interface IAddOpenFormulaFieldProperty {
  /** 公式表达式 */
  expression?: string;
  /** 当公式依赖的相关字段被删除或者转化类型时，可能无法正常获取计算值 */
  format?: IOpenComputedFormat;
}

export type IAddOpenAutoNumberFieldProperty = null;

export type IAddOpenCreatedTimeFieldProperty = IOpenCreatedTimeFieldProperty;

export interface IAddOpenLastModifiedTimeFieldProperty {
  /** 日期格式 */
  dateFormat: string;
  /** 时间格式 */
  timeFormat?: string;
  /** 是否包含时间 */
  includeTime?: boolean;
  /** 指定字段类型：0 所有可编辑，1 指定字段 */
  collectType?: CollectType;
  /** 是否指定字段，数组类型可指定多个字段，不填为所有 */
  fieldIdCollection?: string[];
}

export type IAddOpenCreatedByFieldProperty = null;

export interface IAddOpenLastModifiedByFieldProperty {
  /** 指定字段类型：0 所有可编辑，1 指定字段 */
  collectType?: CollectType;
  /** 是否指定字段，数组类型可指定多个字段，不填为所有 */
  fieldIdCollection?: string[];
}

export type IAddOpenFieldProperty = IAddOpenTextFieldProperty
  | IAddOpenURLFieldProperty
  | IAddOpenEmailFieldProperty
  | IAddOpenPhoneFieldProperty
  | IAddOpenSingleTextFieldProperty
  | IAddOpenNumberFieldProperty
  | IAddOpenCheckboxFieldProperty
  | IAddOpenRatingFieldProperty
  | IAddOpenPercentFieldProperty
  | IAddOpenCurrencyFieldProperty
  | IAddOpenSingleSelectFieldProperty
  | IAddOpenMultiSelectFieldProperty
  | IAddOpenMemberFieldProperty
  | IAddOpenDateTimeFieldProperty
  | IAddOpenAttachmentFieldProperty
  | IAddOpenMagicLinkFieldProperty
  | IAddOpenMagicLookUpFieldProperty
  | IAddOpenFormulaFieldProperty
  | IAddOpenAutoNumberFieldProperty
  | IAddOpenCreatedTimeFieldProperty
  | IAddOpenLastModifiedTimeFieldProperty
  | IAddOpenCreatedByFieldProperty
  | IAddOpenLastModifiedByFieldProperty;

export type IUpdateOpenTextFieldProperty = null;

export type IUpdateOpenURLFieldProperty = null;
  
export type IUpdateOpenEmailFieldProperty = null;
  
export type IUpdateOpenPhoneFieldProperty = null;
  
export type IUpdateOpenSingleTextFieldProperty = IOpenSingleTextFieldProperty;
  
export type IUpdateOpenNumberFieldProperty = IOpenNumberFieldProperty;
  
export type IUpdateOpenCheckboxFieldProperty = IOpenCheckboxFieldProperty;
  
export type IUpdateOpenRatingFieldProperty = IOpenRatingFieldProperty;
  
export type IUpdateOpenPercentFieldProperty = IOpenPercentFieldProperty;
  
export type IUpdateOpenCurrencyFieldProperty = IOpenCurrencyFieldProperty;
  
export type IUpdateOpenSingleSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;
  
export type IUpdateOpenMultiSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;
  
export type IUpdateOpenMemberFieldProperty = IAddOpenMemberFieldProperty;
  
export type IUpdateOpenDateTimeFieldProperty = IOpenDateTimeFieldProperty;
  
export type IUpdateOpenAttachmentFieldProperty = null;
  
export interface IUpdateOpenMagicLinkFieldProperty extends IAddOpenMagicLinkFieldProperty {
  /** 修改关联表之后，对于之前关联表的关联字段的操作选项，默认 delete */
  conversion?: Conversion
}

export type IUpdateOpenMagicLookUpFieldProperty = IAddOpenMagicLookUpFieldProperty;

export type IUpdateOpenFormulaFieldProperty = IAddOpenFormulaFieldProperty;
  
export type IUpdateOpenAutoNumberFieldProperty = null;
  
export type IUpdateOpenCreatedTimeFieldProperty = IOpenCreatedTimeFieldProperty;
  
export type IUpdateOpenLastModifiedTimeFieldProperty = IAddOpenLastModifiedTimeFieldProperty;
  
export type IUpdateOpenCreatedByFieldProperty = null;
  
export type IUpdateOpenLastModifiedByFieldProperty = IAddOpenLastModifiedByFieldProperty;

export type IUpdateOpenFieldProperty = IUpdateOpenTextFieldProperty
  | IUpdateOpenURLFieldProperty
  | IUpdateOpenEmailFieldProperty
  | IUpdateOpenPhoneFieldProperty
  | IUpdateOpenSingleTextFieldProperty
  | IUpdateOpenNumberFieldProperty
  | IUpdateOpenCheckboxFieldProperty
  | IUpdateOpenRatingFieldProperty
  | IUpdateOpenPercentFieldProperty
  | IUpdateOpenCurrencyFieldProperty
  | IUpdateOpenSingleSelectFieldProperty
  | IUpdateOpenMultiSelectFieldProperty
  | IUpdateOpenMemberFieldProperty
  | IUpdateOpenDateTimeFieldProperty
  | IUpdateOpenAttachmentFieldProperty
  | IUpdateOpenMagicLinkFieldProperty
  | IUpdateOpenMagicLookUpFieldProperty
  | IUpdateOpenFormulaFieldProperty
  | IUpdateOpenAutoNumberFieldProperty
  | IUpdateOpenCreatedTimeFieldProperty
  | IUpdateOpenLastModifiedTimeFieldProperty
  | IUpdateOpenCreatedByFieldProperty
  | IUpdateOpenLastModifiedByFieldProperty;
