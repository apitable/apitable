import { IReduxState } from 'store';
import { FieldType, IField, IPhoneField } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { TextBaseField } from './text_base_field';

export class PhoneField extends TextBaseField {
  constructor(public override field: IPhoneField, state: IReduxState) {
    super(field, state);
  }

  static defaultProperty() {
    return null;
  }

  override get apiMetaProperty() {
    return null;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IPhoneField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.Phone,
      property: this.defaultProperty(),
    };
  }
}
