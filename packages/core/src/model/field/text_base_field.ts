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

import Joi from 'joi';
import { isNumber, isString } from 'lodash';
import { ICellValue } from 'model/record';
import { isNullValue } from 'model/utils';
import { FOperator, FOperatorDescMap, IAddOpenFieldProperty, IAPIMetaTextBaseFieldProperty, IFilterCondition, IFilterText } from 'types';
import {
  BasicValueType, FieldType, IEmailField, IPhoneField, ISegment, ISingleTextField, IStandardValue, ITextField, IURLField, SegmentType,
} from 'types/field_types';
import { IOpenFilterValueString } from 'types/open/open_filter_types';
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

  override showFOperatorDesc(type: FOperator) {
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
    if ([FieldType.MultiSelect, FieldType.Link, FieldType.OneWayLink, FieldType.Attachment, FieldType.Member].includes(sourceType)) {
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
    // There is no default padding logic for text type filtering\
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

  // The formatted string is directly passed in here
  static _isMeetFilter(
    operator: FOperator, cellText: string | null, conditionValue: IFilterText,
    optFn?: {
      containsFn?: (filterValue: string) => boolean,
      doesNotContainFn?: (filterValue: string) => boolean
      defaultFn?: () => boolean,
    }
  ) {
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
    const { containsFn, defaultFn, doesNotContainFn } = optFn || {};
    switch (operator) {
      case FOperator.Is: {
        return cellText != null && cellText.trim().toLowerCase() === filterValue.trim().toLowerCase();
      }

      case FOperator.IsNot: {
        return cellText == null || cellText.trim().toLowerCase() !== filterValue.trim().toLowerCase();
      }

      case FOperator.Contains: {
        if (containsFn) {
          return containsFn(filterValue);
        }
        return cellText != null && TextBaseField.stringInclude(cellText, filterValue);
      }

      case FOperator.DoesNotContain: {
        if (doesNotContainFn) {
          return doesNotContainFn(filterValue);
        }
        return cellText == null || !TextBaseField.stringInclude(cellText, filterValue);
      }
      default: {
        if (defaultFn) {
          return defaultFn();
        }
        return false;
      }
    }
  }

  override eq(cv1: ISegment[] | null, cv2: ISegment[] | null): boolean {
    return this.cellValueToString(cv1) === this.cellValueToString(cv2);
  }

  override isMeetFilter(operator: FOperator, cellValue: ISegment[] | null, conditionValue: Exclude<IFilterText, null>) {
    const cellText = this.cellValueToString(cellValue);
    return TextBaseField._isMeetFilter(operator, cellText, conditionValue, {
      containsFn: (filterValue: string) => cellText != null && this.stringInclude(cellText, filterValue),
      doesNotContainFn: (filterValue: string) => cellText == null || !this.stringInclude(cellText, filterValue),
      defaultFn: () => super.isMeetFilter(operator, cellValue, conditionValue)
    });
  }

  cellValueToApiStandardValue(cellValue: ISegment[] | null): ISegment |string | null {
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

  override validateAddOpenFieldProperty(updateProperty: IAddOpenFieldProperty) {
    if (this.field.type !== FieldType.SingleText && updateProperty === null) {
      return { error: undefined, value: null };
    }
    return this.validateUpdateOpenProperty(updateProperty);
  }

  static _filterValueToOpenFilterValue(value: IFilterText): IOpenFilterValueString {
    return value?.[0] ?? null;
  }

  override filterValueToOpenFilterValue(value: IFilterText): IOpenFilterValueString {
    return TextBaseField._filterValueToOpenFilterValue(value);
  }

  static _openFilterValueToFilterValue(value: IOpenFilterValueString): IFilterText {
    return value === null ? null : [value];
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueString): IFilterText {
    return TextBaseField._openFilterValueToFilterValue(value);
  }

  static validateOpenFilterSchema = Joi.string().allow(null);

  static _validateOpenFilterValue(value: IOpenFilterValueString) {
    return TextBaseField.validateOpenFilterSchema.validate(value);
  }

  override validateOpenFilterValue(value: IOpenFilterValueString) {
    return TextBaseField._validateOpenFilterValue(value);
  }
}
