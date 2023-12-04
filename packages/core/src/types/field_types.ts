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

import { Strings, t } from 'exports/i18n';
import type { IFilterInfo } from './view_types';

/* eslint-disable */
export type ITextFieldProperty = null;
export type IEmailProperty = null;
export type IPhoneProperty = null;

export interface IURLProperty {
  isRecogURLFlag?: boolean;
}

export interface IFormulaProperty {
  datasheetId: string; // formula is calculated, it needs to locate the current datasheetId through fieldProperty;
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
  * The underlying type of the cell value.
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
 * When the return value of the calculated field is number, the number type field is formatted
 */
export interface INumberBaseFieldPropertyFormat {
  formatType: number;
  precision: number;
  symbol?: string;
}

/** Calculated field: formula & lookup When the return value is number or datetime, additional formatting conditions can be set. */
export type IComputedFieldFormattingProperty = IDateTimeFieldPropertyFormat | INumberBaseFieldPropertyFormat;

export enum RollUpFuncType {
  VALUES = 'VALUES', // display as is, aggregate array

  // Take formula calculation, there is expression
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

  // Currently processed in lookup
  // // will be converted to string
  CONCATENATE = 'CONCATENATE',
  ARRAYJOIN = 'ARRAYJOIN',
  // // still an array
  ARRAYUNIQUE = 'ARRAYUNIQUE',
  ARRAYCOMPACT = 'ARRAYCOMPACT',
}

export enum LookUpLimitType {
  'ALL' = 'ALL',
  'FIRST' = 'FIRST',
}

export interface ILookUpSortField {
  fieldId: string;
  desc: boolean;
}

export interface ILookUpSortInfo {
  rules: ILookUpSortField[]
}

export interface ILookUpProperty {
  datasheetId: string;
  relatedLinkFieldId: string;
  lookUpTargetFieldId: string;
  rollUpType?: RollUpFuncType;
  formatting?: IComputedFieldFormattingProperty;
  filterInfo?: IFilterInfo;
  /** If filterInfo and sortInfo are enabled. */
  openFilter?: boolean;
  sortInfo?: ILookUpSortInfo;
  lookUpLimit?: LookUpLimitType;
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
  isMulti?: boolean; // Optional single or multiple members.
  shouldSendMsg: boolean; // Whether to send a message notification after selecting a member
  subscription?: boolean; // Whether to subscription record changes
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
  uuids: (string | {} | null)[];
  datasheetId: string;
  subscription?: boolean;
};

export interface ICreatedByField extends IBaseField {
  type: FieldType.CreatedBy;
  property: ICreatedByProperty;
}
export interface ILastModifiedByProperty {
  uuids: (string | {} | null)[];
  datasheetId: string;
  // dependent field collection type
  collectType: CollectType;
  // dependent fields
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
  User = 1, // user
  DataSheet = 2, // datasheet
  Group = 3, // group
}

export enum SegmentType {
  Unknown = 0,
  Text = 1, // plain text
  Mention = 1, // @type
  Url = 2, // link
  Image = 3, // inline image
  Email = 4, // email, subset of URL
}
export interface IBaseSegment {
  text: string;
}

export interface ITextSegment extends IBaseSegment {
  type: SegmentType.Text;
}
export interface IHyperlinkSegment extends IBaseSegment {
  type: SegmentType.Url;
  link: string; // In the case of pure link, link is the same as text
  title?: string;
  favicon?: string;
  visited?: boolean;
}

export interface IEmailSegment extends IBaseSegment {
  type: SegmentType.Email;
  link: string; // In the case of pure link, link is the same as text
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
  /** default */
  default = 0,
  /** left */
  left = 1,
  /** to the right */
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
  dateFormat: DateFormat; // date format
  timeFormat: TimeFormat; // time format
  includeTime: boolean; // whether to include time
  timeZone?: string;
  includeTimeZone?: boolean;
}

export interface ICreatedTimeField extends IBaseField {
  type: FieldType.CreatedTime;
  property: ICreatedTimeFieldProperty;
}
export enum CollectType {
  // all fields
  AllFields,
  // specify the field
  SpecifiedFields,
}

export interface ILastModifiedTimeFieldProperty {
  datasheetId: string;
  // date format
  dateFormat: DateFormat;
  // Time format
  timeFormat: TimeFormat;
  // whether to include time
  includeTime: boolean;
  timeZone?: string;
  includeTimeZone?: boolean;
  // dependent field collection type
  collectType: CollectType;
  // dependent fields
  fieldIdCollection: string[];
}

export interface ILastModifiedTimeField extends IBaseField {
  type: FieldType.LastModifiedTime;
  property: ILastModifiedTimeFieldProperty;
}

// for numeric type field formatting
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
   * Reason for minimum time limit
   */
  MinTimeStamp = -2177452800000,
  /** 3000/12/31 24:00:00 UTC+0000 */
  MaxTimeStamp = 32535216000000,
}

