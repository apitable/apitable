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

import type { CollectType, ILookUpSortInfo, IMultiSelectedIds, LookUpLimitType, RollUpFuncType } from '../field_types';
import type {
  IOpenCheckboxFieldProperty,
  IOpenComputedFormat,
  IOpenCreatedTimeFieldProperty,
  IOpenCurrencyFieldProperty,
  IOpenDateTimeFieldProperty,
  IOpenField,
  IOpenNumberFieldProperty,
  IOpenPercentFieldProperty,
  IOpenRatingFieldProperty,
  IOpenSingleTextFieldProperty,
} from './open_field_read_types';
import type { IWriteOpenLookUpFilterInfo } from './open_lookup_types';

export enum ButtonFieldStyleNameEnum {
  /**
   * Background
   */
  Background = 'Background',
  /**
   * OnlyText
   */
  OnlyText = 'OnlyText',
}

export enum ButtonFieldActionNameEnum {
  /**
   * OpenLink
   */
  OpenLink = 'OpenLink',
  /**
   * TriggerAutomation
   */
  TriggerAutomation = 'TriggerAutomation',
}

export enum ButtonFieldActionOpenLinkNameEnum {
  /**
   * Url
   */
  Url = 'Url',
  /**
   * Expression
   */
  Expression = 'Expression',
}

export enum Conversion {
  /** delete the associated field of the associated table */
  Delete = 'delete',
  /** Keep the associated fields of the associated table and convert them to text type */
  KeepText = 'keepText',
}

/**
 * Side effects of updating fields
 */
export interface IEffectOption {
  /**
   * Whether to allow deletion of options
   */
  enableSelectOptionDelete?: boolean;
  isBackend?: boolean;
}

export interface IAddOpenField extends Omit<IOpenField, 'isPrimary' | 'id' | 'property'> {
  property: IAddOpenFieldProperty;
}

export interface IUpdateOpenField extends Omit<IOpenField, 'isPrimary' | 'id' | 'property'> {
  property: IUpdateOpenFieldProperty;
}

export interface IWriteOpenSelectBaseFieldProperty {
  defaultValue?: string | IMultiSelectedIds;
  options: {
    id?: string;
    name: string;
    color?: string | number;
  }[];
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
  /* Whether to allow adding multiple members **/
  isMulti?: boolean;
  /** Whether to send notification */
  shouldSendMsg?: boolean;
  subscription?: boolean;
}

export type IAddOpenDateTimeFieldProperty = IOpenDateTimeFieldProperty;

export type IAddOpenAttachmentFieldProperty = null;
export interface IAddOpenMagicLinkFieldProperty {
  /** Associate table ID, switch the associated table, the previous brotherField will be converted to a text field */
  foreignDatasheetId: string;
  /** Specify view ID to filter records */
  limitToViewId?: string;
  /** Whether to limit the selection to only a single record */
  limitSingleRecord?: boolean;
}

export interface IAddOpenMagicLookUpFieldProperty {
  /** The associated field ID of the current table referenced */
  relatedLinkFieldId: string;
  /** Field ID queried in the associated table */
  targetFieldId: string;
  /** Aggregate function */
  rollupFunction?: RollUpFuncType;
  /** Format, because the reference field is different, the format is different (number, percentage, date, currency) */
  format?: IOpenComputedFormat;
  enableFilterSort?: boolean;
  filterInfo?: IWriteOpenLookUpFilterInfo;
  sortInfo?: ILookUpSortInfo;
  lookUpLimit?: LookUpLimitType;
}

export interface IAddOpenFormulaFieldProperty {
  /** formula expression */
  expression?: string;
  /** When the related field that the formula depends on is deleted or the type is converted, the calculated value may not be obtained normally */
  format?: IOpenComputedFormat;
}

export type IAddOpenWorkDocFieldProperty = null;

export type IAddOpenAutoNumberFieldProperty = null;

export type IAddOpenCreatedTimeFieldProperty = IOpenCreatedTimeFieldProperty;

export interface IAddOpenLastModifiedTimeFieldProperty {
  /** date format */
  dateFormat: string;
  /** Time format */
  timeFormat?: string;
  /** Whether to include time */
  includeTime?: boolean;
  /** Specify field type: 0 all editable, 1 specified field */
  collectType?: CollectType;
  /** Whether to specify a field, the array type can specify multiple fields, do not fill in all */
  fieldIdCollection?: string[];
}

export type IAddOpenCreatedByFieldProperty = null;

export interface IAddOpenLastModifiedByFieldProperty {
  /** Specify field type: 0 all editable, 1 specified field */
  collectType?: CollectType;
  /** Whether to specify a field, the array type can specify multiple fields, do not fill in all */
  fieldIdCollection?: string[];
}

export interface IAddOpenButtonFieldProperty {
  text?: string;
  style?: {
    type?: string,
    color?: {
      name: string,
      value: string
    }
  },
  action?: {
    type: string,
    openLink?: {
      type?: string,
      expression?: string
    }
  }
}

export type IAddOpenFieldProperty =
  | IAddOpenTextFieldProperty
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
  | IAddOpenWorkDocFieldProperty
  | IAddOpenAutoNumberFieldProperty
  | IAddOpenCreatedTimeFieldProperty
  | IAddOpenLastModifiedTimeFieldProperty
  | IAddOpenCreatedByFieldProperty
  | IAddOpenLastModifiedByFieldProperty
  | IAddOpenButtonFieldProperty;

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
  /** After modifying the associated table, for the operation options of the associated fields of the previous associated table, the default delete */
  conversion?: Conversion;
}

export type IUpdateOpenMagicLookUpFieldProperty = IAddOpenMagicLookUpFieldProperty;

export type IUpdateOpenFormulaFieldProperty = IAddOpenFormulaFieldProperty;

export type IUpdateOpenAutoNumberFieldProperty = null;

export type IUpdateOpenCreatedTimeFieldProperty = IOpenCreatedTimeFieldProperty;

export type IUpdateOpenLastModifiedTimeFieldProperty = IAddOpenLastModifiedTimeFieldProperty;

export type IUpdateOpenCreatedByFieldProperty = null;

export type IUpdateOpenLastModifiedByFieldProperty = IAddOpenLastModifiedByFieldProperty;
export type IUpdateOpenButtonFieldProperty = IAddOpenButtonFieldProperty;

export type IUpdateOpenFieldProperty =
  | IUpdateOpenTextFieldProperty
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
  | IUpdateOpenLastModifiedByFieldProperty
  | IUpdateOpenButtonFieldProperty;
