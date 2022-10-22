import { t, Strings } from 'i18n';
import { IFilterInfo } from './view_types';
/* eslint-disable */
export type ITextFieldProperty = null;
export type IEmailProperty = null;
export type IPhoneProperty = null;

export interface IURLProperty {
  isRecogURLFlag?: boolean;
}

export interface IFormulaProperty {
  datasheetId: string; // formula 进行计算是，需要通过 fieldProperty 定位到当前 datasheetId;
  expression: string;
  formatting?: IComputedFieldFormattingProperty;
}

export enum FormulaFuncType {
  Array = 'Array',
  DateTime = 'DataTime',
  Logical = 'Logical',
  Numeric = 'Numeric',
  Record = 'Record',
  Text = 'Text',
}

/**
 * 单元格值的基础类型。
 */
export enum BasicValueType {
  String = 'String',
  Number = 'Number',
  DateTime = 'DateTime',
  Array = 'Array',
  Boolean = 'Boolean',
}

export type IDateTimeFieldPropertyFormat = Omit<IDateTimeFieldProperty, 'autoFill'>;

/**
 * 计算字段返回值为 number 时候，数字类型字段格式化
 */
export interface INumberBaseFieldPropertyFormat {
  formatType: number;
  precision: number;
  symbol?: string;
}

/** 计算字段：formula & lookup 在返回值为 number、datetime 时，可以额外设置格式化条件。 */
export type IComputedFieldFormattingProperty = IDateTimeFieldPropertyFormat | INumberBaseFieldPropertyFormat;

export enum RollUpFuncType {
  VALUES = 'VALUES', // 原样展示，汇总数组

  // 走 formula 计算，存在 expression
  AVERAGE = 'AVERAGE',
  COUNT = 'COUNT',
  COUNTA = 'COUNTA',
  COUNTALL = 'COUNTALL',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',

  // 目前是 lookup 里面处理的
  // // 会转换成 string
  CONCATENATE = 'CONCATENATE',
  ARRAYJOIN = 'ARRAYJOIN',
  // // 还是 array
  ARRAYUNIQUE = 'ARRAYUNIQUE',
  ARRAYCOMPACT = 'ARRAYCOMPACT',
}

export interface ILookUpProperty {
  datasheetId: string;
  relatedLinkFieldId: string;
  lookUpTargetFieldId: string;
  rollUpType?: RollUpFuncType;
  formatting?: IComputedFieldFormattingProperty;
  filterInfo?: IFilterInfo;
  openFilter?: boolean;
}

export interface ITextField extends IBaseField {
  type: FieldType.Text;
  property: ITextFieldProperty;
}

export interface IURLField extends IBaseField {
  type: FieldType.URL;
  property: IURLProperty;
}

export interface IEmailField extends IBaseField {
  type: FieldType.Email;
  property: IEmailProperty;
}

export interface IMemberProperty {
  isMulti: boolean; // 可选单个或者多个成员。
  shouldSendMsg: boolean; // 选择成员后是否发送消息通知
  unitIds: string[];
}

export enum MemberType {
  Team = 1,
  Role = 2,
  Member = 3,
}

export type IUnitIds = string[];

export interface IMemberField extends IBaseField {
  type: FieldType.Member;
  property: IMemberProperty;
}

export type IUuids = string[];

export type ICreatedByProperty = {
  uuids: string[];
  datasheetId: string;
};

export interface ICreatedByField extends IBaseField {
  type: FieldType.CreatedBy;
  property: ICreatedByProperty;
}

export interface ILastModifiedByProperty {
  uuids: string[];
  datasheetId: string;
  // 依赖的字段集合类型
  collectType: CollectType;
  // 依赖的字段
  fieldIdCollection: string[];
}

export interface ILastModifiedByField extends IBaseField {
  type: FieldType.LastModifiedBy;
  property: ILastModifiedByProperty;
}

export interface ILookUpField extends IBaseField {
  type: FieldType.LookUp;
  property: ILookUpProperty;
}

export interface IFormulaField extends IBaseField {
  type: FieldType.Formula;
  property: IFormulaProperty;
}

export interface IPhoneField extends IBaseField {
  type: FieldType.Phone;
  property: IPhoneProperty;
}

