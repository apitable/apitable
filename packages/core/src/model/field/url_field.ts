import Joi from 'joi';
import { IReduxState } from 'store';
import { FieldType, IField, IHyperlinkSegment, IURLField } from 'types/field_types';

import { DatasheetActions } from '../datasheet';
import { ICellValue } from '../record';
import { TextBaseField } from './text_base_field';

export class URLField extends TextBaseField {
  constructor(public field: IURLField, public state: IReduxState) {
    super(field, state);
  }

  static defaultProperty() {
    return {
      isRecogURLFlag: false,
    };
  }

  static cellValueSchema = Joi.array().items(Joi.object({
    text: Joi.string().allow('').required(),
    type: Joi.number().required(),
    link: Joi.string(),
    title: Joi.string(),
    favicon: Joi.string(),
  }).required()).allow(null).required();

  static propertySchema = Joi.object({
    isRecogURLFlag: Joi.boolean(),
  });

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    if (this.field.type === FieldType.URL && this.field.property?.isRecogURLFlag) {
      return (cv as IHyperlinkSegment[]).map(seg => seg?.title || seg?.text || '').join('') || null;
    }

    return (cv as IHyperlinkSegment[]).map(seg => seg.text).join('') || null;
  }

  // 不要直接重写cellValueToString 会导致分组 fusion API的值出问题 从外部去判断是展示cellValueToString或cellValueToURLTitle
  cellValueToURLTitle(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    return (cv as IHyperlinkSegment[]).map(seg => seg?.title || seg?.text).join('') || null;
  }

  validateProperty() {
    return URLField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cv: ICellValue) {
    return URLField.cellValueSchema.validate(cv);
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IURLField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.URL,
      property: this.defaultProperty(),
    };
  }
}
