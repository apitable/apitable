import { getComputeRefManager } from 'compute_manager';
import { evaluate, parse, ROLLUP_KEY_WORDS } from 'formula_parser/evaluate';
import { Functions } from 'formula_parser/functions';
import { Strings, t } from 'i18n';
import Joi from 'joi';
import { isEmpty, uniqWith, zip } from 'lodash';
import { ValueTypeMap } from 'model/constants';
import { computedFormattingToFormat, getApiMetaPropertyFormat, handleNullArray } from 'model/utils';
import { IAPIMetaLookupFieldProperty } from 'types/field_api_property_types';
import { BasicOpenValueType, BasicOpenValueTypeBase } from 'types/field_types_open';
import { IOpenMagicLookUpFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenMagicLookUpFieldProperty } from 'types/open/open_field_write_types';
import { checkTypeSwitch, isTextBaseType } from 'utils';
import { isClient } from 'utils/env';
import { IReduxState, Selectors } from '../../store';
import { _getLookUpTreeValue, getFieldMap, getFilteredRecords, getSnapshot } from '../../store/selector';
import {
  BasicValueType, FieldType, IComputedFieldFormattingProperty, IDateTimeFieldProperty, IField, ILinkField, ILinkIds, ILookUpField, ILookUpProperty,
  INumberFormatFieldProperty, IStandardValue, ITimestamp, IUnitIds, RollUpFuncType
} from '../../types/field_types';
import { FilterConjunction, FOperator, FOperatorDescMap, IFilterCondition } from '../../types/view_types';
import { ICellValue, ICellValueBase, ILookUpValue } from '../record';
import { CheckboxField } from './checkbox_field';
import { DateTimeBaseField, dateTimeFormat } from './date_time_base_field';
import { ArrayValueField, Field } from './field';
import { NumberBaseField, numberFormat } from './number_base_field';
import { StatTranslate, StatType } from './stat';
import { TextBaseField } from './text_base_field';
import { computedFormatting, computedFormattingStr, datasheetIdString, enumToArray, joiErrorResult } from './validate_schema';

export interface ILookUpTreeValue {
  datasheetId: string;
  recordId: string;
  field: IField;
  cellValue: ICellValue | ILookUpTreeValue[];
}

// 需要原样输出的函数
export const ORIGIN_VALUES_FUNC_SET = new Set([
  RollUpFuncType.VALUES,
  RollUpFuncType.ARRAYUNIQUE,
  RollUpFuncType.ARRAYCOMPACT,
]);

// 需要以字符串连接展示的函数
export const LOOKUP_VALUE_FUNC_SET = new Set([
  RollUpFuncType.ARRAYJOIN,
  RollUpFuncType.CONCATENATE,
]);

// 不需要数字格式化的函数
export const NOT_FORMAT_FUNC_SET = new Set([
  RollUpFuncType.ARRAYJOIN,
  RollUpFuncType.CONCATENATE,
  RollUpFuncType.ARRAYUNIQUE,
  RollUpFuncType.ARRAYCOMPACT,
]);

