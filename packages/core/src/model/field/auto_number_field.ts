import Joi from 'joi';
import { IRecord } from 'store';
import { FieldType, IField, IAutoNumberField } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { ICellValue } from 'model/record';
import { NumberBaseField } from './number_base_field';
import { FOperator, IAddOpenAutoNumberFieldProperty } from 'types';
import { datasheetIdString, joiErrorResult } from './validate_schema';

export class AutoNumberField extends NumberBaseField {
  static propertySchema = Joi.object({
    nextId: Joi.number().integer().min(0).required(),
    viewIdx: Joi.number().integer().min(0).required(),
    datasheetId: datasheetIdString().required(),
  }).required();

  get apiMetaProperty() {
    return null;
  }

  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsNot,
    FOperator.IsGreater,
    FOperator.IsGreaterEqual,
    FOperator.IsLess,
    FOperator.IsLessEqual,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
  ];

  get acceptFilterOperators(): FOperator[] {
    return AutoNumberField._acceptFilterOperators;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IAutoNumberField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.AutoNumber,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty() {
    return {
      nextId: 0,
      viewIdx: 0,
      datasheetId: '',
    };
  }

  get isComputed() {
    return true;
  }

  recordEditable() {
    return false;
  }

  stdValueToCellValue(): null {
    return null;
  }

  cellValueToString(cellValue: ICellValue): string | null {
    if (this.validate(cellValue)) {
      return String(cellValue);
    }
    return null;
  }

  validateProperty() {
    return AutoNumberField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  getCellValue(record: IRecord, fieldId: string): ICellValue {
    const cellValue = record.data[fieldId];
    const fieldUpdatedMap = record.recordMeta?.fieldUpdatedMap;

    if (!fieldUpdatedMap) {
      return null;
    }
    return fieldUpdatedMap[fieldId]?.autoNumber || cellValue || null;
  }

  validateAddOpenFieldProperty(updateProperty: IAddOpenAutoNumberFieldProperty) {
    if (updateProperty === null) {
      return { error: undefined, value: null };
    }
    return this.validateUpdateOpenProperty(updateProperty);
  }
}
