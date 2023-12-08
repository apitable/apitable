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

/**
 * API Meta open interface definition
 */
import type { APIMetaFieldPropertyFormatEnums, APIMetaMemberType, TSymbolAlign } from './field_api_enums';
import type { IAPIMetaField } from './field_api_types';
import type { BasicValueType, ILookUpSortInfo, LookUpLimitType, RollUpFuncType } from './field_types';
import type { IOpenLookUpFilterInfo } from './open';
import { ButtonFieldActionNameEnum, ButtonFieldActionOpenLinkNameEnum, ButtonFieldStyleNameEnum } from './open';

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
  symbolAlign?: TSymbolAlign;
}

export interface IAPIMetaPercentFieldProperty {
  defaultValue?: string;
  precision: number;
}

export type IAPIMetaNumberBaseFieldProperty =
  | IAPIMetaNumberFieldProperty
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
  };
}

export interface IAPIMetaSingleSelectFieldProperty {
  options?: IAPIMetaSelectOption[];
}

export interface IAPIMetaButtonFieldProperty {
  text: string;
  style: {
    type: ButtonFieldStyleNameEnum,
    color: object
  },
  action: {
    type?: ButtonFieldActionNameEnum,
    openLink?: {
      type: ButtonFieldActionOpenLinkNameEnum,
      expression: string
    },
    automation?: {
      automationId: string,
      triggerId: string
    }
  }
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
  subscription?: boolean;
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

export type IAPIMetaMemberBaseFieldProperty =
  | IAPIMetaMemberFieldProperty
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

export interface IAPIMetaDateTimeBaseFieldProperty {
  format: string;
  autoFill?: boolean;
  includeTime: boolean;
  timeZone?: string;
  includeTimeZone?: boolean;
}

export type IAPIMetaDateTimeFieldProperty = IAPIMetaDateTimeBaseFieldProperty;

export type IAPIMetaCreatedTimeFieldProperty = IAPIMetaDateTimeBaseFieldProperty;

export type IAPIMetaLastModifiedTimeFieldProperty = IAPIMetaCreatedTimeFieldProperty;

export interface IAPIMetaOneWayLinkFieldProperty {
  foreignDatasheetId: string;
  limitToViewId?: string;
  limitSingleRecord?: boolean;
}

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
  timeZone?: string;
  includeTimeZone?: boolean;
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
  enableFilterSort?: boolean;
  filterInfo?: IOpenLookUpFilterInfo;
  sortInfo?: ILookUpSortInfo;
  lookUpLimit?: LookUpLimitType;
}

export interface IAPIMetaFormulaFieldProperty {
  expression: string;
  valueType: IAPIMetaValueType;
  hasError?: boolean;
  format?: IAPIMetaNoneStringValueFormat;
}

export type IAPIMetaFieldProperty =
  | IAPIMetaSingleTextFieldFieldProperty
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
  | IAPIMetaOneWayLinkFieldProperty
  | IAPIMetaLinkFieldProperty
  | IAPIMetaLookupFieldProperty
  | IAPIMetaFormulaFieldProperty
  | IAPIMetaButtonFieldProperty;