export enum MentionType {
  Unknown = 0,
  User = 1, // 用户
  DataSheet = 2, // 数据表
  Group = 3, // 小组
}

export enum SegmentType {
  Unknown = 0,
  Text = 1, // 纯文本
  Mention = 1, // @类型
  Url = 2, // 链接
  Image = 3, // 内联图片
  Email = 4, // 邮箱, URL 的子集
}

export interface IBaseSegment {
  text: string;
}

export interface ITextSegment extends IBaseSegment {
  type: SegmentType.Text;
}

export interface IHyperlinkSegment extends IBaseSegment {
  type: SegmentType.Url;
  link: string; // 纯链接情况下，link 和 text 一样
  title?: string;
  favicon?: string;
  visited?: boolean;
}

export interface IEmailSegment extends IBaseSegment {
  type: SegmentType.Email;
  link: string; // 纯链接情况下，link 和 text 一样
}

export interface IMentionSegment extends IBaseSegment {
  type: SegmentType.Mention;
  link: string;
  token: string;
  mentionType: MentionType;
  mentionNotify: boolean;
}

export type ISegment = ITextSegment | IMentionSegment | IHyperlinkSegment | IEmailSegment;

export interface IStandardValue {
  sourceType: FieldType;
  data: (IBaseSegment & { [key: string]: any })[];
}

export const DefaultCommaStyle = ',';

export interface INumberFieldProperty {
  precision: number;
  defaultValue?: string;
  commaStyle?: string;
  symbol?: string;
  symbolAlign?: SymbolAlign;
}

export interface INumberField extends IBaseField {
  type: FieldType.Number;
  property: INumberFieldProperty;
}

export enum NumberPrecisionType {
  level0 = 0,
  level1 = 1,
  level2 = 2,
  level3 = 3,
  level4 = 4,
}

export enum SymbolAlign {
  /** 默认 */
  default = 0,
  /** 居左 */
  left = 1,
  /** 居右 */
  right = 2,
}

export interface ICurrencyFieldProperty {
  symbol: string;
  precision: number;
  defaultValue?: string;
  symbolAlign?: SymbolAlign;
}

export interface ICurrencyField extends IBaseField {
  type: FieldType.Currency;
  property: ICurrencyFieldProperty;
}

export interface IPercentFieldProperty {
  precision: number;
  defaultValue?: string;
}

export interface IPercentField extends IBaseField {
  type: FieldType.Percent;
  property: IPercentFieldProperty;
}

export interface IAutoNumberFieldProperty {
  nextId: number;
  viewIdx: number;
  datasheetId: string;
}

export interface IAutoNumberField extends IBaseField {
  type: FieldType.AutoNumber;
  property: IAutoNumberFieldProperty;
}

export interface ICreatedTimeFieldProperty {
  datasheetId: string;
  dateFormat: DateFormat; // 日期格式
  timeFormat: TimeFormat; // 时间格式
  includeTime: boolean; // 是否包含时间
}

export interface ICreatedTimeField extends IBaseField {
  type: FieldType.CreatedTime;
  property: ICreatedTimeFieldProperty;
}

export enum CollectType {
  // 所有字段
  AllFields,
  // 指定字段
  SpecifiedFields,
}

export interface ILastModifiedTimeFieldProperty {
  datasheetId: string;
  // 日期格式
  dateFormat: DateFormat;
  // 时间格式
  timeFormat: TimeFormat;
  // 是否包含时间
  includeTime: boolean;
  // 依赖的字段集合类型
  collectType: CollectType;
  // 依赖的字段
  fieldIdCollection: string[];
}

export interface ILastModifiedTimeField extends IBaseField {
  type: FieldType.LastModifiedTime;
  property: ILastModifiedTimeFieldProperty;
}

// 用于 数字 类型字段格式化
export interface INumberFormatFieldProperty extends IBaseField {
  formatType: number;
  precision: number;
  symbol: string;
  commaStyle?: string;
}

export type INotSupportFieldProperty = any;

export interface INotSupportField extends IBaseField {
  type: FieldType.NotSupport;
  property: INotSupportFieldProperty;
}

export interface IDeniedField extends IBaseField {
  type: FieldType.DeniedField;
  property: INotSupportFieldProperty;
}

