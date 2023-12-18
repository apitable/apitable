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

import { Store } from 'redux';
import {
  FieldType,
  IAttacheField,
  IAutoNumberField,
  IButtonField,
  ICascaderField,
  ICheckboxField,
  ICreatedByField,
  ICreatedTimeField,
  ICurrencyField,
  IDateTimeField,
  IDeniedField,
  IEmailField,
  IField,
  IFormulaField,
  ILastModifiedByField,
  ILastModifiedTimeField,
  ILinkField,
  ILookUpField,
  IMemberField,
  IMultiSelectField,
  INotSupportField,
  INumberField,
  IOneWayLinkField,
  IPercentField,
  IPhoneField,
  IRatingField,
  ISingleSelectField,
  ISingleTextField,
  ITextField,
  IURLField,
  IWorkDocField,
} from 'types/field_types';
import { Field } from './field';
import { IReduxState } from '../../exports/store/interfaces';
import { AttachmentField } from './attachment_field';
import { AutoNumberField } from './auto_number_field';
import { CascaderField } from './cascader_field';
import { CheckboxField } from './checkbox_field';
import { CreatedByField } from './created_by_field';
import { CreatedTimeField } from './created_time_field';
import { CurrencyField } from './currency_field';
import { DateTimeField } from './date_time_field';
import { EmailField } from './email_field';
import { FormulaField } from './formula_field';
import { LastModifiedByField } from './last_modified_by_field';
import { LastModifiedTimeField } from './last_modified_time_field';
import { LinkField } from './link_field';
import { LookUpField } from './lookup_field';
import { MemberField } from './member_field';
import { NumberField } from './number_field';
import { OneWayLinkField } from './one_way_link_field';
import { PercentField } from './percent_field';
import { PhoneField } from './phone_field';
import { RatingField } from './rating_field';
import { MultiSelectField, SingleSelectField } from './select_field';
import { SingleTextField } from './single_text_field';
import { TextField } from './text_field';
import { URLField } from './url_field';
import { DeniedField, NotSupportField } from './virtual_field';
import { WorkDocField } from './workdoc_field';
import { ButtonField } from 'model/field/button_field';

export * from './field';
export * from './array_field';
export * from './stat';
export * from './text_field';
export * from './number_field';
export * from './select_field';
export * from './date_time_field';
export * from './virtual_field';
export * from './attachment_field';
export * from './link_field';
export * from './url_field';
export * from './email_field';
export * from './phone_field';
export * from './rating_field';
export * from './member_field';
export * from './formula_field';
export * from './lookup_field';
export * from './currency_field';
export * from './single_text_field';
export * from './created_time_field';
export * from './last_modified_time_field';
export * from './created_by_field';
export * from './last_modified_by_field';
export * from './text_base_field';
export * from './workdoc_field';
export * from './button_field';
export * from './utils';
export { numberThresholdValue, OtherTypeUnitId } from './const';

export interface IBindFieldModel {
  (field: ISingleSelectField, state?: IReduxState, newInstance?: boolean): SingleSelectField;
  (field: IMultiSelectField, state?: IReduxState, newInstance?: boolean): MultiSelectField;
  (field: INumberField, state?: IReduxState, newInstance?: boolean): NumberField;
  (field: ICurrencyField, state?: IReduxState, newInstance?: boolean): CurrencyField;
  (field: IPercentField, state?: IReduxState, newInstance?: boolean): PercentField;
  (field: ITextField, state?: IReduxState, newInstance?: boolean): TextField;
  (field: IDateTimeField, state?: IReduxState, newInstance?: boolean): DateTimeField;
  (field: IAttacheField, state?: IReduxState, newInstance?: boolean): AttachmentField;
  (field: ILinkField, state?: IReduxState, newInstance?: boolean): LinkField;
  (field: IOneWayLinkField, state?: IReduxState, newInstance?: boolean): OneWayLinkField;
  (field: IURLField, state?: IReduxState, newInstance?: boolean): URLField;
  (field: IEmailField, state?: IReduxState, newInstance?: boolean): EmailField;
  (field: IRatingField, state?: IReduxState, newInstance?: boolean): RatingField;
  (field: ICheckboxField, state?: IReduxState, newInstance?: boolean): CheckboxField;
  (field: IPhoneField, state?: IReduxState, newInstance?: boolean): PhoneField;
  (field: IFormulaField, state?: IReduxState, newInstance?: boolean): FormulaField;
  (field: ILookUpField, state?: IReduxState, newInstance?: boolean): LookUpField;
  (field: IMemberField, state?: IReduxState, newInstance?: boolean): MemberField;
  (field: ISingleTextField, state?: IReduxState, newInstance?: boolean): SingleTextField;
  (field: IAutoNumberField, state?: IReduxState, newInstance?: boolean): AutoNumberField;
  (field: ICreatedTimeField, state?: IReduxState, newInstance?: boolean): CreatedTimeField;
  (field: ILastModifiedTimeField, state?: IReduxState, newInstance?: boolean): LastModifiedTimeField;
  (field: ICreatedByField, state?: IReduxState, newInstance?: boolean): CreatedByField;
  (field: ILastModifiedByField, state?: IReduxState, newInstance?: boolean): LastModifiedByField;
  (field: ICascaderField, state?: IReduxState, newInstance?: boolean): CascaderField;
  (field: IButtonField, state?: IReduxState, newInstance?: boolean): ButtonField;
  (field: IWorkDocField, state?: IReduxState, newInstance?: boolean): WorkDocField;
  (field: IDeniedField, state?: IReduxState, newInstance?: boolean): DeniedField;
  (field: INotSupportField, state?: IReduxState, newInstance?: boolean): NotSupportField;
  (field: IField, state?: IReduxState, newInstance?: boolean): Field;
}

