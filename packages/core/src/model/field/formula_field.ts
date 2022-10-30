import { getComputeRefManager } from 'compute_manager';
import { ExpCache, FormulaBaseError, parse } from 'formula_parser';
import Joi from 'joi';
import { ValueTypeMap } from 'model/constants';
import { ICellValue } from 'model/record';
import { computedFormattingToFormat, getApiMetaPropertyFormat } from 'model/utils';
import { IReduxState } from 'store';
import { getSnapshot } from 'store/selector';
import { FOperator, FOperatorDescMap, IAPIMetaFormulaFieldProperty, IAPIMetaNoneStringValueFormat, IFilterCondition } from 'types';
import {
  BasicValueType, FieldType, IComputedFieldFormattingProperty, IDateTimeFieldProperty, IFormulaField, IFormulaProperty, IStandardValue, ITimestamp,
} from 'types/field_types';
import { IOpenFormulaFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenFormulaFieldProperty } from 'types/open/open_field_write_types';
import { isClient } from 'utils/env';
import { CheckboxField } from './checkbox_field';
import { DateTimeBaseField, dateTimeFormat } from './date_time_base_field';
import { ArrayValueField } from './field';
import { NumberBaseField, numberFormat } from './number_base_field';
import { StatTranslate, StatType } from './stat';
import { TextBaseField } from './text_base_field';
import { computedFormatting, computedFormattingStr, datasheetIdString, joiErrorResult } from './validate_schema';

