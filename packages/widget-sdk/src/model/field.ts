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

import {
  BasicValueType, Field as FieldCore, getFieldResultByStatType, FieldType as CoreFieldType, 
  ICurrencyFieldProperty, IDateTimeFieldProperty, IField, INumberFieldProperty,
  INumberFormatFieldProperty, LookUpField, Selectors, StatType, getFieldTypeString,
  IEffectOption,
  ICollaCommandExecuteResult,
  CollaCommandName,
  ExecuteResult,
  IUpdateOpenMagicLinkFieldProperty,
  Conversion,
  Strings,
  t
} from 'core';
import { cmdExecute } from 'message/utils';
import { IWidgetContext, IFormatType, FieldType, IPermissionResult, IPropertyInView } from 'interface';
import { errMsg } from 'utils/private';
import { Record } from './record';
import { getNewId, IDPrefix, IReduxState } from '@apitable/core';
import { getSnapshot } from 'store';

/**
 * @hidden
 * Enterprise Wecom compatibility judgment, 
 * three-party applications do not support the display of member fields.
 * @param type 
 * @returns 
 */
export const showField = (type: FieldType) => {
  if (!window['_isSocialWecom']) {
    return true;
  }
  if (![FieldType.CreatedBy, FieldType.LastModifiedBy, FieldType.Member].includes(type)) {
    return true;
  }
  return navigator.userAgent.toLowerCase().indexOf('wxwork') === -1;
};

const getNoAcceptableFieldString = (type: FieldType, fieldName: string) => {
  const stringMap = {
    [FieldType.Member]: t(Strings.wecom_widget_member_field_name, { fieldName }),
    [FieldType.CreatedBy]: t(Strings.wecom_widget_created_by_field_name, { fieldName }),
    [FieldType.LastModifiedBy]: t(Strings.wecom_widget_last_edited_by_field_name, { fieldName }),
  };
  return stringMap[type] || 'NoAcceptable';
};

// Field Description Length
const MAX_DESC = 200;

/**
 * Number datasheet column operations and information.
 * 
 * To manipulate the number datasheet columns, 
 * you can use {@link useField} (single column information), 
 * {@link useFields} (multiple column information).
 */
export class Field {
  private fieldEntity: FieldCore;
  /**
   * @hidden
   */
  constructor(
    public datasheetId: string,
    private wCtx: IWidgetContext,
    public fieldData: IField
  ) {
    const state = wCtx.widgetStore.getState() as any as IReduxState;
    this.fieldEntity = FieldCore.bindContext(fieldData, state);
  }

  /**
   * Checks whether the current user has permission to perform the given field update.
   */
  private checkPermissionUpdateField(): IPermissionResult {
    if (!this.fieldEntity.propertyEditable()) {
      return errMsg(`No write access to ${this.fieldData.name}(${this.id}) column`);
    }
    return { acceptable: true };
  }

  /**
   * The ID for this model.
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.id);
   * // => 'fld1234567'
   * ```
   */
  get id(): string {
    return showField(this.type) ? this.fieldData.id : getNewId(IDPrefix.Field);
  }
  /**
   * The name of the field. Can be watched.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.name);
   * // => 'Name'
   * ```
   */
  get name(): string {
    return showField(this.type) ? this.fieldData.name : getNoAcceptableFieldString(this.type, this.fieldData.name);
  }
  /**
   * The type of the field. Can be watched. {@link FieldType}
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.type);
   * // => 'SingleLineText'
   * ```
   */
  get type(): FieldType {
    return getFieldTypeString(this.fieldData.type) as any as FieldType;
  }

  /**
   * The description of the field, if it has one. Can be watched.
   *
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myField.description);
   * // => 'This is my field'
   * ```
   */
  get description(): string | null {
    return this.fieldData.desc || null;
  }