export interface IBaseField {
  id: string;
  name: string;
  desc?: string;
  required?: boolean;
}

export type IFieldProperty =
  | INotSupportFieldProperty
  | ITextFieldProperty
  | INumberFieldProperty
  | ISelectFieldProperty
  | IDateTimeFieldProperty
  | IAttachProperty
  | ICurrencyFieldProperty
  | IPercentFieldProperty
  | IAutoNumberFieldProperty
  | ICreatedTimeField
  | ILastModifiedTimeField;

export type ITimestamp = number;

export enum DateRange {
  /**
   * 1901/01/01 00:00:00 UTC+0000
   * 最小时间限制的原因
   */
  MinTimeStamp = -2177452800000,
  /** 3000/12/31 24:00:00 UTC+0000 */
  MaxTimeStamp = 32535216000000,
}

export enum DateFormat {
  /** 年/月/日 */
  'YYYY/MM/DD',
  /** 年-月-日 */
  'YYYY-MM-DD',
  /** 日/月/年 */
  'DD/MM/YYYY',
  /** 年-月 */
  'YYYY-MM',
  /** 月-日 */
  'MM-DD',
  /** 年份 */
  'YYYY',
  /** 月份 */
  'MM',
  /** 天 */
  'DD',
}

export enum TimeFormat {
  /** 'HH:mm', 00 - 24 hour */
  'HH:mm',
  /** 'hh:mm', 00 - 12 hour */
  'hh:mm',
}

export interface IDateTimeFieldProperty {
  /** 日期格式 */
  dateFormat: DateFormat;
  /** 时间格式 */
  timeFormat: TimeFormat;
  /** 是否包含时间 */
  includeTime: boolean;
  /** 新增记录时是否自动填入创建时间 */
  autoFill: boolean;
}

export interface IDateTimeField extends IBaseField {
  type: FieldType.DateTime;
  property: IDateTimeFieldProperty;
}

export interface IDateTimeBaseFieldProperty {
  // 日期格式
  dateFormat: DateFormat;
  // 时间格式
  timeFormat: TimeFormat;
  // 是否包含时间
  includeTime: boolean;
  // 新增记录时是否自动填入创建时间
  autoFill?: boolean;
  // 依赖的字段集合类型
  collectType?: CollectType;
  // 依赖的字段
  fieldIdCollection?: string[];
}

export interface IDateTimeBaseField extends IBaseField {
  type: FieldType.DateTime | FieldType.CreatedTime | FieldType.LastModifiedTime;
  property: IDateTimeBaseFieldProperty;
}

export type IAttachProperty = null;

export type IAttachmentWithState = IAttachmentValue & { loading?: boolean };

export type IMultiSelectedIds = string[];

export type ILinkIds = string[];

export interface ISelectFieldOption {
  id: string;
  name: string;
  color: number;
}

export interface ISelectFieldProperty {
  options: ISelectFieldOption[];
  defaultValue?: string | IMultiSelectedIds;
}

export interface ISingleSelectField extends IBaseField {
  property: ISelectFieldProperty;
  type: FieldType.SingleSelect;
}

export interface IMultiSelectField extends IBaseField {
  property: ISelectFieldProperty;
  type: FieldType.MultiSelect;
}

export type ISelectField = IMultiSelectField | ISingleSelectField;

export interface ILinkFieldProperty {
  foreignDatasheetId: string;
  brotherFieldId?: string;
  limitToView?: string; // 限制只在对应 viewId 可选 record。注意：viewId 可能随着关联表的修改而并不存在于关联表
  limitSingleRecord?: boolean; // 是否限制只允许关联一条阻断。注意：这是一个软性限制，只在当前表交互上生效，实际上有多种办法突破限制。
}

export interface ILinkField extends IBaseField {
  property: ILinkFieldProperty;
  type: FieldType.Link;
}

export enum LinkFieldSet {
  Add = 'add',
}

export interface IAttachmentValue {
  /** id 用来做 follow key，目前和 attachmentToken 一样 */
  id: string;
  name: string;
  /** 文件的 mime 类型 */
  mimeType: string;
  /** 文件上传到后端 token，最终地址通过前端组装来访问。 */
  token: string;
  /** 存储位置，后端返回 */
  bucket: string;
  /** 文件大小，后端返回 byte */
  size: number;
  width?: number;
  height?: number;
  /** 预览地址（pdf 之类文件） */
  preview?: string;
}