export class FormulaField extends ArrayValueField {
  constructor(public field: IFormulaField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    expression: Joi.string().allow('').required(),
    formatting: computedFormatting(),
  }).required();

  validateProperty() {
    return FormulaField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  get apiMetaPropertyFormat(): IAPIMetaNoneStringValueFormat | null {
    return getApiMetaPropertyFormat(this);
  }

  get apiMetaProperty(): IAPIMetaFormulaFieldProperty {
    const res: IAPIMetaFormulaFieldProperty = {
      expression: this.field.property.expression,
      valueType: this.basicValueType,
      hasError: this.hasError,
    };
    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  get openValueJsonSchema() {
    switch (this.basicValueType) {
      case BasicValueType.Number:
      case BasicValueType.String:
      case BasicValueType.DateTime:
      case BasicValueType.Boolean:
        return {
          type: ValueTypeMap[this.basicValueType],
          title: this.field.name,
        };
      case BasicValueType.Array:
        const innerBasicValueType = this.innerBasicValueType;
        return {
          type: 'array',
          title: this.field.name,
          items: {
            type: ValueTypeMap[innerBasicValueType],
            title: '子项目'
          }
        };
      default:
        // By default, it is processed as string
        return {
          type: 'string',
          title: this.field.name,
        };
    }
  }

  getParseResult() {
    const snapshot = getSnapshot(this.state, this.field.property.datasheetId);
    const fieldMap = snapshot?.meta.fieldMap!;
    return parse(this.field.property.expression, { field: this.field, fieldMap, state: this.state });
  }

  get hasError(): boolean {
    const { datasheetId, expression } = this.field.property;
    const cacheResult = ExpCache.get(datasheetId, this.field.id, expression);
    if (isClient()) {
      const computeRefManager = getComputeRefManager(this.state);
      if (!computeRefManager.checkRef(`${datasheetId}-${this.field.id}`)) {
        return true;
      }
    }

    return Boolean(cacheResult && 'error' in cacheResult);
  }

  get statTypeList() {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._statTypeList;
      case BasicValueType.Boolean:
        return CheckboxField._statTypeList;
      case BasicValueType.DateTime:
        return DateTimeBaseField._statTypeList;
      case BasicValueType.String:
        return TextBaseField._statTypeList;
      default:
        return TextBaseField._statTypeList;
    }
  }

  get basicValueType(): BasicValueType {
    const formulaExpr = this.getParseResult();
    if ('error' in formulaExpr) {
      return BasicValueType.String;
    }

    return formulaExpr.ast.valueType;
  }

  get innerBasicValueType(): BasicValueType {
    const formulaExpr = this.getParseResult();
    if ('error' in formulaExpr) {
      return BasicValueType.String;
    }

    return formulaExpr.ast.innerValueType || BasicValueType.String;
  }

  showFOperatorDesc(type: FOperator) {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField.FOperatorDescMap[type];
      case BasicValueType.Boolean:
        return FOperatorDescMap[type];
      case BasicValueType.String:
        return FOperatorDescMap[type];
      case BasicValueType.DateTime:
        return DateTimeBaseField.FOperatorDescMap[type];
      default:
        return '';
    }
  }

  get acceptFilterOperators(): FOperator[] {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._acceptFilterOperators;
      case BasicValueType.Boolean:
        return CheckboxField._acceptFilterOperators;
      case BasicValueType.String:
        return TextBaseField._acceptFilterOperators;
      case BasicValueType.DateTime:
        return DateTimeBaseField._acceptFilterOperators;
      default:
        return [];
    }
  }

  get isComputed() {
    return true;
  }

  // getExpression2Display() {
  //   const
  //   this.field.property.expression;
  // }

  static defaultProperty() {
    return {
      expression: '',
      datasheetId: ''
    };
  }

  compare(cv1: ICellValue, cv2: ICellValue, orderInCellValueSensitive?: boolean) {
    // Compatible with sorting formula error
    const isCv1Error = cv1 instanceof FormulaBaseError;
    const isCv2Error = cv2 instanceof FormulaBaseError;
    if (isCv1Error && isCv2Error) {
      return 0;
    }
    if (isCv1Error && !isCv2Error) {
      return -1;
    }
    if (!isCv1Error && isCv2Error) {
      return 1;
    }
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._compare(cv1 as number, cv2 as number);
      case BasicValueType.DateTime:
        return DateTimeBaseField._compare(cv1 as ITimestamp, cv2 as ITimestamp,
          this.field.property.formatting as IDateTimeFieldProperty);
      case BasicValueType.Boolean:
        return CheckboxField._compare(cv1, cv2, orderInCellValueSensitive);
      default:
        return super.compare(cv1, cv2, orderInCellValueSensitive);
    }
  }

  recordEditable() {
    return false;
  }

  cellValueToStdValue(cellValue: string | number | null): IStandardValue {
    const stdValue: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (cellValue != null) {
      stdValue.data.push({
        text: this.cellValueToString(cellValue) || '',
        value: cellValue
      });
    }

    return stdValue;
  }

  cellValueToArray(cellValue: any) {
    return cellValue;
  }

  arrayValueToString(cellValue: any): string | null {
    if (Array.isArray(cellValue)) {
      const vArray = this.arrayValueToArrayStringValueArray(cellValue);
      return vArray == null ? null : vArray.join(', ');
    }
    return String(cellValue);
  }

  arrayValueToArrayStringValueArray(cellValue: any[]) {
    return (cellValue as any[]).map(cv => {
      switch (this.innerBasicValueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean: {
          return numberFormat(cv, this.field.property?.formatting);
        }
        case BasicValueType.DateTime:
          return dateTimeFormat(cv, this.field.property.formatting as any);
        case BasicValueType.String:
          return String(cv);
        default:
          return String(cv);
      }
    });
  }

  stdValueToCellValue(stdField: IStandardValue): null {
    return null;
  }

  validate(value: any): value is string | number {
    return true;
  }

  defaultValueForCondition(condition: IFilterCondition<FieldType.Text>): null {
    return null;
  }

  cellValueToString(cellValue: ICellValue): string | null {
    if (cellValue == null) {
      return null;
    }
    switch (this.basicValueType) {
      case BasicValueType.Number:
      case BasicValueType.Boolean: {
        return numberFormat(cellValue, this.field.property?.formatting);
      }
      case BasicValueType.DateTime:
        return dateTimeFormat(cellValue, this.field.property.formatting as any);
      case BasicValueType.String:
        return String(cellValue);
      case BasicValueType.Array: {
        return this.arrayValueToString(cellValue);
      }
      default:
        return null;
    }
  }

  isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: Exclude<any, null>) {
    switch (this.basicValueType) {
      case BasicValueType.Number:
        return NumberBaseField._isMeetFilter(operator, cellValue as number | null, conditionValue);
      case BasicValueType.Boolean:
        return CheckboxField._isMeetFilter(operator, cellValue, conditionValue);
      case BasicValueType.DateTime:
        return DateTimeBaseField._isMeetFilter(operator, cellValue as number | null, conditionValue);
      case BasicValueType.String:
        return TextBaseField._isMeetFilter(operator, this.cellValueToString(cellValue), conditionValue);
      case BasicValueType.Array:
        switch (operator) {
          // The filter operation of negative semantics requires that each item in the array satisfies
          case FOperator.DoesNotContain:
          case FOperator.IsNot:
          case FOperator.IsEmpty:
            return (cellValue as ICellValue[]).every(cv => {
              switch (this.innerBasicValueType) {
                case BasicValueType.Number:
                  return NumberBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
                case BasicValueType.Boolean:
                  return CheckboxField._isMeetFilter(operator, cv, conditionValue);
                case BasicValueType.DateTime:
                  return DateTimeBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
                case BasicValueType.String:
                  return TextBaseField._isMeetFilter(operator, this.cellValueToString(cv), conditionValue);
                default:
                  return false;
              }
            });
          default:
            return (cellValue as ICellValue[]).some(cv => {
              switch (this.innerBasicValueType) {
                case BasicValueType.Number:
                  return NumberBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
                case BasicValueType.Boolean:
                  return CheckboxField._isMeetFilter(operator, cv, conditionValue);
                case BasicValueType.DateTime:
                  return DateTimeBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
                case BasicValueType.String:
                  return TextBaseField._isMeetFilter(operator, this.cellValueToString(cv), conditionValue);
                default:
                  return false;
              }
            });
        }
      default:
        return false;
    }
  }

  statType2text(type: StatType): string {
    switch (this.valueType) {
      case BasicValueType.DateTime:
        return DateTimeBaseField._statType2text(type);
      case BasicValueType.Number:
      case BasicValueType.Boolean:
      case BasicValueType.String:
        return StatTranslate[type];
      default:
        return '';
    }
  }

  cellValueToApiStandardValue(cellValue: ICellValue): ICellValue | null {
    return cellValue;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(
    cellValue: null | string | number | boolean | string[] | number[] | boolean[]):
    null | string | number | boolean | string[] | number[] | boolean[] {
    return cellValue;
  }

  openWriteValueToCellValue() {
    return null;
  }

  get openFieldProperty(): IOpenFormulaFieldProperty {
    const res: IOpenFormulaFieldProperty = {
      expression: this.field.property.expression,
      valueType: this.basicValueType,
      hasError: this.hasError,
    };
    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  static openUpdatePropertySchema = Joi.object({
    expression: Joi.string(),
    format: computedFormattingStr(),
  }).required();

  validateUpdateOpenProperty(updateProperty: IUpdateOpenFormulaFieldProperty) {
    return FormulaField.openUpdatePropertySchema.validate(updateProperty);
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenFormulaFieldProperty): IFormulaProperty {
    const { expression, format } = openFieldProperty;
    const formatting: IComputedFieldFormattingProperty | undefined = format ? computedFormattingToFormat(format) : undefined;
    return {
      datasheetId: this.field.property.datasheetId,
      expression: expression || '',
      formatting
    };

  }
}
