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
import { IReduxState } from 'exports/store';
import Joi from 'joi';
import { isEqual } from 'lodash';
import { getColorNames } from 'model/color';
import type { IBindFieldContext, IBindFieldModel } from 'model/field';
import { getFieldTypeString } from 'model/utils';
import { getViewsList } from 'modules/database/store/selectors/resource/datasheet/base';
import { getPermissions } from 'modules/database/store/selectors/resource/datasheet/calc';
import type { IAPIMetaFieldProperty } from 'types/field_api_property_types';
import type { IAPIMetaField } from 'types/field_api_types';
import { BasicValueType, FieldType, IField, IFieldProperty, IStandardValue } from 'types/field_types';
import { BasicOpenValueType } from 'types/field_types_open';
import type { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import type { IAddOpenFieldProperty, IEffectOption, IUpdateOpenFieldProperty } from 'types/open/open_field_write_types';
import type { IOpenFilterValue } from 'types/open/open_filter_types';
import type { IJsonSchema } from 'types/utils';
import { FOperator, FOperatorDescMap, IFilterCondition } from 'types/view_types';
import type { ICellToStringOption, ICellValue } from '../record';
import { StatTranslate, StatType } from './stat';
import { joiErrorResult } from './validate_schema';

// China sensitive string comparison `collators` constructor.
export const zhIntlCollator = typeof Intl !== 'undefined' ? new Intl.Collator('zh-CN') : undefined;
/**
 * The business class should not become a complex container, it is better to be just a pipeline of data flow
 * Here we use the form of classes to build business calculation methods,
 * but do not use new to initialize directly, but only bind the data that needs to be processed to the instance, and leave after use.
 * Suppose we want to call cellValueToString
 *
 * Example:
 * const field: ITextField = // Assuming there is a column attribute data for a text column;
 * const value = Field.bindContext(field, state).cellValueToString();
 *
 * As you can see, every time you use the methods on the Field class,
 * you only need bindContext for data binding, and then call the calculation method to get the desired return value.
 * No need to hold a concrete Field instance. This is very useful when we use it with redux immutable data.
 * Because immutable data is managed by reducer, it may be updated at any time, and we cannot hold data in our method class,
 * Instead, get the latest data from the latest state every time you use it to participate in the calculation.
 */
export abstract class Field {
  // static bindModel: IBindFieldModel;
  static bindContext: IBindFieldContext;

  static bindModel: IBindFieldModel;

  constructor(public field: IField, public state: IReduxState) { }

  /**
    * Field Property returned by Field Meta API. Unlike the interface used internally, the API exposes the transformed result.
    * - More friendly information, number enum to string.
    * - Eliminate unnecessary exposed field information
    */
  abstract get apiMetaProperty(): IAPIMetaFieldProperty | null;

  /**
    * Each field has its own openValue for use in the widget SDK, robot variables and subsequent open scenarios.
    * This is open to developers and will do some processing on cellValue.
    * This method describes the structure of the field openValue. Currently used in robot variables.
    */
  abstract get openValueJsonSchema(): IJsonSchema;

  /**
   * cellValue is converted to the value used in the external call
   * (the event will contain the original value and the converted value, mainly exposed to external developers, automation, widget-sdk)
   * @param cellValue
   */
  abstract cellValueToOpenValue(cellValue: ICellValue): BasicOpenValueType | null;

  /**
   * openWriteValue is converted to cellValue (mainly exposed to external developers, automation, widget-sdk write data)
   * @param openWriteValue
   */
  abstract openWriteValueToCellValue(openWriteValue: any): ICellValue;

  /**
   * the meta information of API return fields
   *
   * @param dstId
   * @returns
   */
  getApiMeta(dstId?: string): IAPIMetaField {
    const views = getViewsList(this.state, dstId);
    const firstFieldId = views[0]!.columns[0]!.fieldId;

    const res: IAPIMetaField = {
      id: this.field.id,
      name: this.field.name,
      type: getFieldTypeString(this.field.type),
      property: this.apiMetaProperty || undefined,
      editable: this.recordEditable(),
    };
    if (this.field.id === firstFieldId) {
      res.isPrimary = true;
    }
    if (this.field.desc) {
      res.desc = this.field.desc;
    }
    return res;
  }

  // not includes basic value type in Array
  get valueType(): Omit<BasicValueType, BasicValueType.Array> {
    if (this.basicValueType === BasicValueType.Array) {
      return this.innerBasicValueType;
    }
    return this.basicValueType;
  }

  // default String, Array type field override
  get innerBasicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  showFOperatorDesc(type: FOperator) {
    return FOperatorDescMap[type];
  }

  /**
   * whether the field support grouping
   */
  get canGroup(): boolean {
    return true;
  }

  /**
   * whether the calc field error
   */
  get hasError(): boolean {
    return false;
  }

  /**
   * whether the field can be filter
   */
  get canFilter(): boolean {
    return true;
  }

  /**
   * calc field exception info
   */
  get warnText(): string {
    return '';
  }

  /**
   * current field analytic bar options
   */
  get statTypeList(): StatType[] {
    return [
      StatType.None,
      StatType.CountAll,
      StatType.Empty,
      StatType.Filled,
      StatType.Unique,
      StatType.PercentEmpty,
      StatType.PercentFilled,
      StatType.PercentUnique,
    ];
  }

  /**
   * current field cell value's basic types.
   */
  abstract get basicValueType(): BasicValueType;

  /**
   * current operator types that fieldType support, and the order in the dropdown box
   * every heritage field must be implemented
   */
  abstract get acceptFilterOperators(): FOperator[];

  /**
   * The value of each cell is calculated through the field record relationship in the snapshot.
   * But the calculation here refers to fields such as LookUp, RollUp, Formula, etc.
   * The calculation of the cell value depends on the value of other basic cells.
   * Such fields are called "calculated fields" and need to override this method.
   * @readonly
   * @memberof Field
   */
  get isComputed() {
    return false;
  }

  /**
   * judge the filter, which FieldType belongs to?
   *
   * @template T
   * @param {T} t
   * @param {IFilterCondition<FieldType>} v
   * @returns {v is Extract<IFilterCondition<T>, IFilterCondition<FieldType>>}
   * @memberof Field
   */
  static isFilterBelongFieldType<T extends FieldType>(
    t: T,
    v: IFilterCondition<FieldType>,
  ): v is Extract<IFilterCondition<T>, IFilterCondition<FieldType>> {
    return v.fieldType === t;
  }

  isEmptyOrNot(operator: FOperator.IsEmpty | FOperator.IsNotEmpty, cellValue: ICellValue) {
    switch (operator) {
      /**
       * The logic of isEmpty and isNotEmpty is basically common use
       */
      case FOperator.IsEmpty: {
        return cellValue == null;
      }

      case FOperator.IsNotEmpty: {
        return cellValue != null;
      }

      default: {
        throw new Error('compare operator type error');
      }
    }
  }

  /**
   * Whether the current field can be edited
   * Not all fields allow users to edit. If it is a calculated field, such as rollUp, lookup, formula fields, users are not allowed to edit
   * In addition, related fields are only allowed to be edited
   * if the user has the editing permission of the table associated with the current related field.
   */
  recordEditable(datasheetId?: string, mirrorId?: string): boolean {
    return getPermissions(this.state, datasheetId, this.field.id, mirrorId).cellEditable;
  }

  /**
   * Whether the properties of the current field are allowed to be edited
   * Here it is judged according to the permission factor, and the edit field is allowed to be true.
   */
  propertyEditable(): boolean {
    return getPermissions(this.state, undefined, this.field.id).fieldPropertyEditable;
  }

  /**
   * compare two cell value whether equal
   * by default, use deep comparison,
   * complicated cell value need to override this method
   *
   * TODO: make the logic of `eq` and the logic of `compare` together, delete `eq`
   *
   */
  eq(cv1: ICellValue, cv2: ICellValue): boolean {
    return isEqual(cv1, cv2);
  }

  /**
   * on this field, compare 2 cell value size, for sorting
   * by default, compare with string conversion, if not, please implement it yourself.
   * @orderInCellValueSensitive {boolean}
   * when grouping, the sort of cells are insensitive, grouping them together.
   * when sorting, the sort of cells are sensitive.
   * when testing, multiple-choices, members, relations keep same logic.
   * @returns {number} negative number => smaller than | 0 => equals | positive number => larger than
   */
  compare(cellValue1: ICellValue, cellValue2: ICellValue, orderInCellValueSensitive?: boolean): number {
    if (this.eq(cellValue1, cellValue2)) {
      return 0;
    }
    if (cellValue1 == null) {
      return -1;
    }
    if (cellValue2 == null) {
      return 1;
    }

    let str1 = this.cellValueToString(cellValue1, { orderInCellValueSensitive });
    let str2 = this.cellValueToString(cellValue2, { orderInCellValueSensitive });

    if (str1 === str2) {
      return 0;
    }
    if (str1 == null) {
      return -1;
    }
    if (str2 == null) {
      return 1;
    }

    str1 = str1.trim();
    str2 = str2.trim();

    // test pinyin sort
    return str1 === str2 ? 0 :
      zhIntlCollator ? zhIntlCollator.compare(str1, str2) : (str1.localeCompare(str2, 'zh-CN') > 0 ? 1 : -1);
  }

  /**
   *
   * beside the operator calc function  that check whether empty,
   * other functions need to implement themselves
   * when no inheritance is needed, the default is true, which means no filtering
   *
   */
  isMeetFilter(operator: FOperator, cellValue: ICellValue, _: IFilterCondition['value']) {
    switch (operator) {
      case FOperator.IsEmpty:
      case FOperator.IsNotEmpty: {
        return this.isEmptyOrNot(operator, cellValue);
      }
      default: {
        console.warn('Method should be overwrite!');
        return true;
      }
    }
  }

  protected stringInclude(str: string, searchStr: string) {
    return str.toLowerCase().includes(searchStr.trim().toLowerCase());
  }

  abstract cellValueToString(cellValue: ICellValue, cellToStringOption?: ICellToStringOption): string | null;

  // used for copy-paste/type conversion before getting a new record, according to the
  // Data fills the properties in Field, such as options in single/multi
  enrichProperty(_stdVals: IStandardValue[]): IFieldProperty {
    return this.field.property;
  }

  abstract cellValueToStdValue(cellValue: ICellValue | null): IStandardValue;

  /**
   * Convert to standard output of the api
   * @param cellValue
   */
  abstract cellValueToApiStandardValue(cellValue: ICellValue): any;

  /**
   * Convert to the output the user sees in the table
   * @param cellValue
   */
  abstract cellValueToApiStringValue(cellValue: ICellValue): string | null;

  abstract stdValueToCellValue(stdValue: IStandardValue): ICellValue | null;

  abstract validate(value: any): boolean;

  /* check property value */
  abstract validateProperty(): Joi.ValidationResult;

  /**
   * Each column type corresponds to a data format.
   * By checking the data format, it is determined whether the data written to the cell is as expected
   * @returns {Joi.ValidationResult}
   */
  abstract validateCellValue(cellValue: ICellValue): Joi.ValidationResult;

  /**
   * Each column type corresponds to a data format.
   * By checking the data format, it is determined whether the data written to the cell is as expected
   * @returns {Joi.ValidationResult}
   */
  abstract validateOpenWriteValue(openWriteValue: any): Joi.ValidationResult;

  /**
   * Whether to multi-select fields of value type.
   * For multiple selections, the collaborator field will return true.
   * NOTE: Fields that are guaranteed to return true, value is an array.
   */
  isMultiValueField(): boolean {
    return false;
  }

  abstract defaultValueForCondition(
    condition: IFilterCondition,
  ): ICellValue;

  /**
   * Returns the default value of the field attribute configuration when adding a record
   */
  defaultValue(): ICellValue {
    return null;
  }

  /**
   * @description convert the statistical parameters into Chinese/English
   */
  statType2text(type: StatType): string {
    const result = StatTranslate[type];
    return result;
  }

  /**
   * Get property (widget, robot, api)
   */
  get openFieldProperty(): IOpenFieldProperty {
    return null;
  }

  /**
   * Check update field property
   * @returns {Joi.ValidationResult}
   */
  validateUpdateOpenProperty(_updateProperty: IUpdateOpenFieldProperty, _effectOption?: IEffectOption): Joi.ValidationResult {
    return joiErrorResult(`${getFieldTypeString(this.field.type)} not support set property`);
  }

  /**
   * Return field information externally
   * @param dstId
   */
  getOpenField(dstId?: string): IOpenField {
    const views = getViewsList(this.state, dstId);
    const firstFieldId = views[0]!.columns[0]!.fieldId;
    const { id, name, desc: description, type, required } = this.field;
    const res: IOpenField = {
      id,
      name,
      description,
      type: getFieldTypeString(type),
      property: this.openFieldProperty,
      editable: this.recordEditable(),
      required
    };
    if (this.field.id === firstFieldId) {
      res.isPrimary = true;
    }
    return res;
  }

  /**
   * Check the property when creating the field
   */
  validateAddOpenFieldProperty(addProperty: IAddOpenFieldProperty, isBackend: boolean = false): Joi.ValidationResult {
    return this.validateUpdateOpenProperty(addProperty, isBackend ? { isBackend } : undefined);
  }

  /**
   * Check whether the delete field parameter is qualified
   * @param deleteFieldSchema delete field parameter
   */
  validateOpenDeleteField(deleteFieldSchema: any): Joi.ValidationResult {
    return Joi.object({
      id: Joi.string().required(),
      conversion: Joi.boolean(),
    }).required().validate(deleteFieldSchema);
  }

  /**
   *
   * For the time being, all fields are created and updated the same,
   * except that there is an additional conversion when the associated field is updated, so the conversion at the time of update is used directly
   *
   * Add a new field to convert the incoming property into a structure that can be sent with cmd
   * Note: This step will not verify the incoming parameters, and the verification is passed by default
   * @param openFieldProperty
   */
  addOpenFieldPropertyTransformProperty(addOpenFieldProperty: IAddOpenFieldProperty): IFieldProperty {
    return this.updateOpenFieldPropertyTransformProperty(addOpenFieldProperty);
  }

  /**
   * Update the field properties and convert the incoming property into a structure that can be sent with cmd
   * Note: This step will not verify the incoming parameters, and the verification is passed by default
   * @param openFieldProperty
   */
  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenFieldProperty): IFieldProperty {
    return openFieldProperty;
  }

  /**
   * Converting internal filter structures to external data structures.
   * @param _value
   */
  filterValueToOpenFilterValue(_value: any): IOpenFilterValue {
    throw new Error(`${getFieldTypeString(this.field.type)} not support filterValueToOpenFilterValue`);
  }

  /**
   * Converting external filter structures to internal data structures.
   * @param value
   */
  openFilterValueToFilterValue(_value: IOpenFilterValue): any {
    throw new Error(`${getFieldTypeString(this.field.type)} not support filterValueToOpenFilterValue`);
  }

  /**
   * Verify that the incoming external filter data structure is secure.
   * @param value
   */
  validateOpenFilterValue(_value: IOpenFilterValue): Joi.ValidationResult {
    return joiErrorResult(`${getFieldTypeString(this.field.type)} not support validateOpenFilterValue`);
  }

  /**
   * Convert the obtained color name to color number
   * @param name color name
   */
  getOptionColorNumberByName(name: string) {
    const colorNames = getColorNames();
    const colorNum = colorNames.findIndex(colorName => colorName === name);
    return colorNum > -1 ? colorNum : undefined;
  }
}