  /**
   * 
   * The configuration property of the field. 
   * The structure of the field's property depend on the field's type. 
   * null if the field has no property. Can be watched.
   * Refer to {@link FieldType}.
   * 
   * @return {@link FieldType}
   *
   * #### Example
   * ```js
   * import { FieldType } from '@apitable/widget-sdk';
   *
   * if (myField.type === FieldType.Currency) {
   *     console.log(myField.options.symbol);
   *     // => '￥'
   * }
   * ```
   */
  get property(): any {
    return this.fieldEntity.openFieldProperty;
  }

  /**
   * true if this field is computed, false otherwise. 
   * A field is "computed" if it's value is not set by user input (e.g. autoNumber, magic lookup,  magic formula, etc.). Can be watched
   *
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(mySingleLineTextField.isComputed);
   * // => false
   * console.log(myAutoNumberField.isComputed);
   * // => true
   * ```
   */
  get isComputed(): boolean {
    return this.fieldEntity.isComputed;
  }

  /**
   * TODO: Leave for compatibility, subsequent deletion 
   * @hidden
   * true if this field is its parent table's primary field, false otherwise. 
   * Should never change because the primary field of a datasheet cannot change.
   * @returns
   */
  get isPrimaryField(): boolean {
    return this.isPrimary;
  }

  /**
   * true if this field is its parent table's primary field, false otherwise. 
   * Should never change because the primary field of a datasheet cannot change.
   * @returns
   */
  get isPrimary(): boolean {
    const state = this.wCtx.widgetStore.getState();
    const snapshot = getSnapshot(state, this.datasheetId);
    return Boolean(snapshot?.meta.views[0]!.columns[0]!.fieldId === this.fieldData.id);
  }

  /**
   * Is the magic form required.
   */
  get required(): boolean | null {
    return this.fieldData.required || null;
  }

  /**
   * Get the current view feature properties, such as whether the field is hidden in a view
   * 
   * @param viewId the view ID
   * @return
   * 
   * #### Example
   * ``` js
   * const propertyInView = field.getPropertyInView('viwxxxxx');
   * console.log(propertyInView?.hidden)
   * ```
   */
  getPropertyInView(viewId: string): IPropertyInView | null {
    const state = this.wCtx.widgetStore.getState();
    const snapshot = getSnapshot(state, this.datasheetId);
    const view = snapshot && Selectors.getViewById(snapshot, viewId);
    const viewField = view?.columns.find(column => column.fieldId === this.id);
    if (!viewField) {
      return null;
    }
    return {
      hidden: viewField.hidden,
    };
  }