export interface IBindFieldContext {
  (field: ISingleSelectField, state: IReduxState): SingleSelectField;
  (field: IMultiSelectField, state: IReduxState): MultiSelectField;
  (field: INumberField, state: IReduxState): NumberField;
  (field: ICurrencyField, state: IReduxState): CurrencyField;
  (field: IPercentField, state: IReduxState): PercentField;
  (field: ITextField, state: IReduxState): TextField;
  (field: IDateTimeField, state: IReduxState): DateTimeField;
  (field: IAttacheField, state: IReduxState): AttachmentField;
  (field: ILinkField, state: IReduxState): LinkField;
  (field: IURLField, state: IReduxState): URLField;
  (field: IEmailField, state: IReduxState): EmailField;
  (field: IRatingField, state: IReduxState): RatingField;
  (field: ICheckboxField, state: IReduxState): CheckboxField;
  (field: IPhoneField, state: IReduxState): PhoneField;
  (field: IFormulaField, state: IReduxState): FormulaField;
  (field: ILookUpField, state: IReduxState): LookUpField;
  (field: IMemberField, state: IReduxState): MemberField;
  (field: ISingleTextField, state: IReduxState): SingleTextField;
  (field: IAutoNumberField, state: IReduxState): AutoNumberField;
  (field: ICreatedTimeField, state: IReduxState): CreatedTimeField;
  (field: ILastModifiedTimeField, state: IReduxState): LastModifiedTimeField;
  (field: ICreatedByField, state: IReduxState): CreatedByField;
  (field: ILastModifiedByField, state: IReduxState): LastModifiedByField;
  (field: ICascaderField, state: IReduxState): CascaderField;
  (field: IButtonField, state?: IReduxState): ButtonField;
  (field: IWorkDocField, state: IReduxState): WorkDocField;
  (field: IDeniedField, state: IReduxState): DeniedField;
  (field: INotSupportField, state: IReduxState): NotSupportField;
  (field: IField, state: IReduxState): Field;
}

export type IAutomaticallyField = CreatedTimeField | LastModifiedTimeField | CreatedByField | LastModifiedByField;
export type IAutoIncreamentField = AutoNumberField;

export const getFieldClass = (type: FieldType) => {
  switch (type) {
    case FieldType.Text: {
      return TextField;
    }
    case FieldType.Number: {
      return NumberField;
    }
    case FieldType.Currency: {
      return CurrencyField;
    }
    case FieldType.Percent: {
      return PercentField;
    }
    case FieldType.AutoNumber: {
      return AutoNumberField;
    }
    case FieldType.SingleSelect: {
      return SingleSelectField;
    }
    case FieldType.MultiSelect: {
      return MultiSelectField;
    }
    case FieldType.DateTime: {
      return DateTimeField;
    }
    case FieldType.CreatedTime: {
      return CreatedTimeField;
    }
    case FieldType.LastModifiedTime: {
      return LastModifiedTimeField;
    }
    case FieldType.Attachment: {
      return AttachmentField;
    }
    case FieldType.Link: {
      return LinkField;
    }
    case FieldType.OneWayLink: {
      return OneWayLinkField;
    }
    case FieldType.URL: {
      return URLField;
    }
    case FieldType.Email: {
      return EmailField;
    }
    case FieldType.Phone: {
      return PhoneField;
    }
    case FieldType.Rating: {
      return RatingField;
    }
    case FieldType.Checkbox: {
      return CheckboxField;
    }
    case FieldType.Member: {
      return MemberField;
    }
    case FieldType.CreatedBy: {
      return CreatedByField;
    }
    case FieldType.LastModifiedBy: {
      return LastModifiedByField;
    }
    case FieldType.LookUp: {
      return LookUpField;
    }
    case FieldType.Formula: {
      return FormulaField;
    }
    case FieldType.SingleText: {
      return SingleTextField;
    }
    case FieldType.Cascader: {
      return CascaderField;
    }
    case FieldType.Button: {
      return ButtonField;
    }
    case FieldType.WorkDoc: {
      return WorkDocField;
    }
    case FieldType.DeniedField: {
      return DeniedField;
    }
    default: {
      return NotSupportField;
    }
  }
};

