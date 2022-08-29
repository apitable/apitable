import Joi from 'joi';
import { IReduxState } from 'store';
import { TextBaseField } from './text_base_field';
import { FieldType, IField, ISingleTextField, SegmentType, ISegment, IStandardValue } from 'types/field_types';
import { DatasheetActions } from 'model';
import { IOpenSingleTextFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenSingleTextFieldProperty } from 'types/open/open_field_write_types';

export class SingleTextField extends TextBaseField {
  constructor(public field: ISingleTextField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    defaultValue: Joi.string().allow('')
  });

  static defaultProperty() {
    return {};
  }

  get apiMetaProperty() {
    return {
      defaultValue: this.field.property.defaultValue,
    };
  }

  validateProperty() {
    return SingleTextField.propertySchema.validate(this.field.property);
  }

  defaultValue(): ISegment[] | null {
    const defaultValue = this.field.property.defaultValue;
    if (!defaultValue || !defaultValue.trim().length) {
      return null;
    }
    return [{ type: SegmentType.Text, text: defaultValue }];
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ISingleTextField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.SingleText,
      property: this.defaultProperty(),
    };
  }

  /**
   * @description 多行文本转换成单行文本，需要将 换行符 替换成 空格，其他逻辑不变
   * @param {IStandardValue} stdField
   * @returns {(ISegment[] | null)}
   * @memberof SingleTextField
   */
  stdValueToCellValue(stdField: IStandardValue): ISegment[] | null {
    const { data, sourceType } = stdField;

    if (data.length === 0) {
      return null;
    }

    if (sourceType === FieldType.Text) {
      return data.map(d => {
        return {
          type: d.type || SegmentType.Text,
          text: d.text.replace(/\n/g, ' '),
        };
      });
    }

    return super.stdValueToCellValue(stdField);
  }

  get openFieldProperty(): IOpenSingleTextFieldProperty {
    const { defaultValue } = this.field.property;
    return { defaultValue };
  }

  validateUpdateOpenProperty(property: IUpdateOpenSingleTextFieldProperty) {
    return SingleTextField.propertySchema.validate(property);
  }
}
