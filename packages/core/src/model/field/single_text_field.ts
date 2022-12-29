import Joi from 'joi';
import { IReduxState } from '../../exports/store';
import { TextBaseField } from './text_base_field';
import { FieldType, IField, ISingleTextField, SegmentType, ISegment, IStandardValue } from 'types/field_types';
import { DatasheetActions } from 'model';
import { IOpenSingleTextFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenSingleTextFieldProperty } from 'types/open/open_field_write_types';

export class SingleTextField extends TextBaseField {
  constructor(public override field: ISingleTextField, public override state: IReduxState) {
    super(field, state);
  }

  static override propertySchema = Joi.object({
    defaultValue: Joi.string().allow('')
  });

  static defaultProperty() {
    return {};
  }

  override get apiMetaProperty() {
    return {
      defaultValue: this.field.property.defaultValue,
    };
  }

  override validateProperty() {
    return SingleTextField.propertySchema.validate(this.field.property);
  }

  override defaultValue(): ISegment[] | null {
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
   * @description Convert multi-line text to single-line text, you need to replace the newline character with a space, other logic remains unchanged
   * @param {IStandardValue} stdField
   * @returns {(ISegment[] | null)}
   * @memberof SingleTextField
   */
  override stdValueToCellValue(stdField: IStandardValue): ISegment[] | null {
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

  override get openFieldProperty(): IOpenSingleTextFieldProperty {
    const { defaultValue } = this.field.property;
    return { defaultValue };
  }

  override validateUpdateOpenProperty(property: IUpdateOpenSingleTextFieldProperty) {
    return SingleTextField.propertySchema.validate(property);
  }
}
