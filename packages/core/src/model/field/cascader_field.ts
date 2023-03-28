import Joi from 'joi';
import { FieldType, IField, ICascaderField, ISegment } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { TextBaseField } from './text_base_field';
import { ICellValue } from '../record';

export class CascaderField extends TextBaseField {

  static defaultProperty() {
    return {
      showLasted: true, // only show last level data
      linkedDatasheetId: '', // linked datasheet ID
      linkedViewId: '', // linked datasheet view ID
      linkedFields: [], // linked datasheet fields，arrange levels in array order
      fullLinkedFields: [],
    };
  }

  static override propertySchema = Joi.object({
    showLasted: Joi.bool().required(),
    linkedDatasheetId: Joi.string().required(),
    linkedViewId: Joi.string().required(),
    linkedFields: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.number().required(),
    })).required(),
    fullLinkedFields: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.number().required(),
    })).required(),

  }).required();

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICascaderField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.Cascader,
      property: this.defaultProperty(),
    };
  }

  override validateProperty() {
    return CascaderField.propertySchema.validate(this.field.property);
  }
  override cellValueToString(cellValue: ICellValue): string | null {
    if (cellValue == null) {
      return null;
    }
    const showLasted = this.field.property.showLasted;
    const cv = [cellValue].flat();
    return (cv as ISegment[]).map(seg => {
      if (showLasted) {
        const segArr = seg.text.split('/');
        return segArr[segArr.length - 1];
      }
      return seg.text;
    }).join('') || null;
  }
}
