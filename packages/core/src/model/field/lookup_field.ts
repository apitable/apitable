/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { getComputeRefManager } from 'compute_manager';
import { ViewFilterDerivate } from 'compute_manager/view_derivate/slice/view_filter_derivate';
import { Strings, t } from 'exports/i18n';
import { sortRowsBySortInfo } from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { getUserTimeZone } from 'modules/user/store/selectors/user';
import { getCellValue, _getLookUpTreeValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { getFieldMap }from 'modules/database/store/selectors/resource/datasheet/calc';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { ROLLUP_KEY_WORDS } from 'formula_parser/consts';
import { evaluate, parse } from 'formula_parser/evaluate';
import { Functions } from 'formula_parser/functions';
import Joi from 'joi';
import { isEmpty, uniqWith, zip } from 'lodash';
import { ValueTypeMap } from 'model/constants';
import { computedFormattingToFormat, getFieldTypeByString, handleNullArray } from 'model/utils';
import { getFieldTypeString } from 'model/utils';
import { APIMetaFieldType } from 'types';
import { IAPIMetaLookupFieldProperty } from 'types/field_api_property_types';
import { BasicOpenValueType, BasicOpenValueTypeBase } from 'types/field_types_open';
import { IOpenMagicLookUpFieldProperty } from 'types/open/open_field_read_types';
import { IEffectOption, IUpdateOpenMagicLookUpFieldProperty } from 'types/open/open_field_write_types';
import { getApiMetaPropertyFormat } from 'model/field/utils';

import {
  IOpenFilterValue,
  IOpenFilterValueBoolean,
  IOpenFilterValueDataTime,
  IOpenFilterValueNumber,
  IOpenFilterValueString,
} from 'types/open/open_filter_types';
import { checkTypeSwitch, filterOperatorAcceptsValue, getNewIds, IDPrefix, isTextBaseType } from 'utils';
import { isClient } from 'utils/env';
import { IReduxState, IViewRow } from '../../exports/store/interfaces';
import {
  BasicValueType,
  FieldType,
  IComputedFieldFormattingProperty,
  IDateTimeFieldProperty,
  IField,
  ILinkField,
  ILinkIds,
  ILookUpField,
  ILookUpProperty,
  ILookUpSortInfo,
  INumberFormatFieldProperty,
  IOneWayLinkField,
  IStandardValue,
  ITimestamp,
  IUnitIds,
  LookUpLimitType,
  RollUpFuncType,
} from '../../types/field_types';
import {
  FilterConjunction,
  FOperator,
  FOperatorDescMap,
  IFilterCheckbox,
  IFilterCondition,
  IFilterDateTime,
  IFilterInfo,
  IFilterText,
} from '../../types/view_types';
import { ICellToStringOption, ICellValue, ICellValueBase, ILookUpValue } from '../record';
import { CheckboxField } from './checkbox_field';
import { DateTimeBaseField, dateTimeFormat } from './date_time_base_field';
import { ArrayValueField } from './array_field';
import { Field } from './field';
import { NumberBaseField, numberFormat } from './number_base_field';
import { StatTranslate, StatType } from './stat';
import { TextBaseField } from './text_base_field';
import { computedFormatting, computedFormattingStr, datasheetIdString, enumToArray, joiErrorResult } from './validate_schema';
import { getFieldDefaultProperty } from './const';

export interface ILookUpTreeValue {
  datasheetId: string;
  recordId: string;
  field: IField;
  cellValue: ICellValue | ILookUpTreeValue[];
}

// function that needs to output as-is
export const ORIGIN_VALUES_FUNC_SET = new Set([RollUpFuncType.VALUES, RollUpFuncType.ARRAYUNIQUE, RollUpFuncType.ARRAYCOMPACT]);

// Functions that need to be displayed by string concatenation
export const LOOKUP_VALUE_FUNC_SET = new Set([RollUpFuncType.ARRAYJOIN, RollUpFuncType.CONCATENATE]);

// Functions that don't require number formatting
export const NOT_FORMAT_FUNC_SET = new Set([
  RollUpFuncType.ARRAYJOIN,
  RollUpFuncType.CONCATENATE,
  RollUpFuncType.ARRAYUNIQUE,
  RollUpFuncType.ARRAYCOMPACT,
]);

const filterInfoSchema = () =>
  Joi.object({
    conjunction: Joi.valid(...enumToArray(FilterConjunction)).required(),
    conditions: Joi.array().items(
      Joi.object({
        conditionId: Joi.string().required(),
        fieldId: Joi.string()
          .pattern(/^fld.+/, 'fieldId')
          .required(),
        operator: Joi.valid(...enumToArray(FOperator)).required(),
        fieldType: Joi.valid(...enumToArray(FieldType)).required(),
        value: Joi.any(),
      }),
    ),
  });

const apiFilterInfoSchema = (isBackend: boolean) =>
  Joi.object({
    conjunction: Joi.valid(...enumToArray(FilterConjunction)).required(),
    conditions: Joi.array().items(
      Joi.object({
        fieldId: Joi.string()
          .pattern(/^fld.+/, 'fieldId')
          .required(),
        operator: Joi.valid(...enumToArray(FOperator)).required(),
        value: Joi.any(),
        ...(isBackend
          ? {}
          : {
            fieldType: Joi.valid(...enumToArray(APIMetaFieldType)).required(),
          }),
      }),
    ),
  });

const sortInfoSchema = () =>
  Joi.object({
    rules: Joi.array()
      .items(
        Joi.object({
          fieldId: Joi.string().required(),
          desc: Joi.boolean().required(),
        }),
      )
      .length(1)
      .required(),
  });

export class LookUpField extends ArrayValueField {
  constructor(public override field: ILookUpField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    relatedLinkFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    lookUpTargetFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    rollUpType: Joi.valid(...enumToArray(RollUpFuncType)),
    formatting: computedFormatting(),
    filterInfo: filterInfoSchema(),
    openFilter: Joi.boolean(),
    lookUpLimit: Joi.valid(...enumToArray(LookUpLimitType)),
    sortInfo: sortInfoSchema(),
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
      enableFilterSort: this.field.property.openFilter,
      sortInfo: this.field.property.sortInfo,
      lookUpLimit: this.field.property.lookUpLimit,
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
        field: Field.bindContext(lookUpEntityFieldInfo.field, this.state).getApiMeta(lookUpEntityFieldInfo.datasheetId),
      };
    }

    if (this.field.property.filterInfo) {
      res.filterInfo = {
        conjunction: this.field.property.filterInfo.conjunction,
        conditions: this.field.property.filterInfo.conditions.map((cond) => ({
          fieldId: cond.fieldId,
          fieldType: getFieldTypeString(cond.fieldType),
          operator: cond.operator,
          value: cond.value,
        })),
      };
    }

    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  /**
   * Has the value type changed? (Is it still an array of entity field values?)
   * - unchanged: Calculated according to entity field openValue JsonSchema
   * - changed: push down jsonSchema by output value type
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
      // When there is an expression, the output value type base type
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
      items: entityFieldSchema,
    };
  }

  override get canGroup(): boolean {
    if (this.hasError) {
      return false;
    }
    const lookUpEntityField = Field.bindContext(this.field, this.state).getLookUpEntityField();
    if (!lookUpEntityField) {
      return false;
    }
    return Field.bindContext(lookUpEntityField, this.state).canGroup;
  }

  override get hasError(): boolean {
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

  override get warnText(): string {
    const { typeSwitch: isFilterTypeSwitch } = this.checkFilterInfo();
    return isFilterTypeSwitch ? t(Strings.lookup_filter_waring) : '';
  }

  // statistic options
  override get statTypeList() {
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

  // When the underlying type is Array, get the underlying type of the elements in the Array
  override get innerBasicValueType(): BasicValueType {
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return BasicValueType.String;
    }

    const valueType = Field.bindContext(entityField, this.state).basicValueType;
    // The array in the array is still an array,
    // indicating that it is a multi-select field, and it can be specified as a string directly.
    return valueType === BasicValueType.Array ? BasicValueType.String : valueType;
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.LookUp) as ILookUpProperty;
  }

  override get isComputed() {
    return true;
  }

  get rollUpType() {
    return this.field.property.rollUpType || RollUpFuncType.VALUES;
  }

  override showFOperatorDesc(type: FOperator) {
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

  // filter options
  override get acceptFilterOperators() {
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
    return Field.bindContext(entityField, this.state).acceptFilterOperators.filter((item) => item !== FOperator.IsRepeat);
  }

  getLinkFields(): (ILinkField | IOneWayLinkField)[] {
    const snapshot = getSnapshot(this.state, this.field.property.datasheetId);
    const fieldMap = snapshot?.meta.fieldMap;
    return fieldMap ? (Object.values(fieldMap).filter((field) =>
      [FieldType.Link, FieldType.OneWayLink].includes(field.type)) as (ILinkField | IOneWayLinkField)[]) : [];
  }

  getRelatedLinkField(): ILinkField | IOneWayLinkField | undefined {
    return this.getLinkFields().find((field) => field.id === this.field.property.relatedLinkFieldId);
  }

  getLookUpEntityFieldDepth(visitedFields?: Set<string>, depth?: number): number {
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo(visitedFields, depth);
    if (!lookUpEntityFieldInfo) {
      return 0;
    }
    return lookUpEntityFieldInfo.depth;
  }

  // Allow lookup lookup lookup fields, but there will always be an entity field in the end.
  // Returns entity fields and the depth of the fields.
  getLookUpEntityFieldInfo(
    visitedFields?: Set<string>,
    depth?: number,
  ):
    | {
        field: IField;
        depth: number;
        datasheetId: string;
      }
    | undefined {
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

  // Allow lookup lookup lookup fields, but there will always be an entity field in the end.
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

  // Check whether the column corresponding to the filter condition is deleted,
  // check whether the column corresponding to the filter condition switches the type
  /**
   * Check whether the column corresponding to the filter condition is deleted
   * Check whether the column corresponding to the filter condition switches the type
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
          typeSwitch: false,
        };
      }
      const { foreignDatasheetId } = relatedLinkField.property;
      const foreignSnapshot = getSnapshot(this.state, foreignDatasheetId)!;
      const foreignFieldMap = foreignSnapshot.meta.fieldMap;
      const { conditions } = filterInfo;
      conditions.forEach((c) => {
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
   * Get the information of the search target field, return the field and datasheetId information
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
    const field = foreignSnapshot.meta.fieldMap[lookUpTargetFieldId]!;
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
      const record = snapshot.recordMap[recordId]!;
      return evaluate(expression, { field: this.field, record, state: this.state }, withError);
    }
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const flatCellValue = this.getFlatCellValue(recordId, true); // The underlying cv value should remain empty.
    if (Array.isArray(flatCellValue) && flatCellValue.length) {
      // Fields of text type store all character fragments, flat needs to retain the original information and cannot be completely flattened
      const _flatCellValue = isTextBaseType(entityField.type) ? flatCellValue : (flatCellValue as any)?.flat(1);
      switch (this.rollUpType) {
        case RollUpFuncType.VALUES:
        case RollUpFuncType.ARRAYJOIN:
        case RollUpFuncType.CONCATENATE:
          return _flatCellValue;
        case RollUpFuncType.ARRAYUNIQUE:
          return uniqWith(_flatCellValue as any[], (cv1, cv2) => Field.bindContext(entityField, this.state).eq(cv1, cv2));
        case RollUpFuncType.ARRAYCOMPACT:
          return (_flatCellValue as ILookUpValue).filter((v) => v !== '' || v != null);
        default:
          return flatCellValue;
      }
    }
    return flatCellValue;
  }

  // Get the flat lookup cell data
  // For non-text concatenated data,
  getFlatCellValue(recordId: string, withEmpty?: boolean): ICellValue {
    // Starting from the current record, recursively search the lookup tree.
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
      values.forEach((value) => {
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
    return withEmpty ? flatCellValues : flatCellValues.filter((item) => item !== null);
  }

  /**
   * getLookUpTreeValue getCellvalue Recursively query the data of entity fields and combine them into tree-structured data
   *
   * @param {string} recordId
   * @param {string} [datasheetId]
   * @returns {ILookUpTreeValue[]}
   * @memberof LookUpField
   */
  getLookUpTreeValue(recordId: string): ILookUpTreeValue[] {
    // The column corresponding to the filter condition is deleted and the result is not displayed
    const { error: isFilterError } = this.checkFilterInfo();
    if (isFilterError) {
      return [];
    }
    const relatedLinkField = this.getRelatedLinkField();
    if (!relatedLinkField) {
      // console.log('Cannot find foreign key field', relatedLinkField);
      return [];
    }
    const { lookUpTargetFieldId, datasheetId, filterInfo, openFilter, sortInfo, lookUpLimit } = this.field.property;
    const thisSnapshot = getSnapshot(this.state, datasheetId)!;
    // IDs of the associated table records
    let recordIds = getCellValue(this.state, thisSnapshot, recordId, relatedLinkField.id, true, datasheetId, true) as ILinkIds;

    if (!recordIds) {
      return [];
    }
    const { foreignDatasheetId } = relatedLinkField.property;
    const foreignSnapshot = getSnapshot(this.state, foreignDatasheetId);
    if (!foreignSnapshot) {
      return [];
    }
    const lookUpTargetField = this.getLookUpTargetField() as IField;

    if (openFilter) {
      // lookup filter
      recordIds = new ViewFilterDerivate(this.state, foreignDatasheetId).getFilteredRecords({
        linkFieldRecordIds: recordIds,
        filterInfo,
      });
      // lookup sort
      const sortRows = this.getSortLookup(sortInfo, foreignDatasheetId, recordIds);

      recordIds = sortRows.filter((row) => recordIds.includes(row.recordId)).map((row) => row.recordId);
    }

    if (lookUpLimit === LookUpLimitType.FIRST && recordIds.length > 1) {
      recordIds = recordIds.slice(0, 1);
    }

    return recordIds && recordIds.length
      ? recordIds.map((recordId: string) => {
        const cellValue = _getLookUpTreeValue(this.state, foreignSnapshot, recordId, lookUpTargetFieldId, foreignDatasheetId);
        return {
          field: lookUpTargetField,
          recordId,
          cellValue,
          datasheetId: foreignDatasheetId,
        };
      })
      : [];
  }

  getSortLookup(sortInfo: ILookUpSortInfo | undefined, datasheetId: string, recordIds: string[]): IViewRow[] {
    const snapshot = this.state.datasheetMap[datasheetId]?.datasheet!.snapshot;
    if (!snapshot) {
      return [];
    }
    const rows = snapshot?.meta?.views[0]?.rows!.filter((row) => recordIds.includes(row.recordId));
    if (!rows) {
      return [];
    }
    return sortInfo ? sortRowsBySortInfo(this.state, rows, sortInfo.rules, snapshot) : rows;
  }

  override isEmptyOrNot(operator: FOperator.IsEmpty | FOperator.IsNotEmpty, cellValue: ICellValue) {
    cellValue = handleNullArray(cellValue);
    switch (operator) {
      /**
       * The logic of isEmpty and isNotEmpty is basically common
       */
      case FOperator.IsEmpty: {
        return cellValue == null;
      }

      case FOperator.IsNotEmpty: {
        return cellValue != null;
      }
    }
  }

  // lookup does not allow editing cells
  override recordEditable(): boolean {
    return false;
  }

  /**
   *
   * Compare the size of the two cellValues on the field for sorting
   * The default is to convert to string comparison, if it is not this logic, please implement it yourself
   *
   * @orderInCellValueSensitive {boolean} optional parameter, to determine whether to only do normal sorting for the associated field,
   * without preprocessing the cell content
   *
   * @returns {number} negative => less than, 0 => equal, positive => greater than
   */
  override compare(cv1: ICellValue, cv2: ICellValue, orderInCellValueSensitive?: boolean): number {
    const expression = this.getExpression();
    cv1 = handleNullArray(cv1);
    cv2 = handleNullArray(cv2);
    if (expression) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._compare(cv1 as number, cv2 as number);
        case BasicValueType.DateTime:
          return DateTimeBaseField._compare(cv1 as ITimestamp, cv2 as ITimestamp, this.field.property.formatting as IDateTimeFieldProperty);
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
      const [cv1, cv2] = zipCellValue[index]!;
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

  override isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: IFilterCondition['value']) {
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
            // The filter operation of negative semantics requires that each item in the array satisfies
            case FOperator.DoesNotContain:
            case FOperator.IsNot:
            case FOperator.IsEmpty:
              return (cellValue as ICellValue[]).every((cv) => {
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
              return (cellValue as ICellValue[]).some((cv) => {
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
    const judge = (cv: ICellValue) => {
      return Field.bindContext(entityField, this.state).isMeetFilter(operator, cv, conditionValue);
    };
    // The cv of the lookup is already the value after flat, and the original field value is an array, using common comparison logic.
    if (Field.bindContext(entityField, this.state).basicValueType === BasicValueType.Array && operator !== FOperator.IsRepeat) {
      // Due to the existence of the "me" filter item, cellValue and conditionValue are not congruent,
      // For Member type directly use isMeetFilter for calculation, it will convert the 'Self' tag into the corresponding UnitId for comparison
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
      // The `filter` operation of negative semantics requires that each item in the array satisfies
      case FOperator.DoesNotContain:
      case FOperator.IsNot:
      case FOperator.IsEmpty:
        return Array.isArray(cellValue) ? (cellValue as ICellValue[]).every((cv) => judge(cv)) : judge(cellValue);
      default:
        return Array.isArray(cellValue) ? (cellValue as ILookUpValue).some((cv) => judge(cv)) : judge(cellValue);
    }
  }

  cellValueToString(cellValue: ICellValue, _options?: ICellToStringOption): string | null {
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
            return dateTimeFormat(cellValue, this.field.property.formatting as IDateTimeFieldProperty, getUserTimeZone(this.state));
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
    return cellValue == null
      ? null
      : (cellValue as ILookUpValue).reduce<any[]>((result, value) => {
        // number|boolean|datetime type does not need any conversion
        if (basicValueType === BasicValueType.Number || basicValueType === BasicValueType.Boolean || basicValueType === BasicValueType.DateTime) {
          result.push(value);
          return result;
        }

        if (isTextBaseType(entityField.type)) {
          result.push(Field.bindContext(entityField!, this.state).cellValueToString(value));
          return result;
        }
        // BasicValueType.Array & value is of Array type and needs to be processed
        if (Array.isArray(value) || (value != null && basicValueType === BasicValueType.Array)) {
          [value].flat(Infinity).forEach((v) => {
            result.push(Field.bindContext(entityField!, this.state).cellValueToString([v as any]));
          });
          return result;
        }
        result.push(Field.bindContext(entityField!, this.state).cellValueToString(value));
        return result;
      }, []);
  }

  arrayValueToString(cellValue: any[] | null, options?: ICellToStringOption): string | null {
    const rollUpType = this.field.property.rollUpType;
    let vArray = this.arrayValueToArrayStringValueArray(cellValue, options);
    // Process ARRAYUNIQUE, ARRAYCOMPACT functions
    if (rollUpType === RollUpFuncType.ARRAYUNIQUE) {
      vArray = vArray && [...new Set(vArray)];
    }
    if (rollUpType === RollUpFuncType.ARRAYCOMPACT) {
      vArray = vArray && vArray.filter((v) => v !== '');
    }
    if (rollUpType === RollUpFuncType.CONCATENATE) {
      return vArray == null ? null : vArray.join('');
    }
    return vArray == null ? null : vArray.join(', ');
  }

  arrayValueToArrayStringValueArray(cellValue: any[] | null, _options?: ICellToStringOption): (string | null)[] | null {
    cellValue = handleNullArray(cellValue);
    const entityField = this.getLookUpEntityField();
    if (!entityField) {
      return null;
    }
    const basicValueType = Field.bindContext(entityField, this.state).basicValueType;
    return cellValue == null
      ? null
      : (cellValue as ILookUpValue)
        .map<string | null>((value) => {
          if (value == null) {
            return null;
          }
          // Date type should use the format configured by the lookup field
          if (basicValueType === BasicValueType.DateTime) {
            const formatting = (this.field.property.formatting as IDateTimeFieldProperty) || entityField.property;
            return dateTimeFormat(value, formatting, getUserTimeZone(this.state));
          }

          // The number|boolean type should use the format configured by the lookup field
          if (basicValueType === BasicValueType.Number || basicValueType === BasicValueType.Boolean) {
            if (!NOT_FORMAT_FUNC_SET.has(this.rollUpType)) {
              const property = (this.field.property.formatting as INumberFormatFieldProperty) || entityField.property;
              return numberFormat(value, property);
            }

            return Field.bindContext(entityField, this.state).cellValueToString(Number(value));
          }

          return String(value);
        })
        .filter((i) => i != null);
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
   * Whether to multi-select fields of value type.
   * For multiple selections, the collaborator field will return true.
   * NOTE: Fields that are guaranteed to return true, value is an array.
   */
  override isMultiValueField(): boolean {
    return true;
  }

  defaultValueForCondition(condition: IFilterCondition): ICellValue {
    switch (this.valueType) {
      case BasicValueType.DateTime:
        return DateTimeBaseField._defaultValueForCondition(condition);
      default:
        return null;
    }
  }

  /**
   * Returns the default value of the field attribute configuration when adding a record
   */
  override defaultValue(): ICellValue {
    return null;
  }

  /**
   * @description convert the statistical parameters into Chinese
   */
  override statType2text(type: StatType): string {
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

  // Get the fields that the lookup field depends on, and only get one level of relationship
  getCurrentDatasheetRelatedFieldKeys(datasheetId: string) {
    const { relatedLinkFieldId, lookUpTargetFieldId, filterInfo, openFilter } = this.field.property;
    const allKeys: string[] = [];
    // Depends on the link field of the current table
    allKeys.push(`${datasheetId}-${relatedLinkFieldId}`);
    const relatedLinkField = this.getRelatedLinkField();
    if (relatedLinkField) {
      const { foreignDatasheetId } = relatedLinkField.property;
      allKeys.push(`${foreignDatasheetId}-${lookUpTargetFieldId}`);
      // filter field triggers magic app update
      if (openFilter && filterInfo) {
        const { conditions } = filterInfo;
        conditions.forEach((condition) => {
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
      (cellValue as ILookUpValue).forEach((item) => {
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
      // When there is an expression, the output value type is the basic type, which can be output directly
      switch (this.valueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean:
        case BasicValueType.DateTime:
        case BasicValueType.String:
        default:
          return cellValue as any;
      }
    }
    // These two are functions that convert array to string.
    if (LOOKUP_VALUE_FUNC_SET.has(this.rollUpType)) {
      return this.cellValueToString(cellValue);
    }
    // What comes in here is a one-dimensional array, first compatible with a two-dimensional array.
    if (Array.isArray(cellValue)) {
      const targetField = Field.bindContext(entityField, this.state);
      // TODO is temporarily compatible with the data structure (wait for getCellValue to be transformed to return an unflattened array)
      const isDoubleArray = this.openValueJsonSchema.items?.type === 'array';
      // The expected two-dimensional array has been flattened at the time of cv,
      // and it is packaged here and upgraded to a two-dimensional array.
      // Now it is only a structural compatibility, which will affect the actual business logic.
      // In the robot scene, the values input by the UI are currently spliced into strings, so it doesn't matter much.
      const _cellValue = isDoubleArray ? [(cellValue as any[]).filter((cv) => cv != null)] : cellValue;
      const result: BasicOpenValueTypeBase[] = (_cellValue as ILookUpValue).map(
        (item) => targetField.cellValueToOpenValue(item) as BasicOpenValueTypeBase,
      );
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

  override get openFieldProperty(): IOpenMagicLookUpFieldProperty {
    const res: IOpenMagicLookUpFieldProperty = {
      relatedLinkFieldId: this.field.property.relatedLinkFieldId,
      targetFieldId: this.field.property.lookUpTargetFieldId,
      rollupFunction: this.rollUpType,
      enableFilterSort: this.field.property.openFilter,
      sortInfo: this.field.property.sortInfo,
      lookUpLimit: this.field.property.lookUpLimit,
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
        field: Field.bindContext(lookUpEntityFieldInfo.field, this.state).getOpenField(lookUpEntityFieldInfo.datasheetId),
      };
    }

    if (this.field.property.filterInfo) {
      res.filterInfo = {
        conjunction: this.field.property.filterInfo.conjunction,
        conditions: this.field.property.filterInfo.conditions.map((cond) => ({
          fieldId: cond.fieldId,
          fieldType: getFieldTypeString(cond.fieldType),
          operator: cond.operator,
          value: cond.value,
        })),
      };
    }

    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  static frontendOpenUpdatePropertySchema = Joi.object({
    relatedLinkFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    targetFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    rollupFunction: Joi.valid(...enumToArray(RollUpFuncType)),
    format: computedFormattingStr(),
    enableFilterSort: Joi.boolean(),
    filterInfo: apiFilterInfoSchema(false),
    sortInfo: sortInfoSchema(),
    lookUpLimit: Joi.valid(...enumToArray(LookUpLimitType)),
  });

  static backendOpenUpdatePropertySchema = Joi.object({
    relatedLinkFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    targetFieldId: Joi.string()
      .pattern(/^fld.+/, 'fieldId')
      .required(),
    rollupFunction: Joi.valid(...enumToArray(RollUpFuncType)),
    format: computedFormattingStr(),
    enableFilterSort: Joi.boolean(),
    filterInfo: apiFilterInfoSchema(true),
    sortInfo: sortInfoSchema(),
    lookUpLimit: Joi.valid(...enumToArray(LookUpLimitType)),
  });

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenMagicLookUpFieldProperty, effectOption?: IEffectOption) {
    return effectOption?.isBackend
      ? LookUpField.backendOpenUpdatePropertySchema.validate(updateProperty)
      : LookUpField.frontendOpenUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenMagicLookUpFieldProperty): ILookUpProperty {
    const {
      relatedLinkFieldId,
      targetFieldId: lookUpTargetFieldId,
      rollupFunction: rollUpType,
      format,
      enableFilterSort,
      filterInfo: apiFilterInfo,
      sortInfo,
      lookUpLimit,
    } = openFieldProperty;
    const formatting: IComputedFieldFormattingProperty | undefined = format ? computedFormattingToFormat(format) : undefined;
    let filterInfo: IFilterInfo | undefined;
    if (apiFilterInfo) {
      const conditionIds = getNewIds(IDPrefix.Condition, apiFilterInfo.conditions.length);
      filterInfo = {
        conjunction: apiFilterInfo.conjunction,
        conditions: apiFilterInfo.conditions.map((cond, i) => {
          const _fieldType = getFieldTypeByString(cond.fieldType)!;
          return {
            ...cond,
            fieldType: _fieldType,
            operator: cond.operator,
            conditionId: conditionIds[i]!,
            value: (filterOperatorAcceptsValue(cond.operator)
              ? cond.fieldType === APIMetaFieldType.Checkbox || Array.isArray(cond.value)
                ? cond.value
                : [cond.value]
              : undefined) as any,
          };
        }),
      };
    }
    return {
      datasheetId: this.field.property.datasheetId,
      relatedLinkFieldId,
      lookUpTargetFieldId,
      rollUpType,
      formatting,
      openFilter: enableFilterSort,
      filterInfo,
      sortInfo,
      lookUpLimit,
    };
  }

  override filterValueToOpenFilterValue(value: any): IOpenFilterValue {
    if (this.getExpression()) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._filterValueToOpenFilterValue(value as IFilterText);
        case BasicValueType.Boolean:
          return CheckboxField._filterValueToOpenFilterValue(value as IFilterCheckbox);
        case BasicValueType.String:
          return TextBaseField._filterValueToOpenFilterValue(value as IFilterText);
        case BasicValueType.DateTime:
          return DateTimeBaseField._filterValueToOpenFilterValue(value as IFilterDateTime);
      }
    }

    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo();
    if (!lookUpEntityFieldInfo) {
      return null;
    }
    const entityField = Field.bindContext(lookUpEntityFieldInfo.field, this.state);
    return entityField.filterValueToOpenFilterValue(value);
  }

  override openFilterValueToFilterValue(value: IOpenFilterValue): any {
    if (this.getExpression()) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._openFilterValueToFilterValue(value as IOpenFilterValueNumber);
        case BasicValueType.Boolean:
          return CheckboxField._openFilterValueToFilterValue(value as IOpenFilterValueBoolean);
        case BasicValueType.String:
          return TextBaseField._openFilterValueToFilterValue(value as IOpenFilterValueString);
        case BasicValueType.DateTime:
          return DateTimeBaseField._openFilterValueToFilterValue(value as IOpenFilterValueDataTime);
      }
    }
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo();
    if (!lookUpEntityFieldInfo) {
      return null;
    }
    const entityField = Field.bindContext(lookUpEntityFieldInfo.field, this.state);
    return entityField.openFilterValueToFilterValue(value);
  }

  override validateOpenFilterValue(value: IOpenFilterValue) {
    if (this.getExpression()) {
      switch (this.valueType) {
        case BasicValueType.Number:
          return NumberBaseField._validateOpenFilterValue(value as IOpenFilterValueNumber);
        case BasicValueType.Boolean:
          return CheckboxField._validateOpenFilterValue(value as IOpenFilterValueBoolean);
        case BasicValueType.String:
          return TextBaseField._validateOpenFilterValue(value as IOpenFilterValueString);
        case BasicValueType.DateTime:
          return DateTimeBaseField._validateOpenFilterValue(value as IOpenFilterValueDataTime);
      }
    }
    const lookUpEntityFieldInfo = this.getLookUpEntityFieldInfo();
    if (!lookUpEntityFieldInfo) {
      return joiErrorResult(`${this.field.name} look up has no entity field`);
    }
    const entityField = Field.bindContext(lookUpEntityFieldInfo.field, this.state);
    return entityField.openFilterValueToFilterValue(value);
  }
}
