import Joi from 'joi';
import { FieldType, IField, ICascaderField, ISegment } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { TextBaseField } from './text_base_field';
import { ICellValue } from '../record';
import { Strings, t } from '../../exports/i18n';

export class CascaderField extends TextBaseField {

  static defaultProperty() {
    return {
      showAll: false, // only show last level data
      linkedDatasheetId: '', // linked datasheet ID
      linkedViewId: '', // linked datasheet view ID
      linkedFields: [], // linked datasheet fields，arrange levels in array order
      fullLinkedFields: [],
    };
  }

  static override propertySchema = Joi.object({
    showAll: Joi.bool().required(),
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

  override get hasError(): boolean {
    const { linkedDatasheetId } = this.field.property;
    return !Boolean(linkedDatasheetId);
  }

  override get warnText(): string {
    const { linkedDatasheetId } = this.field.property;
    return Boolean(linkedDatasheetId) ? '' : t(Strings.cascader_field_configuration_err);
  }

  override validateProperty() {
    return CascaderField.propertySchema.validate(this.field.property);
  }
  override cellValueToString(cellValue: ICellValue): string | null {
    if (cellValue == null) {
      return null;
    }
    const showAll = this.field.property.showAll;
    const cv = [cellValue].flat();
    return (cv as ISegment[]).map(seg => {
      if (!showAll) {
        const segArr = seg.text.split('/');
        return segArr[segArr.length - 1];
      }
      return seg.text;
    }).join('') || null;
  }
}
