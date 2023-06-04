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

import { TextField } from './text_field';
import { AttachmentField } from './attachment_field';
import { DateTimeField } from './date_time_field';
import { CreatedTimeField } from './created_time_field';
import { LastModifiedTimeField } from './last_modified_time_field';
import { NumberField } from './number_field';
import { CurrencyField } from './currency_field';
import { PercentField } from './percent_field';
import { AutoNumberField } from './auto_number_field';
import {
  SingleSelectField,
  MultiSelectField,
} from './select_field';
import { LinkField } from './link_field';
import { URLField } from './url_field';
import { NotSupportField, DeniedField } from './virtual_field';
import {
  ISingleSelectField,
  IMultiSelectField,
  INumberField,
  IAutoNumberField,
  ICurrencyField,
  IPercentField,
  IGeoField,
  ITextField,
  IDateTimeField,
  ICreatedTimeField,
  ILastModifiedTimeField,
  IAttacheField,
  ILinkField,
  IField,
  FieldType,
  IURLField,
  IEmailField,
  IPhoneField,
  IRatingField,
  ICheckboxField,
  IFormulaField,
  ILookUpField,
  IMemberField,
  ICreatedByField,
  ILastModifiedByField,
  ISingleTextField,
  IDeniedField,
  INotSupportField, ICascaderField,
} from 'types/field_types';
import { Field } from './field';
import { EmailField } from './email_field';
import { PhoneField } from './phone_field';
import { RatingField } from './rating_field';
import { CheckboxField } from './checkbox_field';
import { FormulaField } from './formula_field';
import { LookUpField } from './lookup_field';
import { MemberField } from './member_field';
import { CreatedByField } from './created_by_field';
import { LastModifiedByField } from './last_modified_by_field';
import { SingleTextField } from './single_text_field';
import { CascaderField } from './cascader_field';
import { IReduxState } from '../../exports/store';
import { Store } from 'redux';
import { GeoField } from './geo_field';

export * from './field';
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
export { numberThresholdValue } from './number_base_field';
export { OtherTypeUnitId } from './member_base_field';

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
  (field: IURLField, state?: IReduxState, newInstance?: boolean): URLField;
  (field: IEmailField, state?: IReduxState, newInstance?: boolean): EmailField;
  (field: IRatingField, state?: IReduxState, newInstance?: boolean): RatingField;
  (field: ICheckboxField, state?: IReduxState, newInstance?: boolean): CheckboxField;
  (field: IPhoneField, state?: IReduxState, newInstance?: boolean): PhoneField;
  (field: IGeoField, state?: IReduxState, newInstance?: boolean): GeoField;
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
  (field: IGeoField, state: IReduxState): GeoField;
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
    case FieldType.URL: {
      return URLField;
    }
    case FieldType.Email: {
      return EmailField;
    }
    case FieldType.Phone: {
      return PhoneField;
    }
    case FieldType.Geo: {
      return GeoField;
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

export const bindContext = (field: IField, state: IReduxState) => {
  const FieldClass = getFieldClass(field.type);
  return new FieldClass(field as any, state);
};

Field.bindModel = bindModel as IBindFieldModel;
// The difference between bindContext and bindModel is that 
// bindContext creates a new Field object every time, and it is mandatory to pass in the store.
Field.bindContext = bindContext as IBindFieldContext;
