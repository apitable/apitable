import Joi from 'joi';
import { ICellValue } from '../../record';
import { Field } from '../field';
import { IFilterCondition } from 'types/view_types';
import { IStandardValue, BasicValueType } from 'types/field_types';

export class DeniedField extends Field {
  static propertySchema = Joi.equal(null);

  get basicValueType() {
    return BasicValueType.String;
  }

  get apiMetaProperty() {
    return null;
  }

  get openValueJsonSchema() {
    return {
      title: this.field.name,
      type: 'string'      
    };
  }

  acceptFilterOperators = [];

  static defaultProperty() {
    return null;
  }

  validateProperty() {
    return DeniedField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return this.validateProperty();
  }

  validateOpenWriteValue() {
    return this.validateProperty();
  }

  cellValueToStdValue(cellValue: any): IStandardValue {
    return {
      sourceType: this.field.type,
      data: [],
    };
  }

  stdValueToCellValue(stdValue: IStandardValue): null {
    return null;
  }

  recordEditable() {
    return false;
  }

  validate(value: any): false {
    return false;
  }

  cellValueToString(cellValue: ICellValue): null {
    return null;
  }

  defaultValueForCondition(condition: IFilterCondition): null {
    return null;
  }

  cellValueToApiStandardValue(cellValue: ICellValue): null {
    return null;
  }

  cellValueToApiStringValue(cellValue: ICellValue) {
    return null;
  }

  cellValueToOpenValue(cellValue: ICellValue): null {
    return null;
  }

  openWriteValueToCellValue(openWriteValue: string): null {
    return null;
  }
}
