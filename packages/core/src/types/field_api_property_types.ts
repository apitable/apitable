/**
  * API Meta open interface definition
  */
import { APIMetaFieldPropertyFormatEnums, APIMetaMemberType, TSymbolAlign } from './field_api_enums';
import { IAPIMetaField } from './field_api_types';
import { BasicValueType, RollUpFuncType } from './field_types';
/**
  * Field properties
  */
export interface IAPIMetaSingleTextFieldFieldProperty {
  defaultValue?: string;
}

export interface IAPIMetaNumberFieldProperty {
  defaultValue?: string;
  precision: number;
  symbol?: string;
  commaStyle?: string;
}

export interface IAPIMetaCurrencyFieldProperty {
  defaultValue?: string;
  precision: number;
  symbol: string;
  symbolAlign?: TSymbolAlign
}

export interface IAPIMetaPercentFieldProperty {
  defaultValue?: string;
  precision: number;
}

export type IAPIMetaNumberBaseFieldProperty = IAPIMetaNumberFieldProperty
  | IAPIMetaCurrencyFieldProperty
  | IAPIMetaPercentFieldProperty
  | IAPIMetaRatingFieldProperty
  | null;

export type IAPIMetaTextBaseFieldProperty = IAPIMetaSingleTextFieldFieldProperty | null;

export interface IAPIMetaSelectOption {
  id: string;
  name: string;
  color: {
    name: string;
    value: string;
  }
}

export interface IAPIMetaSingleSelectFieldProperty {
  options?: IAPIMetaSelectOption[];
}

export type IAPIMetaMultiSelectFieldProperty = IAPIMetaSingleSelectFieldProperty;

export interface IAPIMetaMember {
  id: string;
  name: string;
  type: APIMetaMemberType;
  avatar?: string;
}
export interface IAPIMetaMemberFieldProperty {
  options?: IAPIMetaMember[];
  isMulti?: boolean;
  shouldSendMsg?: boolean;
}

export interface IAPIMetaUser {
  id: string | 'Anonymous' | 'Bot';
  name: string;
  avatar: string;
}

export interface IAPIMetaCreateByFieldProperty {
  options?: IAPIMetaUser[];
}

export interface IAPIMetaLastModifiedByFieldProperty {
  options?: IAPIMetaUser[];
}

export type IAPIMetaMemberBaseFieldProperty = IAPIMetaMemberFieldProperty
  | IAPIMetaCreateByFieldProperty
  | IAPIMetaLastModifiedByFieldProperty
  | null;

export interface IAPIMetaCheckboxFieldProperty {
  icon: string;
}

export interface IAPIMetaRatingFieldProperty {
  icon: string;
  max: number;
}

export interface IAPIMetaDateTimeFieldProperty {
  format: string;
  autoFill?: boolean;
  includeTime: boolean;
}

export type IAPIMetaCreatedTimeFieldProperty = IAPIMetaDateTimeFieldProperty;

export type IAPIMetaLastModifiedTimeFieldProperty = IAPIMetaCreatedTimeFieldProperty;

export type IAPIMetaDateTimeBaseFieldProperty = IAPIMetaDateTimeFieldProperty
  | IAPIMetaCreatedTimeFieldProperty
  | IAPIMetaLastModifiedTimeFieldProperty;

export interface IAPIMetaLinkFieldProperty {
  foreignDatasheetId: string;
  brotherFieldId?: string;
  limitToViewId?: string;
  limitSingleRecord?: boolean;
}

export interface IAPIMetaFieldWithDatasheetId {
  datasheetId: string;
  field: IAPIMetaField;
}
export type IAPIMetaValueType = BasicValueType;

export interface IAPIMetaDateTimeFormat {
  dateFormat: string;
  timeFormat: string;
  includeTime: boolean;
}
export interface IAPIMetaNumberFormat {
  precision: number;
}

export type IPercentFormat = IAPIMetaNumberFormat;

export interface IAPIMetaCurrencyFormat {
  precision: number;
  symbol?: string;
}

export type IFormat = IAPIMetaDateTimeFormat | IAPIMetaNumberFormat | IPercentFormat | IAPIMetaCurrencyFormat;

export interface IAPIMetaDateTimeFormat {
  dateFormat: string;
  timeFormat: string;
  includeTime: boolean;
}

export interface IAPIMetaNoneStringValueFormat {
  type: APIMetaFieldPropertyFormatEnums;
  format: IFormat;
}

export interface IAPIMetaLookupFieldProperty {
  relatedLinkFieldId: string;
  targetFieldId: string;
  hasError?: boolean;
  entityField?: IAPIMetaFieldWithDatasheetId;
  rollupFunction?: RollUpFuncType;
  valueType?: IAPIMetaValueType;
  format?: IAPIMetaNoneStringValueFormat;
}

export interface IAPIMetaFormulaFieldProperty {
  expression: string;
  valueType: IAPIMetaValueType;
  hasError?: boolean;
  format?: IAPIMetaNoneStringValueFormat;
}

export type IAPIMetaFieldProperty = IAPIMetaSingleTextFieldFieldProperty
  | IAPIMetaNumberFieldProperty
  | IAPIMetaCurrencyFieldProperty
  | IAPIMetaPercentFieldProperty
  | IAPIMetaSingleSelectFieldProperty
  | IAPIMetaMultiSelectFieldProperty
  | IAPIMetaMemberFieldProperty
  | IAPIMetaCreateByFieldProperty
  | IAPIMetaLastModifiedByFieldProperty
  | IAPIMetaCheckboxFieldProperty
  | IAPIMetaRatingFieldProperty
  | IAPIMetaDateTimeFieldProperty
  | IAPIMetaCreatedTimeFieldProperty
  | IAPIMetaLastModifiedTimeFieldProperty
  | IAPIMetaLinkFieldProperty
  | IAPIMetaLookupFieldProperty
  | IAPIMetaFormulaFieldProperty;
