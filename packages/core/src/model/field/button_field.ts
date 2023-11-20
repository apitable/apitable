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

import { DatasheetActions } from 'commands_actions/datasheet';
import Joi from 'joi';
import { Field } from 'model/field/field';
import { ICellToStringOption, ICellValue } from 'model/record';
import { Strings, t } from 'exports/i18n';
import { IReduxState } from 'exports/store';
import {
  APIMetaButtonActionType, BasicOpenValueType,
  BasicValueType,
  ButtonActionType,
  ButtonStyleType,
  CollectType,
  FieldType, FOperator,
  IAPIMetaButtonFieldProperty,
  IButtonField,
  IField, IFilterCondition,
  IStandardValue,
} from 'types';
import { joiErrorResult } from './validate_schema';

export class ButtonField extends Field {
  constructor(
    public override field: IButtonField,
    public override state: IReduxState,
  ) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    text: Joi.string().required(),
    style: Joi.object({
      type: Joi.number().valid(ButtonStyleType.Background, ButtonStyleType.OnlyText),
      color: Joi.number().integer().min(0).required(),
    }).required(),
    action: Joi.object({
      type: Joi.number().valid(ButtonActionType.OpenLink, ButtonActionType.TriggerAutomation),
      expression: Joi.string().when('type', { is: ButtonActionType.OpenLink, then: Joi.string().allow('').required() }),
      automationId: Joi.string().when('type', {
        is: ButtonActionType.TriggerAutomation,
        then: Joi.string()
          .pattern(/^aut.+/, 'automationId')
          .required(),
      }),
      triggerId: Joi.string().pattern(/^atr.+/, 'triggerId'),
    }).required(),
  }).required();

  override get apiMetaProperty(): IAPIMetaButtonFieldProperty {
    return {
      action: {
        ...this.field.property.action,
        type: this.field.property.action.type == ButtonActionType.TriggerAutomation
          ? APIMetaButtonActionType.TriggerAutomation : APIMetaButtonActionType.OpenLink,
      }
    };
  }

  get openValueJsonSchema() {
    return {};
  }

  static defaultProperty() {
    return {
      text: t(Strings.button_text_click_start),
      style: {
        type: ButtonStyleType.Background,
        color: 1
      },
      action: {
        type: ButtonActionType.OpenLink,
        expression: ''
      }
    };
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IButtonField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Button,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  override get isComputed() {
    return true;
  }

  override get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override recordEditable() {
    return false;
  }

  override stdValueToCellValue(): null {
    return null;
  }

  override validate(_cv: ICellValue) {
    return true;
  }

  validateProperty() {
    return ButtonField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  static openUpdatePropertySchema = Joi.object({
    collectType: Joi.number().valid(CollectType.AllFields, CollectType.SpecifiedFields),
    fieldIdCollection: Joi.array().items(Joi.string()),
  }).required();

  public get acceptFilterOperators(): FOperator[] {
    return [];
  }

  public cellValueToApiStandardValue(_cellValue: ICellValue): any {
    return null;
  }

  public cellValueToApiStringValue(_cellValue: ICellValue): string | null {
    return null;
  }

  public cellValueToOpenValue(_cellValue: ICellValue): BasicOpenValueType | null {
    return null;
  }

  public cellValueToStdValue(_ellValue: ICellValue | null): IStandardValue {
    return {
      sourceType: FieldType.Button,
      data: [],
    };
  }

  public cellValueToString(_cellValue: ICellValue, _cellToStringOption?: ICellToStringOption): string | null {
    return null;
  }

  public defaultValueForCondition(_condition: IFilterCondition): ICellValue {
    return null;
  }

  public openWriteValueToCellValue(_openWriteValue: any): ICellValue {
    return null;
  }
}