  /**
   * Updates the description for this field.
   *
   * Throws an error if the user does not have permission to update the field, or if an invalid description is provided.
   * 
   * @param description new description for the field
   * @returns
   * 
   * #### Example
   * ```js
   *  field.updateDescription('this is a new description')
   * ```
   */
  updateDescription(description: string | null): Promise<void> {
    const desc = description || undefined;
    if (description && description.length > MAX_DESC) {
      throw new Error('Description exceeds the maximum length limit of 200');
    }
    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.SetFieldAttr,
        datasheetId: this.datasheetId,
        fieldId: this.fieldData.id,
        data: {
          ...this.fieldData,
          desc
        }
      }, this.wCtx.id);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
      if (result.result === ExecuteResult.None) {
        throw new Error('update description method has been ignored');
      }
      resolve();
    });
  }

  /**
   * 
   * Beta API, future changes are possible.
   *
   * Updates the property for this field, 
   * tips: that the update property configuration must be overwritten in full.
   *
   * Throws an error if the user does not have permission to update the field, 
   * if invalid property are provided, if this field has no writable property, or if updates to this field type is not supported.
   *
   * Refer to {@link FieldType} for supported field types, the write format for property, and other specifics for certain field types.
   *
   * @param property new property for the field.
   * @param options optional options to affect the behavior of the update.
   * @returns
   *
   * #### Example
   * ```js
   * function addOptionToSelectField(selectField, nameForNewOption) {
   *     const updatedOptions = {
   *         options: [
   *             ...selectField.options,
   *             {name: nameForNewOption},
   *         ]
   *     };
   *
   *     if (selectField.hasPermissionToUpdateOptions(updatedOptions)) {
   *         selectField.updateProperty(updatedOptions);
   *     }
   * }
   * ```
   */
  updateProperty(property: any, options?: IEffectOption): Promise<void> {
    const { error } = this.fieldEntity.validateUpdateOpenProperty(property, options);
    if (error) {
      throw new Error(JSON.stringify(error));
    }
    const updateProperty = this.fieldEntity.updateOpenFieldPropertyTransformProperty(property);
    let deleteBrotherField: boolean;
    // Two-way Link special fields, need to determine whether to delete the associated fields of the associated table
    if (this.type === FieldType.MagicLink) {
      const { conversion } = property as IUpdateOpenMagicLinkFieldProperty;
      deleteBrotherField = conversion === Conversion.Delete;
    }
    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.SetFieldAttr,
        datasheetId: this.datasheetId,
        fieldId: this.fieldData.id,
        deleteBrotherField,
        data: {
          ...this.fieldData,
          property: updateProperty
        }
      }, this.wCtx.id);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
      if (result.result === ExecuteResult.None) {
        throw new Error('update property method has been ignored');
      }
      resolve();
    });
  }

  /**
   * 
   * Checks whether the current user has permission to perform the given description update.
   * 
   * @param description new description for the field, Length limit 200.
   * @returns
   * 
   * #### Example
   * ``` js
   * const canUpdateFieldDescription = field.hasPermissionForUpdateDescription();
   * if (!canUpdateFieldDescription) {
   *   alert('not allowed!');
   * }
   * ```
   */
  hasPermissionForUpdateDescription(description?: string): boolean {
    if (description && description.length > 200) {
      return false;
    }
    return this.checkPermissionUpdateField().acceptable;
  }

  /**
   * 
   * Check whether the current user has permission to perform the given option update.
   * 
   * Property about the update write format, refer to {@link FieldType}.
   * 
   * @param property  new property for the field.
   * @returns
   * 
   * #### Example
   * ``` js
   * const canUpdateFieldProperty = field.hasPermissionForUpdateProperty();
   * if (!canUpdateFieldProperty) {
   *   alert('not allowed!');
   * }
   * ```
   */
  hasPermissionForUpdateProperty(property?: any): boolean {
    return this.checkPermissionForUpdateProperty(property).acceptable;
  }

  /**
   * Check whether the current user has permission to perform the given option update.
   * 
   * @param property new property for the field.
   * @returns
   * 
   * 
   * #### Description
   * Accepts partial input, in the same format as {@link updateProperty}.
   *
   * property about the update write format, refer to {@link FieldType}.
   * 
   * Returns `{acceptable: true}` if the current user can update the specified property.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check whether the current user has permission to perform the given property update, 
   * // when the update is accompanied by a write, it can also be verified at the same time.
   * const updatePropertyCheckResult = field.checkPermissionForUpdateProperty({
   *   defaultValue: '1',
   * });
   * if (!updatePropertyCheckResult.acceptable) {
   *   alert(updatePropertyCheckResult.message);
   * }
   *
   * // Check if user could potentially update a property.
   * // Use when you don't know the specific a property you want to update yet (for example,
   * // to show or hide UI controls that let you start update a property.)
   * const updatePropertyCheckResult =
   *   field.checkPermissionForUpdateProperty();
   * ```
   */
  checkPermissionForUpdateProperty(property?: any): IPermissionResult {
    const updateFieldPermissionResult = this.checkPermissionUpdateField();
    if (!updateFieldPermissionResult.acceptable) {
      return updateFieldPermissionResult;
    }
    if (!this.fieldEntity.propertyEditable()) {
      return errMsg(`No write access to ${this.fieldData.name}(${this.id}) column`);
    }
    if(property) {
      const { error } = this.fieldEntity.validateUpdateOpenProperty(property);
      if (error) {
        return errMsg(`
          ${this.fieldData.name}field, current write value  ${JSON.stringify(property)} format that does not match, please check:${error.message}
        `);
      }
    }
    return { acceptable: true };
  }

  /**
   * @hidden
   * For fields that are not lookup, entityType === type.
   */
  get entityType(): FieldType {
    if (this.type === FieldType.MagicLookUp) {
      const lookUpEntityField = (this.fieldEntity as LookUpField).getLookUpEntityField();
      if (!lookUpEntityField) return FieldType.NotSupport;
      return getFieldTypeString(lookUpEntityField.type) as any as FieldType;
    }
    return this.type;
  }

  /**
   * @hidden
   * Base type of field values.
   */
  get basicValueType(): BasicValueType {
    return this.fieldEntity.basicValueType;
  }

  /**
   * @hidden
   * Some fields have formatting, get the formatting type.
   */
  get formatType(): IFormatType {
    switch (this.type) {
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime:
        const { dateFormat, timeFormat, includeTime } = this.fieldData.property as IDateTimeFieldProperty;
        return {
          type: 'datetime',
          formatting: { dateFormat, timeFormat, includeTime },
        };
      case FieldType.Number: {
        const { precision, commaStyle } = this.fieldData.property as INumberFieldProperty;
        return {
          type: 'number',
          formatting: { precision, commaStyle },
        };
      }
      case FieldType.Currency: 
        const { symbol, precision } = this.fieldData.property as ICurrencyFieldProperty;
        return {
          type: 'currency',
          formatting: { symbol, precision },
        };
      case FieldType.Percent:
        return {
          type: 'percent',
          formatting: { precision: (this.fieldData.property as ICurrencyFieldProperty).precision },
        };
      case FieldType.Formula:
      case FieldType.MagicLookUp:
        if (!(this.fieldData.property?.formatting)) return null;
        switch (this.fieldEntity.valueType) {
          case BasicValueType.Number:
            const { symbol, precision, formatType } = this.fieldData.property.formatting as INumberFormatFieldProperty;
            switch (formatType) {
              case CoreFieldType.Number:
                return {
                  type: 'number',
                  formatting: { precision },
                };
              case CoreFieldType.Percent:
                return {
                  type: 'percent',
                  formatting: { precision },
                };
              case CoreFieldType.Currency:
                return {
                  type: 'currency',
                  formatting: { symbol, precision },
                };
              default:
                return null;
            }
          case BasicValueType.DateTime:
            const { dateFormat, timeFormat, includeTime } = this.fieldData.property.formatting as IDateTimeFieldProperty;
            return {
              type: 'datetime',
              formatting: { dateFormat, timeFormat, includeTime },
            };
          default:
            return null;
        }
    }
    return null;
  }
  /**
   * @hidden
   * Attempts to convert data of string type to when compatible with the data type of the current field.
   * 
   * If it is not compatible, it returns null.
   *
   * @param string The string to parse.
   * #### Example
   * ```js
   * const inputString = '42';
   * const cellValue = myNumberField.convertStringToCellValue(inputString);
   * console.log(cellValue === 42);
   * // => true
   * ```
   */
  convertStringToCellValue(string: string): any {
    const stdValue = {
      sourceType: CoreFieldType.Text,
      data: [{ text: string }],
    };
    return this.fieldEntity.stdValueToCellValue(stdValue);
  }

  /**
   * @hidden
   */
  convertCellValueToString(cv: any): string | null {
    let _cv = cv;
    if (this.basicValueType === BasicValueType.Array) {
      _cv = _cv == null ? null : [cv].flat();
    }
    return this.fieldEntity.cellValueToString(_cv, { datasheetId: this.datasheetId });
  }

  /**
   * @hidden
   */
  getFieldResultByStatType(statType: StatType, records: Record[]) {
    const recordIds = records.map(record => record.id);
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const snapshot = Selectors.getSnapshot(state, this.datasheetId)!;
    return getFieldResultByStatType(statType, recordIds, this.fieldData, snapshot, state);
  }

  /**
   * @hidden
   */
  statType2text(type: StatType) {
    return this.fieldEntity.statType2text(type);
  }

  /**
   * @hidden
   */
  get statTypeList() {
    return this.fieldEntity.statTypeList;
  }
}
