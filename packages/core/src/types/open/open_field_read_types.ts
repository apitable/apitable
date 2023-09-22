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

import type { APIMetaFieldPropertyFormatEnums, APIMetaMemberType, TSymbolAlign } from '../field_api_enums';
import type { IFormat } from '../field_api_property_types';
import type { BasicValueType, CollectType, ILookUpSortInfo, IMultiSelectedIds, LookUpLimitType, RollUpFuncType } from '../field_types';
import { IOpenLookUpFilterInfo } from './open_lookup_types';
export interface IOpenField {
  /** fieldId */
  id: string;
  /** fieldName */
  name: string;
  /** fieldType string format */
  type: string;
  /** Is it the main column */
  isPrimary?: boolean;
  /** column description */
  description?: string;
  /** Field configuration */
  property?: IOpenFieldProperty;
  /** editable, field permissions */
  editable?: boolean;
  /** Magic form required */
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
  | IOpenOneWayLinkFieldProperty
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
  /** max 1 - 10 */
  max: number;
  /** Emoji slug */
  icon: string;
}

export interface IOpenPercentFieldProperty {
  /** New record default value */
  defaultValue?: string;
  /** Preserve decimal places */
  precision: number;
}

export interface IOpenCurrencyFieldProperty {
  /** New record default value */
  defaultValue?: string;
  /** Units */
  symbol: string;
  /** Preserve decimal places */
  precision: number;
  /** Unit alignment */
  symbolAlign?: TSymbolAlign;
}
export type IOpenSingleSelectFieldProperty = IOpenSelectBaseFieldProperty;

export type IOpenMultiSelectFieldProperty = IOpenSelectBaseFieldProperty;
export interface IOpenSelectBaseFieldProperty {
  defaultValue?: string | IMultiSelectedIds;
  /** Option configuration */
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
  /** member type */
  type: APIMetaMemberType;
  /** Avatar URl */
  avatar?: string;
}

export interface IOpenMemberFieldProperty {
  /** Set of all values in the current column */
  options: IOpenMemberOption[];
  // Whether to allow adding multiple members
  isMulti?: boolean;
  // whether to send notification
  shouldSendMsg?: boolean;
  subscription?: boolean;
}
export interface IOpenDateTimeFieldProperty {
  /** date format */
  dateFormat: string;
  /** Time format */
  timeFormat?: string;
  /** Whether to automatically fill in the creation time when adding a new record */
  autoFill?: boolean;
  /** Whether to include time */
  includeTime?: boolean;
}

export type IOpenAttachmentFieldProperty = null;

export interface IOpenOneWayLinkFieldProperty {
  /** Association table ID */
  foreignDatasheetId: string;
  /** The associated field ID of the associated table */
  brotherFieldId?: string;
  /** Specify view ID to filter records */
  limitToViewId?: string;
  /** Whether to limit the selection to only a single record */
  limitSingleRecord?: boolean;
}

export interface IOpenMagicLinkFieldProperty {
  /** Association table ID */
  foreignDatasheetId: string;
  /** The associated field ID of the associated table */
  brotherFieldId?: string;
  /** Specify view ID to filter records */
  limitToViewId?: string;
  /** Whether to limit the selection to only a single record */
  limitSingleRecord?: boolean;
}

export interface IOpenComputedFormat {
  type: APIMetaFieldPropertyFormatEnums;
  format: IFormat
}

export interface IOpenMagicLookUpFieldProperty {
  /** The associated field ID of the current table referenced */
  relatedLinkFieldId: string;
  /** Field ID queried in the associated table */
  targetFieldId: string;
  /** When the dependent associated field of the magical reference is deleted or converted, the reference value may not be obtained normally */
  hasError?: boolean;
  /** The final referenced entity field, does not contain fields of magical reference type. Entity fields may not exist when there is an error. */
  entityField?: {
    datasheetId: string;
    field: IOpenField;
  };
  /** Aggregate function */
  rollupFunction?: RollUpFuncType;
  /** return value type */
  valueType?: 'String' | 'Boolean' | 'Number' | 'DateTime' | 'Array';
  /** Format, because the reference field is different, the format is different (number, percentage, date, currency) */
  format?: IOpenComputedFormat;
  enableFilterSort?: boolean;
  filterInfo?: IOpenLookUpFilterInfo;
  sortInfo?: ILookUpSortInfo;
  lookUpLimit?: LookUpLimitType;
}
export interface IOpenFormulaFieldProperty {
  /** formula expression */
  expression: string;
  /** Return value type, including String, Boolean, Number, DateTime, Array */
  valueType: BasicValueType;
  /** When the related field that the formula depends on is deleted or the type is converted, the calculated value may not be obtained normally */
  hasError?: boolean;
  /** Format, because the reference field is different, the format is different (number, percentage, date, currency) */
  format?: IOpenComputedFormat;
}

export type IOpenAutoNumberFieldProperty = null;

export type IOpenCreatedTimeFieldProperty = Omit<IOpenDateTimeFieldProperty, 'autoFill'>;
export interface IOpenLastModifiedTimeFieldProperty {
  /** date format */
  dateFormat: string;
  /** Time format */
  timeFormat: string;
  /** Whether to include time */
  includeTime: boolean;
  /** Specify field type: 0 all editable, 1 specified field */
  collectType: CollectType;
  /** Whether to specify a field, the array type can specify multiple fields, do not fill in all */
  fieldIdCollection?: string[];
}

export type IOpenCreatedByFieldProperty = null;

export interface IOpenLastModifiedByFieldProperty {
  /** Specify field type: 0 all editable, 1 specified field */
  collectType: CollectType;
  /** Whether to specify a field, the array type can specify multiple fields, do not fill in all */
  fieldIdCollection?: string[];
}