export interface IAttacheField extends IBaseField {
  type: FieldType.Attachment;
  property: null;
}

export interface ICheckboxFieldProperty {
  icon: string; // Emoji slug
  // antiIcon?: string;
}

// bool
export interface ICheckboxField extends IBaseField {
  type: FieldType.Checkbox;
  property: ICheckboxFieldProperty;
}

export interface IRatingFieldProperty {
  icon: string; // Emoji slug
  max: number;
}

export interface IRatingField extends IBaseField {
  type: FieldType.Rating;
  property: IRatingFieldProperty;
}

export interface ISingleTextProperty {
  defaultValue?: string;
}

export interface ISingleTextField extends IBaseField {
  type: FieldType.SingleText;
  property: ISingleTextProperty;
}

export type IField =
  | INotSupportField
  | IDeniedField
  | IAttacheField
  | IDateTimeField
  | ITextField
  | INumberField
  | IMultiSelectField
  | ISingleSelectField
  | ILinkField
  | IURLField
  | IEmailField
  | IPhoneField
  | ICheckboxField
  | IRatingField
  | IMemberField
  | ILookUpField
  | IFormulaField
  | ICurrencyField
  | IPercentField
  | ISingleTextField
  | IAutoNumberField
  | ICreatedTimeField
  | ILastModifiedTimeField
  | ICreatedByField
  | ILastModifiedByField;

export enum FieldType {
  NotSupport = 0,
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  DateTime = 5,
  Attachment = 6,
  Link = 7,
  URL = 8,
  Email = 9,
  Phone = 10,
  Checkbox = 11,
  Rating = 12,
  Member = 13,
  LookUp = 14,
  // RollUp = 15,
  Formula = 16,
  Currency = 17,
  Percent = 18,
  SingleText = 19,
  AutoNumber = 20,
  CreatedTime = 21,
  LastModifiedTime = 22,
  CreatedBy = 23,
  LastModifiedBy = 24,
  DeniedField = 999, // 无权限列
}

export const readonlyFields = new Set([
  FieldType.Formula,
  FieldType.LookUp,
  FieldType.AutoNumber,
  FieldType.CreatedTime,
  FieldType.LastModifiedTime,
  FieldType.CreatedBy,
  FieldType.LastModifiedBy,
]);

export interface IFieldTypeCollection {
  title: string;
  subTitle: string;
  type: number;
  canBePrimaryField: boolean;
  fieldGroup: FieldGroup;
  help: string;
  hasOptSetting: boolean; // 字段是否存在可选配置，用于控制字段配置菜单中是否显示分割线。
}

export enum FieldGroup {
  Common,
  Advanced,
}

/**
 * Fields description
 */