/**
 * Static store for injection to external callers (web-side).
 * Before calling Field on the web side, inject the store instance first, then you don't need to pass in the store again every time you bindModel
 */
let storeCache: Store;
export const injectStore = (store: Store) => { storeCache = store; };

/**
 * Bind the field model data to get an instance of the field calculation method.
 * A cache is done here. Prevent unnecessary memory consumption caused by new instances when called frequently.
 */
export const bindModel = (() => {
  const cache: { [key: number]: Field } = {};
  return (field: IField, inState?: IReduxState, newInstance?: boolean) => {
    if (!inState && !storeCache) {
      throw new Error('Please pass in the store data source');
    }
    const state = inState || storeCache.getState();
    // Force initialize a new instance
    if (newInstance) {
      const FieldClass = getFieldClass(field.type);
      // @ts-ignore
      return new FieldClass(field as any, state);
    }

    if (cache[field.type]) {
      // When the instance already exists, you only need to modify the this.field property to meet the data initialization requirements.
      cache[field.type]!.field = field;
      cache[field.type]!.state = state;
      return cache[field.type];
    }

    const FieldClass = getFieldClass(field.type);
    const fieldInstance = new FieldClass(field as any, state);
    cache[field.type] = fieldInstance;
    return fieldInstance;
  };
})();

function bindContext(field: ISingleSelectField, state: IReduxState): SingleSelectField;
function bindContext(field: IMultiSelectField, state: IReduxState): MultiSelectField;
function bindContext(field: INumberField, state: IReduxState): NumberField;
function bindContext(field: ICurrencyField, state: IReduxState): CurrencyField;
function bindContext(field: IPercentField, state: IReduxState): PercentField;
function bindContext(field: ITextField, state: IReduxState): TextField;
function bindContext(field: IDateTimeField, state: IReduxState): DateTimeField;
function bindContext(field: IAttacheField, state: IReduxState): AttachmentField;
function bindContext(field: ILinkField, state: IReduxState): LinkField;
function bindContext(field: IURLField, state: IReduxState): URLField;
function bindContext(field: IEmailField, state: IReduxState): EmailField;
function bindContext(field: IRatingField, state: IReduxState): RatingField;
function bindContext(field: ICheckboxField, state: IReduxState): CheckboxField;
function bindContext(field: IPhoneField, state: IReduxState): PhoneField;
function bindContext(field: IFormulaField, state: IReduxState): FormulaField;
function bindContext(field: ILookUpField, state: IReduxState): LookUpField;
function bindContext(field: IMemberField, state: IReduxState): MemberField;
function bindContext(field: ISingleTextField, state: IReduxState): SingleTextField;
function bindContext(field: IAutoNumberField, state: IReduxState): AutoNumberField;
function bindContext(field: ICreatedTimeField, state: IReduxState): CreatedTimeField;
function bindContext(field: ILastModifiedTimeField, state: IReduxState): LastModifiedTimeField;
function bindContext(field: ICreatedByField, state: IReduxState): CreatedByField;
function bindContext(field: ILastModifiedByField, state: IReduxState): LastModifiedByField;
function bindContext(field: ICascaderField, state: IReduxState): CascaderField;
function bindContext(field: IButtonField, state: IReduxState): ButtonField;
function bindContext(field: IWorkDocField, state: IReduxState): WorkDocField;
function bindContext(field: IDeniedField, state: IReduxState): DeniedField;
function bindContext(field: INotSupportField, state: IReduxState): NotSupportField;
function bindContext(field: IField, state: IReduxState): Field {
  const FieldClass = getFieldClass(field.type);
  // @ts-ignore
  return new FieldClass(field as any, state);
}

Field.bindModel = bindModel as IBindFieldModel;
// The difference between bindContext and bindModel is that
// bindContext creates a new Field object every time, and it is mandatory to pass in the store.
Field.bindContext = bindContext as IBindFieldContext;

