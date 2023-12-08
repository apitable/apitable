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
import { Strings, t } from 'exports/i18n';
import { IReduxState } from 'exports/store/interfaces';
import Joi from 'joi';
import { pick } from 'lodash';
import { getFieldOptionColor } from 'model/color';
import { ICellToStringOption, ICellValue } from 'model/record';
import {
  BasicOpenValueType,
  BasicValueType,
  ButtonActionType,
  ButtonFieldActionNameEnum,
  ButtonFieldActionOpenLinkNameEnum,
  ButtonFieldStyleNameEnum,
  ButtonStyleType,
  FieldType,
  FOperator,
  IAddOpenButtonFieldProperty,
  IAPIMetaButtonFieldProperty,
  IButtonField,
  IButtonProperty,
  IField,
  IFilterCondition,
  IStandardValue,
  OpenLinkType,
} from 'types';
import { getFieldDefaultProperty } from './const';
import { Field } from './field';
import { datasheetIdString, joiErrorResult } from './validate_schema';

export const AutomationConstant = {
  DEFAULT_TEXT: t(Strings.click_start),
  defaultColor: 40,
};

export class ButtonField extends Field {
  constructor(
    public override field: IButtonField,
    public override state: IReduxState,
  ) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    text: Joi.string().required(),
    style: Joi.object({
      type: Joi.number().valid(ButtonStyleType.Background, ButtonStyleType.OnlyText),
      color: Joi.number().integer().min(0).required(),
    }).required(),
    action: Joi.object({
      type: Joi.number().valid(ButtonActionType.OpenLink, ButtonActionType.TriggerAutomation),
      openLink: Joi.object({
        type: Joi.number().valid(OpenLinkType.Url, OpenLinkType.Expression),
        expression: Joi.string().when('type', { is: ButtonActionType.OpenLink, then: Joi.string().allow('').required() }),
      }),
      automation: Joi.object({
        automationId: Joi.string().when('type', {
          is: ButtonActionType.TriggerAutomation,
          then: Joi.string()
            .pattern(/^aut.+/, 'automationId')
            .required(),
        }),
        triggerId: Joi.string().pattern(/^atr.+/, 'triggerId'),
      }),
    }).required(),
  }).required();

  static openUpdatePropertySchema = Joi.object({
    text: Joi.string(),
    style: Joi.object({
      type: Joi.number().valid(ButtonFieldStyleNameEnum.Background, ButtonFieldStyleNameEnum.OnlyText),
      color: Joi.object({
        name: Joi.string(),
        value: Joi.string()
      }),
    }),
    action: Joi.object({
      type: Joi.string().valid(ButtonFieldActionNameEnum.OpenLink),
      openLink: Joi.object({
        type: Joi.number().valid(ButtonFieldActionOpenLinkNameEnum.Url, ButtonFieldActionOpenLinkNameEnum.Expression).required(),
        expression: Joi.string().when('type', { is: ButtonFieldActionOpenLinkNameEnum.Url, then: Joi.string().allow('').required() }),
      }),
    }),
  }).required();

  override get apiMetaProperty(): IAPIMetaButtonFieldProperty {
    const property = this.field.property;
    const apiProperty = {
      text: property.text,
      style: {
        type: property.style.type === ButtonStyleType.OnlyText ? ButtonFieldStyleNameEnum.OnlyText : ButtonFieldStyleNameEnum.Background,
        color: getFieldOptionColor(property.style.color),
      },
      action: {}
    } as IAPIMetaButtonFieldProperty;
  
    if (property.action) {
      const action = {} as any;
      if (property.action.type) {
        action.type = property.action.type === ButtonActionType.TriggerAutomation
          ? ButtonFieldActionNameEnum.TriggerAutomation : ButtonFieldActionNameEnum.OpenLink;
      }
      if (property.action.openLink) {
        action.openLink = {
          type: property.action.openLink.type === OpenLinkType.Url
            ? ButtonFieldActionOpenLinkNameEnum.Url : ButtonFieldActionOpenLinkNameEnum.Expression,
          expression: property.action.openLink.expression
        };
      }
      if (property.action.automation) {
        action.automation = property.action.automation;
      }
      apiProperty.action = action;
    }
    return apiProperty;
  }

  override get canGroup(): boolean {
    return false;
  }

  override get canFilter(): boolean {
    return false;
  }

  get openValueJsonSchema() {
    return {
      type: 'string',
      title: this.field.name,
    };
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Button) as IButtonProperty;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IButtonField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Button,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  cellValueToArray(cellValue: ICellValue): string[] | null {
    if (this.validate(cellValue)) {
      return [this.field.property.text];
    }
    return null;
  }

  arrayValueToString(): string | null {
    return this.field.property.text;
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
    const newProperty = pick(this.field.property,
      'datasheetId',
      'text',
      'style',
      'action',
    );
    return ButtonField.propertySchema.validate(newProperty);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

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
    return this.field.property.text;
  }

  public cellValueToStdValue(_ellValue: ICellValue | null): IStandardValue {
    return {
      sourceType: FieldType.Button,
      data: [],
    };
  }

  public cellValueToString(_cellValue: ICellValue, _cellToStringOption?: ICellToStringOption): string | null {
    return this.field.property.text;
  }

  public defaultValueForCondition(_condition: IFilterCondition): ICellValue {
    return null;
  }

  public openWriteValueToCellValue(_openWriteValue: any): ICellValue {
    return null;
  }

  override validateAddOpenFieldProperty(updateProperty: IAddOpenButtonFieldProperty) {
    if (updateProperty === null) {
      return { error: undefined, value: null };
    }
    return ButtonField.openUpdatePropertySchema.validate(updateProperty);
  }

  override addOpenFieldPropertyTransformProperty(openFieldProperty: IAddOpenButtonFieldProperty): IButtonProperty {
    const defaultProperty = ButtonField.defaultProperty();
    if (!openFieldProperty) {
      return defaultProperty;
    }
    if (openFieldProperty.text) {
      defaultProperty.text = openFieldProperty.text;
    }
    defaultProperty.style.type = this.getStyleTypeByName(openFieldProperty.style?.type);
    if (openFieldProperty.style && openFieldProperty.style.color) {
      const color = this.getOptionColorNumberByName(openFieldProperty.style.color.name);
      if (color) {
        defaultProperty.style.color = color;
      }
    }
    if (openFieldProperty.action && openFieldProperty.action.type === ButtonFieldActionNameEnum.OpenLink) {
      defaultProperty.action.type = ButtonActionType.OpenLink;
      const openLink: {
        type: OpenLinkType;
        expression: string;
      } = {} as any;
      if (openFieldProperty.action.openLink && openFieldProperty.action.openLink.type) {
        openLink.type = this.getOpenLinkTypeByName(openFieldProperty.action.openLink?.type);
      }
      if (openFieldProperty.action.openLink && openFieldProperty.action.openLink.expression) {
        openLink.expression = openFieldProperty.action.openLink.expression;
      }
      defaultProperty.action.openLink = openLink;
    }
    return defaultProperty;
  }

  getStyleTypeByName(name?: string) {
    if(name === ButtonFieldStyleNameEnum.Background) {
      return ButtonStyleType.Background;
    }
    if(name === ButtonFieldStyleNameEnum.OnlyText) {
      return ButtonStyleType.OnlyText;
    }
    return ButtonStyleType.Background;
  }

  getOpenLinkTypeByName(name?: string) {
    if(name === ButtonFieldActionOpenLinkNameEnum.Url) {
      return OpenLinkType.Url;
    }
    if(name === ButtonFieldActionOpenLinkNameEnum.Expression) {
      return OpenLinkType.Expression;
    }
    return OpenLinkType.Url;
  }
}
