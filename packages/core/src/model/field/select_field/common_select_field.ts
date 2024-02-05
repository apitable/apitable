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
import { difference, has, isString, keyBy, memoize, range } from 'lodash';
import { getFieldOptionColor } from 'model/color';
import { IAPIMetaSingleSelectFieldProperty } from 'types/field_api_property_types';
import { FieldType, IMultiSelectedIds, ISelectField, ISelectFieldOption, ISelectFieldProperty, IStandardValue } from 'types/field_types';
import { IOpenSelectBaseFieldProperty } from 'types/open/open_field_read_types';
import { IEffectOption, IWriteOpenSelectBaseFieldProperty } from 'types/open/open_field_write_types';
import { getNewId, IDPrefix, isSelectType } from 'utils';
import { getFieldDefaultProperty } from '../const';
import { Field } from '../field';
import { joiErrorResult } from '../validate_schema';

const EFFECTIVE_OPTION_ID_LENGTH = 13;
export const isOptionId = (optionId: string) => {
  return optionId && optionId.startsWith('opt') && optionId.length === EFFECTIVE_OPTION_ID_LENGTH;
};

export abstract class SelectField extends Field {

  constructor(public override field: ISelectField, state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      color: Joi.number().integer().min(0).required(),
    })).required(),
    defaultValue: Joi.custom((_prototype, helpers) => {
      if (helpers.prefs['context']?.['fieldType'] === FieldType.SingleSelect) {
        return Joi.string();
      }
      return Joi.array().items(Joi.string());
    })
  }).required();

  static defaultProperty(): ISelectFieldProperty {
    return getFieldDefaultProperty(FieldType.SingleSelect) as ISelectFieldProperty;
  }

  get apiMetaProperty(): IAPIMetaSingleSelectFieldProperty {
    const options = this.field.property.options.map(option => {
      return {
        id: option.id,
        name: option.name,
        color: getFieldOptionColor(option.color),
      };
    });
    return { options };
  }

  validateProperty(): Joi.ValidationResult {
    return SelectField.propertySchema.validate(this.field.property, { context: {
      fieldType: this.field.type,
    } });
  }

  static _createNewOption(option: { name: string, color?: number }, existOptions: ISelectFieldOption[]) {
    const optionId = getNewId(IDPrefix.Option, existOptions.map(op => op.id));
    return {
      id: optionId,
      color: option.color || getOptionColor(existOptions.map(op => op.color)),
      name: option.name,
    };
  }

  static _getOption(option: { name: string, color?: number }, existOptions: ISelectFieldOption[]) {
    for (const opt of existOptions) {
      const exist = option.color ? opt.name === option.name && opt.color === option.color : opt.name === option.name;
      if (exist) {
        return opt;
      }
    }
    return;
  }

  static getOrCreateNewOption(option: { name: string, color?: number }, existOptions: ISelectFieldOption[]): {
    option: ISelectFieldOption,
    isCreated: boolean
  } {
    // get exist
    const opt = SelectField._getOption(option, existOptions);
    if (opt) {
      return {
        option: opt,
        isCreated: false,
      };
    }
    // create not exist
    const newOption = SelectField._createNewOption(option, existOptions);
    return {
      option: newOption,
      isCreated: true,
    };
  }

  createNewOption(name: string, color?: number): ISelectFieldOption {
    return SelectField._createNewOption({ name, color }, this.field.property.options);
  }

  /**
   * add new option to singleSelect
   *
   * @param {string} name
   * @memberof SingleSelectField
   */
  addOption(name: string, color?: number) {
    const option = this.createNewOption(name, color);
    this.field.property.options.push(option);
    return option.id;
  }

  /**
   * find option by name
   * @param {string} name
   * @returns
   * @memberof SingleSelectField
   */
  findOptionByName(name: string) {
    return this.field.property.options.find(option => option.name === name) || null;
  }

  findOptionById(id: string): ISelectFieldOption | null {
    return this.field.property.options.find(option => option.id === id) || null;
  }

  getOption(index: number) {
    return this.field.property.options[index];
  }

  getMapOption = memoize((options: ISelectFieldOption[]) => {
    const mapOptions: Map<string, number> = new Map();
    options.forEach((op, index) => {
      mapOptions.set(op.id, index);
    });
    return mapOptions;
  });

  override compare(
    cellValue1: string | string[] | null,
    cellValue2: string | string[] | null,
  ): number {
    if (cellValue1 === cellValue2) {
      return 0;
    }
    if (cellValue1 === null) {
      return 1;
    }
    if (cellValue2 === null) {
      return -1;
    }
    const arr1 = Array.isArray(cellValue1) ? cellValue1 : [cellValue1];
    const arr2 = Array.isArray(cellValue2) ? cellValue2 : [cellValue2];
    const maxLen = Math.max(arr1.length, arr2.length);

    const mapOptions = this.getMapOption(this.field.property.options);
    for (let i = 0; i < maxLen; i++) {
      if (!arr1[i]) {
        return -1;
      }
      if (!arr2[i]) {
        return 1;
      }
      const index1 = mapOptions.get(arr1[i]!) as number;
      const index2 = mapOptions.get(arr2[i]!) as number;
      if (index1 !== index2) {
        return index1 > index2 ? 1 : -1;
      }
    }

    return 0;
  }

  // Modify the current property according to StandardValue
  override enrichProperty(stdVals: IStandardValue[]): ISelectFieldProperty {
    if (!this.propertyEditable()) {
      // Filling non-existent values for single and multiple selection will be enriched by default,
      // but if there is no manageable permission for the node, enrich will report an error
      // In addition, considering the column permissions, if there is no column editing permission,
      // the user must not be manageable by the node, so there is no need to check the column permissions.
      return this.field.property;
    }
    // The two maps are because there are multiple options corresponding to one id
    const options = [...this.field.property.options];
    const optionColor = options.map(op => op.color);
    const optionNameMap = keyBy(this.field.property.options, 'name');
    const optionIdMap = keyBy(this.field.property.options, 'id');
    for (const stdVal of stdVals) {
      const sourceType = stdVal && stdVal.sourceType;
      const isSelect2Multi = isSelectType(sourceType) &&
        this.field.type === FieldType.MultiSelect;
      const data = stdVal && stdVal.data;
      if (!data || data.length === 0) {
        continue;
      }
      data.forEach(d => {
        const { text, id } = d;
        let textList;
        if (isSelect2Multi) {
          textList = [text];
        } else {
          textList = this.field.type === FieldType.MultiSelect ? text.split(/, ?/) : [text];
        }
        textList.forEach(text => {
          const existOption = optionNameMap[text];
          // TODO: reuse ID and Color
          // When there is a creation option, two cases with the same option have id, such as the color field added later
          if (isString(text) && !existOption) {
            const newColor = getOptionColor(optionColor);
            const option = this.createNewOption(text, newColor);
            if (id) {
              // Create one more option, there may be duplicate text
              // Subsequent reuse of color, such as option.color = color
              option.id = id;
            }
            options.push(option);
            optionNameMap[text] = option;
            optionIdMap[id] = option;
            optionColor.push(newColor);
          }
        });
      });
    }
    // Keep the property of the current column, options are overwritten
    return { ...this.field.property, options: this.filterBlankOption(options) };
  }

  filterBlankOption(options: ISelectFieldOption[]) {
    return options.filter(item => item.name.trim().length);
  }

  override get openFieldProperty(): IOpenSelectBaseFieldProperty {
    const { defaultValue } = this.field.property;
    const options = this.field.property.options.map(option => {
      return {
        id: option.id,
        name: option.name,
        color: getFieldOptionColor(option.color),
      };
    });
    return { options, defaultValue };
  }

  static openUpdatePropertySchema = Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.string(),
      name: Joi.string().required(),
      color: Joi.string(),
    })).required(),
  }).required();

  validateWriteOpenOptionsEffect(updateProperty: IWriteOpenSelectBaseFieldProperty, effectOption?: IEffectOption): Joi.ValidationResult {
    // Not allowed to pass option parameter with ID but no color
    if (updateProperty.options.some(option => option.id && !has(option, 'color'))) {
      return joiErrorResult('Option object is not supported. It has id but no color');
    }
    // Check if this update removes options
    const updateOptionIds = updateProperty.options.map(option => option.id);
    const isDeleteOption = this.field.property.options.some(option => !updateOptionIds.includes(option.id));
    if (isDeleteOption && !effectOption?.enableSelectOptionDelete) {
      return joiErrorResult('Removing options is not supported by default, '
  + 'When updating property, include all existing options or pass the `enableSelectOptionDelete` option to allow options to be deleted.');
    }
    return { error: undefined, value: undefined };
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IWriteOpenSelectBaseFieldProperty): ISelectFieldProperty {
    const { options, defaultValue } = openFieldProperty;
    const newOptions: ISelectFieldOption[] = [];
    let transformedDefaultValue = defaultValue;
    const transformedOptions = options.map(option => {
      if (!option.id || !option.color) {
        const color = option.color ? (typeof option.color === 'number' ? option.color : this.getOptionColorNumberByName(option.color)) : undefined;
        // prevent duplicate option IDs
        const newOption = SelectField._createNewOption({ name: option.name, color }, [...this.field.property.options, ...newOptions]);
        transformedDefaultValue = this.transformDefaultValue(newOption, transformedDefaultValue);
        newOptions.push(newOption);
        return newOption;
      }
      return {
        id: option.id,
        name: option.name,
        color: typeof option.color === 'number' ? option.color : this.getOptionColorNumberByName(option.color)!,
      };
    });
    return {
      defaultValue: transformedDefaultValue,
      options: transformedOptions
    };
  }

  /**
   * If the defaultValue is option.name, it needs to be processed as option.id
   */
  private transformDefaultValue(option: ISelectFieldOption, defaultValue: string | IMultiSelectedIds | undefined) {
    if(this.matchSingleSelectName(option.name, defaultValue)) {
      return option.id;
    }
    if(typeof defaultValue === 'object'){ // for MultiSelect
      const idx = defaultValue.indexOf(option.name);
      if(idx > -1) {
        defaultValue[idx] = option.id;
      }
    }
    return defaultValue;
  }

  private matchSingleSelectName(name: string, defaultValue: any): boolean{
    return typeof defaultValue === 'string'
      && name === defaultValue;
  }
}

// TODO: wait for PRD for specific logic
function getOptionColor(colors: number[]): number {
  if (colors.length < 10) {
    const diffColors = difference(range(10), colors);
    return diffColors[0]!;
  }
  return colors.length % 10;
}
