import { IReduxState } from 'exports/store';
import {
  BasicOpenValueTypeBase,
  BasicValueType,
  FieldType,
  FOperator,
  IAttachmentValue,
  IField, IFilterCondition, IFilterText, ISegment,
  IStandardValue,
  IWorkdocField,
  IWorkdocValue,
} from 'types';
import { ArrayValueField, zhIntlCollator } from './field';
import { ICellValue } from '../record';
import { isArray, isEqual, isString } from 'lodash';
import Joi from 'joi';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { isNullValue } from '../utils';
import { Strings, t } from 'exports/i18n';

const baseWorkdocFieldSchema = {
  documentId: Joi.string().required(),
  title: Joi.string().allow('')
};

export class WorkdocField extends ArrayValueField {
  constructor(public override field: IWorkdocField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.equal(null);

  static cellValueSchema = Joi.array().items(Joi.object(baseWorkdocFieldSchema).required()).allow(null).required();

  static defaultProperty() {
    return null;
  }
  get openValueJsonSchema() {
    return {
      type: 'array',
      title: this.field.name,
      items: {
        type: 'object',
        properties: {
          documentId: {
            type: 'string',
            title: t(Strings.robot_variables_join_workdoc_id),
          },
          title: {
            type: 'string',
            title: t(Strings.robot_variables_join_workdoc_name),
          },
        }
      }
    };
  }

  override get canGroup(): boolean {
    return true;
  }

  override get acceptFilterOperators(): FOperator[] {
    return [
      FOperator.Is,
      FOperator.IsNot,
      FOperator.Contains,
      FOperator.DoesNotContain,
      FOperator.IsEmpty,
      FOperator.IsNotEmpty,
      FOperator.IsRepeat,
    ];
  }

  override get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override get innerBasicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IWorkdocField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Workdoc,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: null,
    };
  }

  validateProperty() {
    return WorkdocField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cv: ICellValue) {
    return WorkdocField.cellValueSchema.validate(cv);
  }

  override eq(cv1: IWorkdocValue[] | null, cv2: IWorkdocValue[] | null): boolean {
    if (cv1 == null || cv2 == null) {
      return cv1 === cv2;
    }
    return isEqual(
      [cv1].flat().map(item => item.documentId),
      [cv2].flat().map(item => item.documentId),
    );
  }

  override compare(
    cellValue1: IWorkdocValue[] | null,
    cellValue2: IWorkdocValue[] | null,
  ): number {
    if (isEqual(cellValue1, cellValue2)) {
      return 0;
    }
    if (cellValue1 === null) {
      return 1;
    }
    if (cellValue2 === null) {
      return -1;
    }
    let str1 = this.cellValueToString(cellValue1);
    let str2 = this.cellValueToString(cellValue2);

    if (str1 === str2) {
      return 0;
    }
    if (str1 == null) {
      return -1;
    }
    if (str2 == null) {
      return 1;
    }

    str1 = str1.trim();
    str2 = str2.trim();

    // test pinyin sort
    return str1 === str2 ? 0 :
      zhIntlCollator ? zhIntlCollator.compare(str1, str2) : (str1.localeCompare(str2, 'zh-CN') > 0 ? 1 : -1);
  }

  override isMeetFilter(operator: FOperator, cellValue: ISegment[] | null, conditionValue: Exclude<IFilterText, null>) {
    const cellValueTitle = this.cellValueToArray(cellValue);
    switch (operator) {
      case FOperator.Is:
        return cellValueTitle != null && isEqual(cellValueTitle, conditionValue);
      case FOperator.IsNot:
        return cellValueTitle == null || !isEqual(cellValueTitle, conditionValue);
      case FOperator.Contains:
        return cellValueTitle != null && cellValueTitle.some(title =>
          conditionValue.some((v: string) => title.includes(v))
        );
      case FOperator.DoesNotContain:
        return cellValueTitle == null || !cellValueTitle.some(title =>
          conditionValue.some((v: string) => title.includes(v))
        );
      default:
        return super.isMeetFilter(operator, cellValue, conditionValue);
    }
  }

  validate(value: any): value is IWorkdocValue[] {
    return isArray(value) && (value as IWorkdocValue[]).every((doc: IWorkdocValue) => {
      return Boolean(
        doc &&
        isString(doc.documentId) &&
        isString(doc.title)
      );
    });
  }

  cellValueToArray(cellValue: ICellValue): string[] | null {
    if (this.validate(cellValue)) {
      return cellValue.map(cur => {
        return cur.title;
      });
    }
    return null;
  }

  arrayValueToString(cellValues: string[] | null): string | null {
    return cellValues && cellValues.length ? cellValues.join(', ') : null;
  }

  cellValueToString(cellValue: ICellValue): string | null {
    return this.arrayValueToString(this.cellValueToArray(cellValue));
  }

  get apiMetaProperty() {
    return null;
  }

  cellValueToApiStandardValue(cellValue: ICellValue): any[] | null {
    if (this.validate(cellValue)) {
      return cellValue.map(value => {
        return {
          documentId: value.documentId,
          title: value.title,
        };
      });
    }
    return null;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: IWorkdocValue[] | null): BasicOpenValueTypeBase | null {
    return cellValue;
  }

  cellValueToStdValue(val: IWorkdocValue[] | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: FieldType.Workdoc,
      data: [],
    };

    if (val != null) {
      stdVal.data = val.map(doc => {
        return {
          text: this.cellValueToString([doc]) || '',
          ...doc,
        };
      });
    }

    return stdVal;
  }

  defaultValueForCondition(_condition: IFilterCondition): null {
    return null;
  }

  openWriteValueToCellValue(openWriteValue: IWorkdocValue[] | null): ICellValue | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    return openWriteValue.map(v => ({
      documentId: v.documentId,
      title: v.title,
    }));
  }

  stdValueToCellValue(stdVal: IStandardValue): IWorkdocValue[] | null {
    if (stdVal.data.length === 0) {
      return null;
    }

    const cellValue = stdVal.data.map(val => {
      const { text, ...v } = val;
      return v;
    });

    if (this.validate(cellValue)) {
      return cellValue;
    }

    return null;
  }

  validateOpenWriteValue(owv: IAttachmentValue[] | null) {
    return WorkdocField.cellValueSchema.validate(owv);
  }

}
