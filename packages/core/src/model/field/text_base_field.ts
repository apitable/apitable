import Joi from 'joi';
import { isNumber, isString } from 'lodash';
import { ICellValue } from 'model/record';
import { isNullValue } from 'model/utils';
import { FOperator, FOperatorDescMap, IAddOpenFieldProperty, IAPIMetaTextBaseFieldProperty, IFilterCondition, IFilterText } from 'types';
import {
  BasicValueType, FieldType, IEmailField, IPhoneField, ISegment, ISingleTextField, IStandardValue, ITextField, IURLField, SegmentType,
} from 'types/field_types';
import { fastCloneDeep, string2Segment } from 'utils';
import { Field } from './field';
import { StatType } from './stat';

export type ICommonTextField = ITextField | IEmailField | IURLField | IPhoneField | ISingleTextField;

export abstract class TextBaseField extends Field {
  static _statTypeList = [
    StatType.None,
    StatType.CountAll,
    StatType.Empty,
    StatType.Filled,
    StatType.Unique,
    StatType.PercentEmpty,
    StatType.PercentFilled,
    StatType.PercentUnique,
  ];

  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsNot,
    FOperator.Contains,
    FOperator.DoesNotContain,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
    FOperator.IsRepeat,
  ];

  static cellValueSchema = Joi.array().items(Joi.object({
    text: Joi.string().allow('').required(),
    type: Joi.number().required(),
    link: Joi.string(),
  }).required()).allow(null).required();

  static openWriteValueSchema = Joi.string().allow(null).required();

  static propertySchema = Joi.equal(null);

  validateCellValue(cv: ICellValue) {
    return TextBaseField.cellValueSchema.validate(cv);
  }

  validateOpenWriteValue(owv: string | null) {
    return TextBaseField.openWriteValueSchema.validate(owv);
  }

  validateProperty() {
    return TextBaseField.propertySchema.validate(this.field.property);
  }

  get apiMetaProperty(): IAPIMetaTextBaseFieldProperty {
    return null;
  }

  get openValueJsonSchema() {
    return {
      type: 'string',
      title: this.field.name,
    };
  }

  showFOperatorDesc(type: FOperator) {
    return FOperatorDescMap[type];
  }

  get acceptFilterOperators(): FOperator[] {
    return TextBaseField._acceptFilterOperators;
  }

  get basicValueType() {
    return BasicValueType.String;
  }

  cellValueToStdValue(cellValue: ISegment[] | null): IStandardValue {
    const stdValue = {
      sourceType: FieldType.Text,
      data: [] as ISegment[],
    };

    if (cellValue) {
      stdValue.data = cellValue.map(seg => fastCloneDeep(seg));
    }

    return stdValue;
  }

  stdValueToCellValue(stdField: IStandardValue): ISegment[] | null {
    const { data, sourceType } = stdField;
    if (data.length === 0) {
      return null;
    }

    let segments: ISegment[];
    if ([FieldType.MultiSelect, FieldType.Link, FieldType.Attachment, FieldType.Member].includes(sourceType)) {
      segments = [{ type: SegmentType.Text, text: data.map(d => d.text).join(', ') }];
    } else if (sourceType === FieldType.Text) {
      segments = data.map(d => ({
        type: d.type || SegmentType.Text,
        ...d,
      }));
    } else {
      segments = [{ type: SegmentType.Text, text: data.map(d => d.text).join('') }];
    }

    if (segments.length === 0 || segments.every(segment => segment.text === '')) {
      return null;
    }

    return segments;
  }

  validate(value: any): value is ISegment[] {
    if (Array.isArray(value)) {
      return value.every(segment => {
        return segment != null && isNumber(segment.type) && isString(segment.text);
      });
    }
    return false;
  }

  defaultValueForCondition(condition: IFilterCondition<FieldType.Text>): null | ISegment[] {
    // 文本类型筛选没有默认填充的逻辑\
    const { value } = condition;
    return value ? value.map(item => ({ text: item, type: SegmentType.Text })) : null;
  }

  cellValueToString(cellValue: ISegment[] | null): string | null {
    if (cellValue == null) {
      return null;
    }
    const cv = [cellValue].flat();
    return (cv as ISegment[]).map(seg => seg.text).join('') || null;
  }

  static stringInclude(str: string, searchStr: string) {
    return str.toLowerCase().includes(searchStr.trim().toLowerCase());
  }

  // 这里直接传入格式化之后的字符串
  static _isMeetFilter(operator: FOperator, cellText: string | null, conditionValue: IFilterText) {
    if (operator === FOperator.IsEmpty) {
      return cellText == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellText != null;
    }
    if (conditionValue === null) {
      return true;
    }
    const [filterValue] = conditionValue;
    switch (operator) {
      case FOperator.Is: {
        return cellText != null && cellText.trim().toLowerCase() === filterValue.trim().toLowerCase();
      }

      case FOperator.IsNot: {
        return cellText == null || cellText.trim().toLowerCase() !== filterValue.trim().toLowerCase();
      }

      case FOperator.Contains: {
        return cellText != null && TextBaseField.stringInclude(cellText, filterValue);
      }

      case FOperator.DoesNotContain: {
        return cellText == null || !TextBaseField.stringInclude(cellText, filterValue);
      }
      default: {
        return false;
      }
    }
  }

  eq(cv1: ISegment[] | null, cv2: ISegment[] | null): boolean {
    return this.cellValueToString(cv1) === this.cellValueToString(cv2);
  }

  isMeetFilter(operator: FOperator, cellValue: ISegment[] | null, conditionValue: Exclude<IFilterText, null>) {
    const cellText = this.cellValueToString(cellValue);
    if (operator === FOperator.IsEmpty) {
      return cellText == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellText != null;
    }
    if (conditionValue === null) {
      return true;
    }
    const [filterValue] = conditionValue;
    switch (operator) {
      // 根据输入的值精确搜索，忽略空格及大小写
      case FOperator.Is: {
        return cellText != null && cellText.trim().toLowerCase() === filterValue.trim().toLowerCase();
      }

      case FOperator.IsNot: {
        return cellText == null || cellText.trim().toLowerCase() !== filterValue.trim().toLowerCase();
      }

      case FOperator.Contains: {
        return cellText != null && this.stringInclude(cellText, filterValue);
      }

      case FOperator.DoesNotContain: {
        return cellText == null || !this.stringInclude(cellText, filterValue);
      }

      default: {
        return super.isMeetFilter(operator, cellValue, conditionValue);
      }
    }
  }

  cellValueToApiStandardValue(cellValue: ISegment[] | null): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToApiStringValue(cellValue: ISegment[] | null): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: ISegment[] | null): string | null {
    return this.cellValueToString(cellValue);
  }

  openWriteValueToCellValue(openWriteValue: string | null) {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    return string2Segment(openWriteValue);
  }

  validateAddOpenFieldProperty(updateProperty: IAddOpenFieldProperty) {
    if (this.field.type !== FieldType.SingleText && updateProperty === null) {
      return { error: undefined, value: null };
    }
    return this.validateUpdateOpenProperty(updateProperty);
  }
}