export class LookUpField extends ArrayValueField {
  constructor(public field: ILookUpField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    relatedLinkFieldId: Joi.string().pattern(/^fld.+/, 'fieldId').required(),
    lookUpTargetFieldId: Joi.string().pattern(/^fld.+/, 'fieldId').required(),
    rollUpType: Joi.valid(...enumToArray(RollUpFuncType)),
    formatting: computedFormatting(),
    filterInfo: Joi.object({
      conjunction: Joi.valid(...enumToArray(FilterConjunction)).required(),
      conditions: Joi.array().items(Joi.object({
        conditionId: Joi.string().required(),
        fieldId: Joi.string().pattern(/^fld.+/, 'fieldId').required(),
        operator: Joi.valid(...enumToArray(FOperator)).required(),
        fieldType: Joi.valid(...enumToArray(FieldType)).required(),
        value: Joi.any(),
      }))
    }),
    openFilter: Joi.boolean(),
  }).required();

  validateProperty() {
    return LookUpField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  get apiMetaPropertyFormat() {
    return getApiMetaPropertyFormat(this);
  }

  get apiMetaProperty(): IAPIMetaLookupFieldProperty {
    const res: IAPIMetaLookupFieldProperty = {
      relatedLinkFieldId: this.field.property.relatedLinkFieldId,
      targetFieldId: this.field.property.lookUpTargetFieldId,
      rollupFunction: this.rollUpType,
    };

    if (this.hasError) {
      res.hasError = this.hasError;
      return res;
    }

    res.valueType = this.basicValueType;
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo();
    if (lookUpEntityFieldInfo) {
      res.entityField = {
        datasheetId: lookUpEntityFieldInfo.datasheetId,
        field: Field.bindContext(lookUpEntityFieldInfo.field, this.state).getApiMeta(lookUpEntityFieldInfo.datasheetId)
      };
    }

    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  /**
   * 值类型是否发生了改变？（是否还是实体字段值组成的数组？）
   * - 不改变：按照实体字段 openValue JsonSchema 计算
   * - 改变：按输出值类型推倒 jsonSchema
   */
  get openValueJsonSchema() {
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return {
        type: 'string',
        title: this.field.name,
        disabled: true,
      };
    }

    const expression = this.getExpression();
    if (expression) {
      // 存在表达式时，输出值类型基础类型
      switch (this.valueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean:
        case BasicValueType.DateTime:
        case BasicValueType.String:
          return {
            type: ValueTypeMap[this.basicValueType],
            title: this.field.name,
          };
        default:
          return {
            type: 'string',
            title: this.field.name,
          };
      }
    }
    if (LOOKUP_VALUE_FUNC_SET.has(this.rollUpType)) {
      return {
        type: 'string',
        title: this.field.name,
      };
    }
    const entityFieldSchema = Field.bindContext(entityField, this.state).openValueJsonSchema;
    return {
      type: 'array',
      title: this.field.name,
      items: entityFieldSchema
    };
  }

  get canGroup(): boolean {
    if (this.hasError) {
      return false;
    }
    const lookUpEntityField = Field.bindContext(this.field, this.state).getLookUpEntityField();
    if (!lookUpEntityField) {
      return false;
    }
    return Field.bindContext(lookUpEntityField, this.state).canGroup;
  }

  get hasError(): boolean {
    const { datasheetId } = this.field.property;
    if (isClient()) {
      const computeRefManager = getComputeRefManager(this.state);
      if (!computeRefManager.checkRef(`${datasheetId}-${this.field.id}`)) {
        return true;
      }
    }
    if (!this.getLookUpEntityField()) {
      return true;
    }
    const { error: isFilterError } = this.checkFilterInfo();
    return isFilterError;
  }

  get warnText(): string {
    const { typeSwitch: isFilterTypeSwitch } = this.checkFilterInfo();
    return isFilterTypeSwitch ? t(Strings.lookup_filter_waring) : '';
  }

  // 统计可选项
  get statTypeList() {
    const expression = this.getExpression();
    const rollUpType = this.field.property.rollUpType;
    if (expression) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._statTypeList;
        case BasicValueType.Boolean:
          return CheckboxField._statTypeList;
        case BasicValueType.DateTime:
          return DateTimeBaseField._statTypeList;
        case BasicValueType.String:
          return TextBaseField._statTypeList;
      }
    }
    if (LOOKUP_VALUE_FUNC_SET.has(rollUpType as RollUpFuncType)) {
      return TextBaseField._statTypeList;
    }
    const lookUpEntityField = Field.bindContext(this.field, this.state).getLookUpEntityField();
    if (!lookUpEntityField) {
      return [];
    }
    return Field.bindContext(lookUpEntityField, this.state).statTypeList;
  }

  get basicValueType(): BasicValueType {
    const expression = this.getExpression();
    if (expression) {
      const fieldMap = getFieldMap(this.state, this.field.property.datasheetId)!;
      const fExp = parse(expression, { field: this.field, fieldMap, state: this.state });
      if (!('error' in fExp)) {
        return fExp.ast.valueType;
      }
    }
    if (LOOKUP_VALUE_FUNC_SET.has(this.rollUpType)) {
      return BasicValueType.String;
    }
    return BasicValueType.Array;
  }

  // 当基础类型为 Array 的时候，获取 Array 里的元素的基础类型
  get innerBasicValueType(): BasicValueType {
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return BasicValueType.String;
    }

    const valueType = Field.bindContext(entityField, this.state).basicValueType;
    // 数组里的还是数组，说明是多选字段，直接强行指定为 string 即可
    return valueType === BasicValueType.Array ? BasicValueType.String : valueType;
  }

  static defaultProperty() {
    return {
      datasheetId: '',
      relatedLinkFieldId: '',
      lookUpTargetFieldId: '',
    };
  }

  get isComputed() {
    return true;
  }

  get rollUpType() {
    return this.field.property.rollUpType || RollUpFuncType.VALUES;
  }

  showFOperatorDesc(type: FOperator) {
    const expression = this.getExpression();
    if (expression) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField.FOperatorDescMap[type];
        case BasicValueType.Boolean:
          return FOperatorDescMap[type];
        case BasicValueType.String:
          return FOperatorDescMap[type];
        case BasicValueType.DateTime:
          return DateTimeBaseField.FOperatorDescMap[type];
      }
    }
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return [];
    }
    return Field.bindContext(entityField, this.state).showFOperatorDesc(type);
  }

  // 筛选可选项
  get acceptFilterOperators() {
    const expression = this.getExpression();
    if (expression) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._acceptFilterOperators;
        case BasicValueType.Boolean:
          return CheckboxField._acceptFilterOperators;
        case BasicValueType.String:
          return TextBaseField._acceptFilterOperators;
        case BasicValueType.DateTime:
          return DateTimeBaseField._acceptFilterOperators;
      }
    }
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return [];
    }
    return Field.bindContext(entityField, this.state).acceptFilterOperators.filter(item => item !== FOperator.IsRepeat);
  }

  getLinkFields(): ILinkField[] {
    const snapshot = getSnapshot(this.state, this.field.property.datasheetId);
    const fieldMap = snapshot?.meta.fieldMap;
    return fieldMap ? Object.values(fieldMap).filter(field => field.type === FieldType.Link) as ILinkField[] : [];
  }

  getRelatedLinkField(): ILinkField | undefined {
    return this.getLinkFields().find(field => field.id === this.field.property.relatedLinkFieldId);
  }

  getLookUpEntityFieldDepth(visitedFields?: Set<string>, depth?: number): number {
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo(visitedFields, depth);
    if (!lookUpEntityFieldInfo) {
      return 0;
    }
    return lookUpEntityFieldInfo.depth;
  }

  // 允许 lookup lookup lookup 字段，但是最终总会有一个实体字段。返回实体字段和字段的深度。
  getLookUpEntityFieldInfo(visitedFields?: Set<string>, depth?: number): {
    field: IField; depth: number; datasheetId: string;
  } | undefined {
    const _visitedFields = visitedFields || new Set();
    const _depth = depth || 0;
    const nextTargetInfo = this.getLookUpTargetFieldAndDatasheet();
    if (!nextTargetInfo) {
      return;
    }
    const { field, datasheetId } = nextTargetInfo;
    if (field && datasheetId && _visitedFields.has(`${datasheetId}-${field.id}`)) {
      throw Error('LookUp Circle!');
    }
    if (field && field.type === FieldType.LookUp) {
      _visitedFields.add(`${datasheetId}-${field.id}`);
      return Field.bindContext(field, this.state).getLookUpEntityFieldInfo(_visitedFields, _depth + 1);
    }
    return {
      field,
      datasheetId: nextTargetInfo.datasheetId,
      depth: _depth,
    };
  }

  // 允许 lookup lookup lookup 字段，但是最终总会有一个实体字段。
  getLookUpEntityField(visitedFields?: Set<string>, depth?: number): IField | undefined {
    try {
      const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo(visitedFields, depth);
      if (!lookUpEntityFieldInfo) {
        return;
      }
      return lookUpEntityFieldInfo.field;
    } catch (error) {
      return;
    }
  }

  // 检查筛选条件对应列是否被删除, 检查筛选条件对应列是否切换类型
  /**
   * 检查筛选条件对应列是否被删除
   * 检查筛选条件对应列是否切换类型
   */
  checkFilterInfo() {
    const { filterInfo } = this.field.property;
    let error = false;
    let typeSwitch = false;
    if (filterInfo) {
      const relatedLinkField = this.getRelatedLinkField();
      if (!relatedLinkField) {
        return {
          error: true,
          typeSwitch: false
        };
      }
      const { foreignDatasheetId } = relatedLinkField.property;
      const foreignSnapshot = getSnapshot(this.state, foreignDatasheetId)!;
      const foreignFieldMap = foreignSnapshot.meta.fieldMap;
      const { conditions } = filterInfo;
      conditions.forEach(c => {
        if (!error) {
          error = !foreignFieldMap[c.fieldId];
        }
        if (!typeSwitch) {
          typeSwitch = checkTypeSwitch(c, foreignFieldMap[c.fieldId]);
        }
      });
    }
    return { error, typeSwitch };
  }

  /**
   * 获取查找目标字段的信息，返回 字段和 datasheetId 信息
   *
   * @param {string} [datasheetId]
   * @returns {({ field: IField; datasheetId: string } | undefined)}
   * @memberof LookUpField
   */
  getLookUpTargetFieldAndDatasheet(): { field: IField; datasheetId: string } | undefined {
    const relatedLinkField = this.getRelatedLinkField();
    if (!relatedLinkField) {
      return;
    }
    const { foreignDatasheetId } = relatedLinkField.property;
    const { lookUpTargetFieldId } = this.field.property;
    const foreignSnapshot = getSnapshot(this.state, foreignDatasheetId);
    if (!foreignSnapshot) {
      return;
    }
    const field = foreignSnapshot.meta.fieldMap[lookUpTargetFieldId];
    return {
      field,
      datasheetId: foreignDatasheetId,
    };
  }

  getLookUpTargetField(): IField | undefined {
    const nextTargetFieldInfo = this.getLookUpTargetFieldAndDatasheet();
    if (!nextTargetFieldInfo) {
      return;
    }
    return nextTargetFieldInfo.field;
  }

  getExpression(): string | null {
    const rollUpType = this.rollUpType;
    if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType) && !LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
      const formulaFunc = Functions.get(rollUpType);
      if (!formulaFunc) {
        return null;
      }
      return `${formulaFunc.name}(${ROLLUP_KEY_WORDS})`;
    }
    return null;
  }

  getCellValue(recordId: string, withError?: boolean): ICellValue {
    const expression = this.getExpression();
    const { datasheetId } = this.field.property;

    if (expression) {
      const snapshot = getSnapshot(this.state, datasheetId)!;
      const record = snapshot.recordMap[recordId];
      return evaluate(expression, { field: this.field, record, state: this.state }, withError);
    }
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const flatCellValue = this.getFlatCellValue(recordId, true); // 基础的 cv 值应该保留空值。
    if (Array.isArray(flatCellValue) && flatCellValue.length) {
      // 文本类型的字段存储的都是字符片段，flat 需要保留原始信息，不能完全拍平
      const _flatCellValue = isTextBaseType(entityField.type) ? flatCellValue : (flatCellValue as any)?.flat(1);
      switch (this.rollUpType) {
        case RollUpFuncType.VALUES:
        case RollUpFuncType.ARRAYJOIN:
        case RollUpFuncType.CONCATENATE:
          return _flatCellValue;
        case RollUpFuncType.ARRAYUNIQUE:
          return uniqWith(_flatCellValue as any[], (cv1, cv2) => Field.bindContext(entityField, this.state).eq(cv1, cv2));
        case RollUpFuncType.ARRAYCOMPACT:
          return (_flatCellValue as ILookUpValue).filter(v => v !== '' || v != null);
        default:
          return flatCellValue;
      }
    }
    return flatCellValue;
  }

  // 获取扁平的 lookup 单元格数据
  // 对于非文本拼接类的数据，
  getFlatCellValue(recordId: string, withEmpty?: boolean): ICellValue {
    // 以当前记录为起点，递归查找 lookup 树。
    const recordCellValues = this.getLookUpTreeValue(recordId);
    if (isEmpty(recordCellValues)) {
      return null;
    }
    const field = new LookUpField(this.field, this.state).getLookUpEntityField();
    if (!field) {
      return null;
    }
    const flatCellValues: ICellValueBase[] = [];
    const getRealCellValue = (values: ILookUpTreeValue[]) => {
      values.forEach(value => {
        if (value && value.field) {
          if (value.field.type === FieldType.LookUp) {
            getRealCellValue(value.cellValue as ILookUpTreeValue[]);
          } else {
            flatCellValues.push(value.cellValue as ICellValueBase);
          }
        }
      });
    };
    getRealCellValue(recordCellValues);
    return withEmpty ? flatCellValues : flatCellValues.filter(item => item !== null);
  }

  /**
   * getLookUpTreeValue  getCellvalue 递归查询到实体字段的数据，组合成树形结构的数据
   *
   * @param {string} recordId
   * @param {string} [datasheetId]
   * @returns {ILookUpTreeValue[]}
   * @memberof LookUpField
   */
  getLookUpTreeValue(
    recordId: string,
  ): ILookUpTreeValue[] {
    // 筛选条件对应列被删除，不展示结果
    const { error: isFilterError } = this.checkFilterInfo();
    if (isFilterError) {
      return [];
    }
    const relatedLinkField = this.getRelatedLinkField();
    if (!relatedLinkField) {
      // console.log('找不到外键字段', relatedLinkField);
      return [];
    }
    const { lookUpTargetFieldId, datasheetId, filterInfo, openFilter } = this.field.property;
    const thisSnapshot = getSnapshot(this.state, datasheetId)!;
    // 关联表记录的 IDs
    let recordIDs = Selectors.getCellValue(
      this.state, thisSnapshot, recordId, relatedLinkField.id, true, datasheetId, true
    ) as ILinkIds;

    if (!recordIDs) {
      return [];
    }
    const { foreignDatasheetId } = relatedLinkField.property;
    const foreignSnapshot = getSnapshot(this.state, foreignDatasheetId);
    if (!foreignSnapshot) {
      return [];
    }
    const lookUpTargetField = this.getLookUpTargetField() as IField;

    if (openFilter) {
      // 神奇引用筛选
      recordIDs = getFilteredRecords(this.state, foreignSnapshot, recordIDs, filterInfo);
    }

    return recordIDs && recordIDs.length ? recordIDs.map((recordId: string) => {
      const cellValue = _getLookUpTreeValue(this.state, foreignSnapshot, recordId, lookUpTargetFieldId, foreignDatasheetId);
      return {
        field: lookUpTargetField,
        recordId,
        cellValue,
        datasheetId: foreignDatasheetId,
      };
    }) : [];
  }

  isEmptyOrNot(operator: FOperator.IsEmpty | FOperator.IsNotEmpty, cellValue: ICellValue) {
    cellValue = handleNullArray(cellValue);
    switch (operator) {
      /**
       * isEmpty 和 isNotEmpty 的逻辑基本通用
       */
      case FOperator.IsEmpty: {
        return cellValue == null;
      }

      case FOperator.IsNotEmpty: {
        return cellValue != null;
      }
    }
  }

  // lookup 不允许编辑单元格
  recordEditable(): boolean {
    return false;
  }

  static getFirstItem(item: any) {
    if (Array.isArray(item)) {
      return item[0];
    }
    return item;
  }

  /**
   * 在该 field 上比较两个 cellValue 的大小，用于排序
   * 默认是转为字符串比较，如果不是此逻辑，请自行实现
   * @orderInCellValueSensitive {boolean} 可选参数，给关联字段判断是否只做普通排序，对单元格内容不预处理
   * @returns {number} 负数 => 小于、0 => 等于、正数 => 大于
   */
  compare(cv1: ICellValue, cv2: ICellValue, orderInCellValueSensitive?: boolean): number {
    const expression = this.getExpression();
    cv1 = handleNullArray(cv1);
    cv2 = handleNullArray(cv2);
    if (expression) {
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
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return 1;
    }
    if (Field.bindContext(entityField, this.state).basicValueType === BasicValueType.Array) {
      return Field.bindContext(entityField, this.state).compare(cv1, cv2, orderInCellValueSensitive);
    }

    if (!orderInCellValueSensitive) {
      cv1 = [cv1].flat().sort((a, b) => Field.bindContext(entityField, this.state).compare(a as ICellValue, b as ICellValue)) as ICellValue;
      cv2 = [cv2].flat().sort((a, b) => Field.bindContext(entityField, this.state).compare(a as ICellValue, b as ICellValue)) as ICellValue;
    }

    const zipCellValue = zip([cv1].flat(), [cv2].flat());

    let res = 0;
    for (let index = 0; index < zipCellValue.length; index++) {
      const [cv1, cv2] = zipCellValue[index];
      res = Field.bindContext(entityField, this.state).compare(cv1 as ICellValue, cv2 as ICellValue);
      if (index === zipCellValue.length - 1) {
        return res;
      }
      if (res === 0) {
        continue;
      }
      return res;
    }
    return res;
  }

  isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: IFilterCondition['value']) {
    cellValue = handleNullArray(cellValue);
    const expr = this.getExpression();
    if (expr) {
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
            // 否定语义的 filter 操作，需要数组内每个项都满足
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
      }
    }
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return false;
    }
    const judge = (cv) => {
      return Field.bindContext(entityField, this.state).isMeetFilter(operator, cv, conditionValue);
    };
    // lookup 的 cv 已经是 flat 后的值，原本 field 值为数组的，使用通用的比较逻辑。
    if (Field.bindContext(entityField, this.state).basicValueType === BasicValueType.Array && operator !== FOperator.IsRepeat) {
      // 由于 “我” 筛选项的存在，cellValue 和 conditionValue 不存在全等的情况，
      // 对于 Member 类型直接使用 isMeetFilter 进行计算，它会将 'Self' 标记转换成对应的 UnitId 进行比较
      if (entityField.type === FieldType.Member) {
        return Field.bindContext(entityField, this.state).isMeetFilter(operator, cellValue as IUnitIds, conditionValue);
      }
      switch (operator) {
        case FOperator.Is:
          return Field.bindContext(entityField, this.state).eq(cellValue, conditionValue);
        case FOperator.IsNot:
          return !Field.bindContext(entityField, this.state).eq(cellValue, conditionValue);
        default:
          return Field.bindContext(entityField, this.state).isMeetFilter(operator, cellValue, conditionValue);
      }
    }
    switch (operator) {
      // 否定语义的 filter 操作，需要数组内每个项都满足
      case FOperator.DoesNotContain:
      case FOperator.IsNot:
      case FOperator.IsEmpty:
        return Array.isArray(cellValue) ? (cellValue as ICellValue[])
          .every(cv => judge(cv)) : judge(cellValue);
      default:
        return Array.isArray(cellValue) ?
          cellValue.some(cv => judge(cv)) : judge(cellValue);
    }
  }

  cellValueToString(cellValue: ICellValue): string | null {
    if (cellValue == null) {
      return null;
    }
    const rollUpType = this.rollUpType;
    if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType) && !LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
      try {
        switch (this.basicValueType) {
          case BasicValueType.Number:
          case BasicValueType.Boolean: {
            return numberFormat(cellValue, this.field.property?.formatting);
          }
          case BasicValueType.DateTime:
            return dateTimeFormat(cellValue, this.field.property.formatting as IDateTimeFieldProperty);
          case BasicValueType.String:
          case BasicValueType.Array:
            return String(cellValue);
        }
      } catch (error) {
        return 'compute error';
      }
    }
    return this.arrayValueToString(this.cellValueToArray(cellValue));
  }

  cellValueToArray(cellValue: ICellValue): any[] | null {
    // cellValue = handleNullArray(cellValue);
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const basicValueType = Field.bindContext(entityField, this.state).basicValueType;
    return cellValue == null ? null : (cellValue as ILookUpValue).reduce<any[]>((result, value) => {

      // number|boolean|datetime 类型不需要进行任何转换
      if (
        basicValueType === BasicValueType.Number ||
        basicValueType === BasicValueType.Boolean ||
        basicValueType === BasicValueType.DateTime
      ) {
        result.push(value);
        return result;
      }

      if (isTextBaseType(entityField.type)) {
        result.push(Field.bindContext(entityField!, this.state).cellValueToString(value));
        return result;
      }
      // BasicValueType.Array & value 为 Array 类型需要进行处理
      if (Array.isArray(value) || (value != null && basicValueType === BasicValueType.Array)) {
        [value].flat(Infinity).forEach(v => {
          result.push(Field.bindContext(entityField!, this.state).cellValueToString([(v as any)]));
        });
        return result;
      }
      result.push(Field.bindContext(entityField!, this.state).cellValueToString(value));
      return result;
    }, []);
  }

  arrayValueToString(cellValue: any[] | null): string | null {
    const rollUpType = this.field.property.rollUpType;
    let vArray = this.arrayValueToArrayStringValueArray(cellValue);
    // 对 ARRAYUNIQUE、ARRAYCOMPACT 函数进行处理
    if (rollUpType === RollUpFuncType.ARRAYUNIQUE) {
      vArray = vArray && [...new Set(vArray)];
    }
    if (rollUpType === RollUpFuncType.ARRAYCOMPACT) {
      vArray = vArray && vArray.filter(v => v !== '');
    }
    if (rollUpType === RollUpFuncType.CONCATENATE) {
      return vArray == null ? null : vArray.join('');
    }
    return vArray == null ? null : vArray.join(', ');
  }

  arrayValueToArrayStringValueArray(cellValue: any[] | null): (string | null)[] | null {
    cellValue = handleNullArray(cellValue);
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const basicValueType = Field.bindContext(entityField, this.state).basicValueType;
    return cellValue == null ? null : (cellValue as ILookUpValue).map<(string | null)>(value => {
      if (value == null) {
        return null;
      }
      // 日期类型要使用 lookup 字段配置的格式
      if (basicValueType === BasicValueType.DateTime) {
        const formatting = this.field.property.formatting as IDateTimeFieldProperty || entityField.property;
        return dateTimeFormat(value, formatting);
      }

      // number|boolean 类型要使用 lookup 字段配置的格式
      if (basicValueType === BasicValueType.Number || basicValueType === BasicValueType.Boolean) {
        if (!NOT_FORMAT_FUNC_SET.has(this.rollUpType)) {
          const property = this.field.property.formatting as INumberFormatFieldProperty || entityField.property;
          return numberFormat(value, property);
        }

        return Field.bindContext(entityField, this.state).cellValueToString(Number(value));
      }

      return String(value);
    }).filter(i => i != null);
  }

  cellValueToStdValue(cellValue: ICellValue | null): IStandardValue {
    cellValue = handleNullArray(cellValue);
    const stdValue: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (cellValue != null) {
      stdValue.data.push({ text: this.cellValueToString(cellValue) || '' });
    }

    return stdValue;
  }

  stdValueToCellValue(stdValue: IStandardValue): ICellValue | null {
    const lookUpEntityField = this.getLookUpEntityField();
    if (!lookUpEntityField) {
      return null;
    }
    const lookUpEntityFieldInstance = Field.bindContext(lookUpEntityField, this.state);
    return lookUpEntityFieldInstance.stdValueToCellValue(stdValue);
  }

  validate(value: any): boolean {
    return value == null;
  }

  /**
   * 是否多选值类型的字段。
   * 如多选，协作者字段，就是返回 true。
   * NOTE: 需要保证返回 true 的字段，value 是数组。
   */
  isMultiValueField(): boolean {
    return true;
  }

  defaultValueForCondition(
    condition: IFilterCondition,
  ): ICellValue {
    switch (this.valueType) {
      case BasicValueType.DateTime:
        return DateTimeBaseField._defaultValueForCondition(condition);
      default:
        return null;
    }
  }

  /**
   * 返回新增 record 时字段属性配置的默认值
   */
  defaultValue(): ICellValue {
    return null;
  }

  /**
   * @description 将统计的参数转换成中文
   */
  statType2text(type: StatType): string {
    const expression = this.getExpression();
    if (expression) {
      switch (this.basicValueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean:
        case BasicValueType.String:
        case BasicValueType.Array:
          return StatTranslate[type];
        case BasicValueType.DateTime:
          return DateTimeBaseField._statType2text(type);
      }
    }
    const lookUpEntityField = Field.bindContext(this.field, this.state).getLookUpEntityField();
    if (!lookUpEntityField) {
      return StatTranslate[type];
    }
    return Field.bindContext(lookUpEntityField, this.state).statType2text(type);
  }

  // 获取 lookup 字段依赖的字段，只获取一层关系
  getCurrentDatasheetRelatedFieldKeys(datasheetId: string) {
    const { relatedLinkFieldId, lookUpTargetFieldId, filterInfo, openFilter } = this.field.property;
    const allKeys: string[] = [];
    // 依赖当前表的 link 字段
    allKeys.push(`${datasheetId}-${relatedLinkFieldId}`);
    const relatedLinkField = this.getRelatedLinkField();
    if (relatedLinkField) {
      const { foreignDatasheetId } = relatedLinkField.property;
      allKeys.push(`${foreignDatasheetId}-${lookUpTargetFieldId}`);
      // 筛选字段触发神奇应用更新
      if (openFilter && filterInfo) {
        const { conditions } = filterInfo;
        conditions.forEach(condition => {
          allKeys.push(`${foreignDatasheetId}-${condition.fieldId}`);
        });
      }
    }
    return allKeys;
  }

  cellValueToApiStandardValue(cellValue: ICellValue): any[] | null {
    cellValue = handleNullArray(cellValue);
    const entityField = this.getLookUpEntityField();
    if (!entityField || !cellValue) {
      return null;
    }
    if (Array.isArray(cellValue)) {
      const targetField = Field.bindContext(entityField, this.state);
      if (targetField.basicValueType === BasicValueType.Array) {
        return targetField.cellValueToApiStandardValue(cellValue);
      }
      const result: ICellValue[] = [];
      cellValue.forEach(item => {
        const value = targetField.cellValueToApiStandardValue(item);
        if (value != null) {
          result.push(value);
        }
      });
      if (result.length) {
        return result;
      }
      return null;
    }
    return cellValue as any;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    cellValue = handleNullArray(cellValue);
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    if (entityField.type == FieldType.Member || entityField.type == FieldType.CreatedBy || entityField.type == FieldType.LastModifiedBy) {
      return Field.bindContext(entityField, this.state).cellValueToApiStringValue(cellValue as any);
    }
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: ICellValue): BasicOpenValueType | null {
    if (cellValue == null) {
      return null;
    }

    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const expression = this.getExpression();
    if (expression) {
      // 存在表达式时，输出值类型为基础类型，可以直接输出
      switch (this.valueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean:
        case BasicValueType.DateTime:
        case BasicValueType.String:
        default:
          return cellValue as any;
      }
    }
    // 这2个是 array 转化为 string 的函数。
    if (LOOKUP_VALUE_FUNC_SET.has(this.rollUpType)) {
      return this.cellValueToString(cellValue);
    }
    // 这里进来的是一维数组，先兼容成二维数组。
    if (Array.isArray(cellValue)) {
      const targetField = Field.bindContext(entityField, this.state);
      // TODO 临时兼容一下数据结构（等 getCellValue 改造成返回未拍平数组）
      const isDoubleArray = this.openValueJsonSchema.items?.type === 'array';
      // 预期的二维数组，在 cv 的时候已经拍平了，这里包一下，升级为二维数组。现在只是结构上的兼容，会影响实际的业务逻辑。
      // 在机器人场景中，UI 输入的的值目前都是拼接成 string，所以不太影响。
      const _cellValue = isDoubleArray ? [(cellValue as any[]).filter(cv => cv != null)] : cellValue;
      const result: BasicOpenValueTypeBase[] = (_cellValue as ILookUpValue)
        .map(item => targetField.cellValueToOpenValue(item) as BasicOpenValueTypeBase);
      if (result.length) {
        return result;
      }
      return null;
    }
    return cellValue;
  }

  // TODO
  openWriteValueToCellValue() {
    return null;
  }

  get openFieldProperty(): IOpenMagicLookUpFieldProperty {
    const res: IOpenMagicLookUpFieldProperty = {
      relatedLinkFieldId: this.field.property.relatedLinkFieldId,
      targetFieldId: this.field.property.lookUpTargetFieldId,
      rollupFunction: this.rollUpType,
    };

    if (this.hasError) {
      res.hasError = this.hasError;
      return res;
    }

    res.valueType = this.basicValueType;
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo();
    if (lookUpEntityFieldInfo) {
      res.entityField = {
        datasheetId: lookUpEntityFieldInfo.datasheetId,
        field: Field.bindContext(lookUpEntityFieldInfo.field, this.state).getOpenField(lookUpEntityFieldInfo.datasheetId)
      };
    }

    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  static openUpdatePropertySchema = Joi.object({
    relatedLinkFieldId: Joi.string().pattern(/^fld.+/, 'fieldId').required(),
    targetFieldId: Joi.string().pattern(/^fld.+/, 'fieldId').required(),
    rollupFunction: Joi.valid(...enumToArray(RollUpFuncType)),
    format: computedFormattingStr(),
  });

  validateUpdateOpenProperty(updateProperty: IUpdateOpenMagicLookUpFieldProperty) {
    return LookUpField.openUpdatePropertySchema.validate(updateProperty);
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenMagicLookUpFieldProperty): ILookUpProperty {
    const { relatedLinkFieldId, targetFieldId: lookUpTargetFieldId, rollupFunction: rollUpType, format } = openFieldProperty;
    const formatting: IComputedFieldFormattingProperty | undefined = format ? computedFormattingToFormat(format) : undefined;
    return {
      datasheetId: this.field.property.datasheetId,
      relatedLinkFieldId,
      lookUpTargetFieldId,
      rollUpType,
      formatting
    };
  }
}