export const FieldTypeDescriptionMap: {
  [key: number]: IFieldTypeCollection;
} = {
  [FieldType.DeniedField]: {
    title: t(Strings.field_title_single_text),
    subTitle: t(Strings.field_desc_single_text),
    type: FieldType.SingleText,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_text),
    hasOptSetting: false,
  },
  [FieldType.SingleText]: {
    title: t(Strings.field_title_single_text),
    subTitle: t(Strings.field_desc_single_text),
    type: FieldType.SingleText,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_single_text),
    hasOptSetting: true,
  },
  [FieldType.Text]: {
    title: t(Strings.field_title_text),
    subTitle: t(Strings.field_desc_text),
    type: FieldType.Text,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_text),
    hasOptSetting: false,
  },
  [FieldType.Number]: {
    title: t(Strings.field_title_number),
    subTitle: t(Strings.field_desc_number),
    type: FieldType.Number,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_number),
    hasOptSetting: true,
  },
  [FieldType.SingleSelect]: {
    title: t(Strings.field_title_single_select),
    subTitle: t(Strings.field_desc_single_select),
    type: FieldType.SingleSelect,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_single_select),
    hasOptSetting: true,
  },
  [FieldType.MultiSelect]: {
    title: t(Strings.field_title_multi_select),
    subTitle: t(Strings.field_desc_multi_select),
    type: FieldType.MultiSelect,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_multi_select),
    hasOptSetting: true,
  },
  [FieldType.DateTime]: {
    title: t(Strings.field_title_datetime),
    subTitle: t(Strings.field_desc_datetime),
    type: FieldType.DateTime,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_datetime),
    hasOptSetting: true,
  },
  [FieldType.Attachment]: {
    title: t(Strings.field_title_attachment),
    subTitle: t(Strings.field_desc_attachment),
    type: FieldType.Attachment,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_attachment),
    hasOptSetting: false,
  },
  [FieldType.Link]: {
    title: t(Strings.field_title_link),
    subTitle: t(Strings.field_desc_link),
    type: FieldType.Link,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_link),
    hasOptSetting: true,
  },
  [FieldType.LookUp]: {
    title: t(Strings.field_title_lookup),
    subTitle: t(Strings.field_desc_lookup),
    type: FieldType.LookUp,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_lookup),
    hasOptSetting: true,
  },
  [FieldType.Formula]: {
    title: t(Strings.field_title_formula),
    subTitle: t(Strings.field_desc_formula),
    type: FieldType.Formula,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_formula),
    hasOptSetting: true,
  },
  [FieldType.Member]: {
    title: t(Strings.field_title_member),
    subTitle: t(Strings.field_desc_member),
    type: FieldType.Member,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_member),
    hasOptSetting: true,
  },
  [FieldType.Checkbox]: {
    title: t(Strings.field_title_checkbox),
    subTitle: t(Strings.field_desc_checkbox),
    type: FieldType.Checkbox,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_checkbox),
    hasOptSetting: true,
  },
  [FieldType.Rating]: {
    title: t(Strings.field_title_rating),
    subTitle: t(Strings.field_desc_rating),
    type: FieldType.Rating,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_rating),
    hasOptSetting: true,
  },
  [FieldType.URL]: {
    title: t(Strings.field_title_url),
    subTitle: t(Strings.field_desc_url),
    type: FieldType.URL,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_url),
    hasOptSetting: false,
  },
  [FieldType.Phone]: {
    title: t(Strings.field_title_phone),
    subTitle: t(Strings.field_desc_phone),
    type: FieldType.Phone,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_phone),
    hasOptSetting: false,
  },
  [FieldType.Email]: {
    title: t(Strings.field_title_email),
    subTitle: t(Strings.field_desc_email),
    type: FieldType.Email,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_email),
    hasOptSetting: false,
  },
  [FieldType.Currency]: {
    title: t(Strings.field_title_currency),
    subTitle: t(Strings.field_desc_currency),
    type: FieldType.Currency,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_currency),
    hasOptSetting: true,
  },
  [FieldType.Percent]: {
    title: t(Strings.field_title_percent),
    subTitle: t(Strings.field_desc_percent),
    type: FieldType.Percent,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_percent),
    hasOptSetting: true,
  },
  [FieldType.AutoNumber]: {
    title: t(Strings.field_title_autonumber),
    subTitle: t(Strings.field_desc_autonumber),
    type: FieldType.AutoNumber,
    canBePrimaryField: true,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_autonumber),
    hasOptSetting: false,
  },
  [FieldType.CreatedTime]: {
    title: t(Strings.field_title_created_time),
    subTitle: t(Strings.field_desc_created_time),
    type: FieldType.CreatedTime,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_created_time),
    hasOptSetting: true,
  },
  [FieldType.LastModifiedTime]: {
    title: t(Strings.field_title_last_modified_time),
    subTitle: t(Strings.field_desc_last_modified_time),
    type: FieldType.LastModifiedTime,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_last_modified_time),
    hasOptSetting: true,
  },
  [FieldType.CreatedBy]: {
    title: t(Strings.field_title_created_by),
    subTitle: t(Strings.field_desc_created_by),
    type: FieldType.CreatedBy,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_created_by),
    hasOptSetting: false,
  },
  [FieldType.LastModifiedBy]: {
    title: t(Strings.field_title_last_modified_by),
    subTitle: t(Strings.field_desc_last_modified_by),
    type: FieldType.LastModifiedBy,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_last_modified_by),
    hasOptSetting: true,
  },
};
