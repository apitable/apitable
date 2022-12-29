import { FieldType, IField, ITextField } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { TextBaseField } from './text_base_field';

export class TextField extends TextBaseField {
  static defaultProperty() {
    return null;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ITextField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.Text,
      property: this.defaultProperty(),
    };
  }
}
