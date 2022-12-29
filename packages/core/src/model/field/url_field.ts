import Joi from 'joi';
import { IReduxState } from '../../exports/store';
import { FieldType, IField, IHyperlinkSegment, IURLField } from 'types/field_types';

import { DatasheetActions } from '../datasheet';
import { ICellValue } from '../record';
import { TextBaseField } from './text_base_field';

export class URLField extends TextBaseField {
  constructor(public override field: IURLField, public override state: IReduxState) {
    super(field, state);
  }

  static defaultProperty() {
    return {
      isRecogURLFlag: false,
    };
  }

  static override cellValueSchema = Joi.array().items(Joi.object({
    text: Joi.string().allow('').required(),
    type: Joi.number().required(),
    link: Joi.string(),
    title: Joi.string(),
    favicon: Joi.string(),
  }).required()).allow(null).required();

  static override propertySchema = Joi.object({
    isRecogURLFlag: Joi.boolean(),
  });

  override cellValueToApiStringValue(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    if (this.field.type === FieldType.URL && this.field.property?.isRecogURLFlag) {
      return (cv as IHyperlinkSegment[]).map(seg => seg?.title || seg?.text || '').join('') || null;
    }

    return (cv as IHyperlinkSegment[]).map(seg => seg.text).join('') || null;
  }

  // Do not rewrite cellValueToString directly, it will cause problems with the value of the grouped fusion API. 
  // Judging from the outside is to display cellValueToString or cellValueToURLTitle
  cellValueToURLTitle(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    return (cv as IHyperlinkSegment[]).map(seg => seg?.title || seg?.text).join('') || null;
  }

  override validateProperty() {
    return URLField.propertySchema.validate(this.field.property);
  }

  override validateCellValue(cv: ICellValue) {
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