export enum DateFormat {
  /** year month day */
  'YYYY/MM/DD',
  /** year month day */
  'YYYY-MM-DD',
  /** day/month/year */
  'DD/MM/YYYY',
  /** year-month */
  'YYYY-MM',
  /** Month Day */
  'MM-DD',
  /** year */
  'YYYY',
  /** month */
  'MM',
  /** day */
  'DD',
}

export enum TimeFormat {
  /** 'HH:mm', 00 - 24 hour */
  'HH:mm',
  /** 'hh:mm', 00 - 12 hour */
  'hh:mm',
}
export interface IDateTimeFieldProperty {
  /** date format */
  dateFormat: DateFormat;
  /** Time format */
  timeFormat: TimeFormat;
  /** Whether to include time */
  includeTime: boolean;
  /** Whether to automatically fill in the creation time when adding a new record */
  autoFill: boolean;
  timeZone?: string;
  includeTimeZone?: boolean;
}

export interface IDateTimeField extends IBaseField {
  type: FieldType.DateTime;
  property: IDateTimeFieldProperty;
}

export interface IDateTimeBaseFieldProperty {
  // date format
  dateFormat: DateFormat;
  // Time format
  timeFormat: TimeFormat;
  // whether to include time
  includeTime: boolean;
  // Whether to automatically fill in the creation time when adding a record
  autoFill?: boolean;
  timeZone?: string;
  includeTimeZone?: boolean;

  // dependent field collection type
  collectType?: CollectType;
  // dependent fields
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
  limitToView?: string; // The limit is only on the optional record corresponding to the viewId. Note: viewId may not exist in the associated table with the modification of the associated table
  limitSingleRecord?: boolean; // Whether to limit only one block to be associated. Note: This is a soft limit that only takes effect on the current table interaction, there are actually multiple ways to break the limit.
}

export interface IOneWayLinkFieldProperty {
  foreignDatasheetId: string;
  limitToView?: string; // The limit is only on the optional record corresponding to the viewId. Note: viewId may not exist in the associated table with the modification of the associated table
  limitSingleRecord?: boolean; // Whether to limit only one block to be associated. Note: This is a soft limit that only takes effect on the current table interaction, there are actually multiple ways to break the limit.
}

export interface ILinkField extends IBaseField {
  property: ILinkFieldProperty;
  type: FieldType.Link;
}

export interface IOneWayLinkField extends IBaseField {
  property: IOneWayLinkFieldProperty;
  type: FieldType.OneWayLink;
}

export enum LinkFieldSet {
  Add = 'add',
}

export interface IWorkDocValue {
  documentId: string;
  title: string;
}

