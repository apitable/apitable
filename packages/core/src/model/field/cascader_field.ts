import Joi from 'joi';
import { FieldType, ICascaderField, IField, ISegment } from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { Strings, t } from '../../exports/i18n';
import { FOperator, IAPIMetaTextBaseFieldProperty, IFilterText } from '../../types';
import { ICascaderProperty } from '../../types/field_types';
import { ICellValue } from '../record';
import { getFieldDefaultProperty } from './const';
import { TextBaseField } from './text_base_field';

export class CascaderField extends TextBaseField {
  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Cascader) as ICascaderProperty;
  }

  static override propertySchema = Joi.object({
    showAll: Joi.bool().required(),
    linkedDatasheetId: Joi.string().required(),
    linkedViewId: Joi.string().required(),
    linkedFields: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          type: Joi.number().required(),
        }),
      )
      .required(),
    fullLinkedFields: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          type: Joi.number().required(),
        }),
      )
      .required(),
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
    return (
      (cv as ISegment[])
        .map((seg) => {
          if (!showAll) {
            const segArr = seg.text.split('/');
            return segArr[segArr.length - 1];
          }
          return seg.text;
        })
        .join('') || null
    );
  }

  cellValueToFullString(cellValue: ICellValue): string | null {
    if (cellValue == null) {
      return null;
    }
    const cv = [cellValue].flat();
    return (cv as ISegment[]).map((seg) => seg.text).join('') || null;
  }

  override isMeetFilter(operator: FOperator, cellValue: ISegment[] | null, conditionValue: Exclude<IFilterText, null>) {
    const cellText = this.cellValueToFullString(cellValue);
    return TextBaseField._isMeetFilter(operator, cellText, conditionValue, {
      containsFn: (filterValue: string) => cellText != null && this.stringInclude(cellText, filterValue),
      doesNotContainFn: (filterValue: string) => cellText == null || !this.stringInclude(cellText, filterValue),
      defaultFn: () => super.isMeetFilter(operator, cellValue, conditionValue),
    });
  }

  override get apiMetaProperty(): IAPIMetaTextBaseFieldProperty {
    return { ...this.field.property, fullLinkedFields: undefined };
  }
}
