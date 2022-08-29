import Joi from 'joi';
import { IReduxState } from 'store';
import { difference, isString, keyBy, memoize, range } from 'lodash';
import { getNewId, IDPrefix, isSelectType } from 'utils';
import { Field } from '../field';
import { FieldType, IMultiSelectedIds, ISelectField, ISelectFieldOption, ISelectFieldProperty, IStandardValue } from 'types/field_types';
import { IAPIMetaSingleSelectFieldProperty } from 'types/field_api_property_types';
import { getColorNames, getFieldOptionColor } from 'model/color';
import { IWriteOpenSelectBaseFieldProperty, IEffectOption } from 'types/open/open_field_write_types';
import { IOpenSelectBaseFieldProperty } from 'types/open/open_field_read_types';
import { joiErrorResult } from '../validate_schema';

const EFFECTIVE_OPTION_ID_LENGTH = 13;
export const isOptionId = (optionId: string) => {
  return optionId && optionId.startsWith('opt') && optionId.length === EFFECTIVE_OPTION_ID_LENGTH;
};

export abstract class SelectField extends Field {

  constructor(public field: ISelectField, state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      color: Joi.number().integer().min(0).required(),
    })).required(),
    defaultValue: Joi.custom((prototype, helpers) => {
      if (helpers.prefs['context']?.['fieldType'] === FieldType.SingleSelect) {
        return Joi.string();
      }
      return Joi.array().items(Joi.string());
    })
  }).required();

  static defaultProperty(): ISelectFieldProperty {
    return { options: [] };
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
    }});
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
    // 获取存在的
    const opt = SelectField._getOption(option, existOptions);
    if (opt) {
      return {
        option: opt,
        isCreated: false,
      };
    }
    // 创建不存在的
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
   * 为 singleSelect 添加一个新的选项
   * @param {string} name
   * @memberof SingleSelectField
   */
  addOption(name: string, color?: number) {
    const option = this.createNewOption(name, color);
    this.field.property.options.push(option);
    return option.id;
  }

  /**
   * 通过名称查找 option
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

  compare(
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
      const index1 = mapOptions.get(arr1[i]) as number;
      const index2 = mapOptions.get(arr2[i]) as number;
      if (index1 !== index2) {
        return index1 > index2 ? 1 : -1;
      }
    }

    return 0;
  }

  // 根据StandardValue 修改当前的property
  enrichProperty(stdVals: IStandardValue[]): ISelectFieldProperty {
    if (!this.propertyEditable()) {
      // 对单多选填充不存在的值，会默认进行 enrich ,但如果没有节点的可管理权限，enrich 会报错
      // 另外考虑到列权限，如果没有列的编辑权限，则该用户一定不是节点的可管理，因此不需要再另外检查列权限
      return this.field.property;
    }
    // 两个 map 是因为存在多个选项对应一个 id 的情况
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
          // TODO: 复用 ID 和 Color
          // 存在创建选项时，两个同样选项有 id 的case，比如后续添加的颜色字段
          if (isString(text) && !existOption) {
            const newColor = getOptionColor(optionColor);
            const option = this.createNewOption(text, newColor);
            if (id) {
              // 创建多一个选项，可能存在文本重复的情况
              // 后续复用color，比如option.color = color
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
    // 保留当前列的 property，options 进行覆盖操作
    return { ...this.field.property, options: this.filterBlankOption(options) };
  }

  filterBlankOption(options: ISelectFieldOption[]) {
    return options.filter(item => item.name.trim().length);
  }

  get openFieldProperty(): IOpenSelectBaseFieldProperty {
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
    // 不允许传入有ID 但是没有 color 的option参数
    if (updateProperty.options.some(option => option.id && !option.color)) {
      return joiErrorResult('Option object is not supported. It has id but no color');
    }
    // 校验此次更新是否会删除选项
    const updateOptionIds = updateProperty.options.map(option => option.id);
    const isDeleteOption = this.field.property.options.some(option => !updateOptionIds.includes(option.id));
    if (isDeleteOption && !effectOption?.enableSelectOptionDelete) {
      return joiErrorResult('Removing options is not supported by default, '
  + 'When updating property, include all existing options or pass the `enableSelectOptionDelete` option to allow options to be deleted.');
    }
    return { error: undefined, value: undefined };
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IWriteOpenSelectBaseFieldProperty): ISelectFieldProperty {
    const { options, defaultValue } = openFieldProperty;
    const newOptions: ISelectFieldOption[] = [];
    let transformedDefaultValue = defaultValue;
    const transformedOptions = options.map(option => {
      if (!option.id || !option.color) {
        const color = option.color ? this.getOptionColorNumberByName(option.color) : undefined;
        // 防止出现重复的选项ID
        const newOption = SelectField._createNewOption({ name: option.name, color }, [...this.field.property.options, ...newOptions]);
        transformedDefaultValue = this.transformDefaultValue(newOption, transformedDefaultValue);
        newOptions.push(newOption);
        return newOption;
      }
      return {
        id: option.id,
        name: option.name,
        color: this.getOptionColorNumberByName(option.color)!
      };
    });
    return {
      defaultValue: transformedDefaultValue,
      options: transformedOptions
    };
  }

  /**
   * 如果的defaultValue为option.name，需处理成option.id 
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

  private matchSingleSelectName(name: string, defaultValue): boolean{
    return typeof defaultValue === 'string' 
      && name === defaultValue;
  }

  /**
   * 将获取的color name 转换成 color number
   * @param name color name
   */
  getOptionColorNumberByName(name: string) {
    const colorNames = getColorNames();
    const colorNum = colorNames.findIndex(colorName => colorName === name);
    return colorNum > -1 ? colorNum : undefined;
  }
}

// TODO: 需要产品给具体逻辑
function getOptionColor(colors: number[]) {
  if (colors.length < 10) {
    const diffColors = difference(range(10), colors);
    return diffColors[0];
  }
  return colors.length % 10;
}