export interface IAttachmentValue {
  /** id is used as follow key, currently same as attachmentToken */
  id: string;
  name: string;
  /** mime type of the file */
  mimeType: string;
  /** The file is uploaded to the back-end token, and the final address is accessed through the front-end assembly. */
  token: string;
  /** Storage location, backend returns */
  bucket: string;
  /** file size, backend returns byte */
  size: number;
  width?: number;
  height?: number;
  /** Preview address (files like pdf) */
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

export interface ICascaderField extends IBaseField {
  type: FieldType.Cascader;
  property: ICascaderProperty;
}

export interface IWorkDocField extends IBaseField {
  type: FieldType.WorkDoc;
  property: IWorkDocProperty;
}

interface ILinkedFields {
  id: string;
  name: string;
  type: number;
}

export interface ICascaderProperty {
  showAll: boolean,
  linkedDatasheetId: string,
  linkedViewId: string,
  linkedFields: ILinkedFields[],
  fullLinkedFields: ILinkedFields[],
}

export enum ButtonStyleType {
  Background= 0,
  OnlyText=1
}

export enum ButtonActionType {
  OpenLink = 0,
  TriggerAutomation = 1,
}

export interface IButtonStyle {
  type: ButtonStyleType,
  color: number
}

export enum OpenLinkType {
  Url = 0,
  Expression = 1,
}

export interface IButtonAction {
  type?: ButtonActionType;
  openLink?: {
    type: OpenLinkType;
    expression: string;
  };
  automation?: {
    automationId: string;
    triggerId: string;
  };
}

export interface IButtonActionMeta {
  type?: ButtonActionType;
    expression?: string;
    automationId?: string;
    triggerId?: string;
}

export interface IButtonProperty {
  datasheetId?: string;
  text: string,
  style: IButtonStyle
  action: IButtonAction,
}

export interface IButtonField extends IBaseField {
  type: FieldType.Button;
  property: IButtonProperty;
}

type IWorkDocProperty = null;

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
  | IOneWayLinkField
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
  | ILastModifiedByField
  | ICascaderField
  | IButtonField
  | IWorkDocField;

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
  Cascader = 25,
  OneWayLink = 26,
  WorkDoc = 27,
  Button = 28,
  DeniedField = 999, // no permission column
}

export const readonlyFields = new Set([
  FieldType.Formula,
  FieldType.LookUp,
  FieldType.AutoNumber,
  FieldType.CreatedTime,
  FieldType.LastModifiedTime,
  FieldType.CreatedBy,
  FieldType.LastModifiedBy,
  FieldType.Button
]);

export interface IFieldTypeCollection {
  title: string;
  subTitle: string;
  type: number;
  canBePrimaryField: boolean;
  fieldGroup: FieldGroup;
  help: string;
  hasOptSetting: boolean; // Whether the field has optional configuration, it is used to control whether the split line is displayed in the field configuration menu.
  isBeta?: boolean;
  isNew?: boolean;
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
  [FieldType.OneWayLink]: {
    title: t(Strings.field_title_one_way_link),
    subTitle: t(Strings.field_desc_one_way_link),
    type: FieldType.OneWayLink,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_one_way_link),
    hasOptSetting: true,
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
    hasOptSetting: true,
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
  [FieldType.Cascader]: {
    title: t(Strings.field_title_tree_select),
    subTitle: t(Strings.field_desc_cascader),
    type: FieldType.Cascader,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_cascader),
    hasOptSetting: true,
  },
  [FieldType.Button]: {
    title: t(Strings.field_title_button),
    subTitle: t(Strings.field_desc_button),
    type: FieldType.Button,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Advanced,
    help: t(Strings.field_help_button),
    hasOptSetting: true,
    isBeta: true,
  },
  [FieldType.WorkDoc]: {
    title: t(Strings.field_title_workdoc),
    subTitle: t(Strings.field_desc_workdoc),
    type: FieldType.WorkDoc,
    canBePrimaryField: false,
    fieldGroup: FieldGroup.Common,
    help: t(Strings.field_help_workdoc),
    hasOptSetting: false,
    isBeta: true
  },
};
