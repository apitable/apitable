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

  cellValueToStdValue(_cellValue: any): IStandardValue {
    return {
      sourceType: this.field.type,
      data: [],
    };
  }

  stdValueToCellValue(_stdValue: IStandardValue): null {
    return null;
  }

  override recordEditable() {
    return false;
  }

  validate(_value: any): false {
    return false;
  }

  cellValueToString(_cellValue: ICellValue): null {
    return null;
  }

  defaultValueForCondition(_condition: IFilterCondition): null {
    return null;
  }

  cellValueToApiStandardValue(_cellValue: ICellValue): null {
    return null;
  }

  cellValueToApiStringValue(_cellValue: ICellValue) {
    return null;
  }

  cellValueToOpenValue(_cellValue: ICellValue): null {
    return null;
  }

  openWriteValueToCellValue(_openWriteValue: string): null {
    return null;
  }
}
