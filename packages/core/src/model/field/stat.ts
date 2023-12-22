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
import { Field } from './field';
import { Strings, t } from '../../exports/i18n';
import { sum, uniq } from 'lodash';
import { ICellValue } from 'model/record';
import { ISnapshot, IReduxState } from '../../exports/store/interfaces';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { BasicValueType, FieldType, IField } from 'types/field_types';
import { toFixed } from '../../utils/number';

export enum StatType {
  None = 0,
  CountAll = 1,
  Empty = 2,
  Filled = 3,
  Unique = 4,
  PercentEmpty = 5,
  PercentFilled = 6,
  PercentUnique = 7,
  Sum = 8,
  Average = 9,
  Max = 10, // LatestDate in date type
  Min = 11, // EarliestDate in date type
  // LatestDate = 10,
  // EarliestDate = 11,
  DateRangeOfDays = 12,
  DateRangeOfMonths = 13,
  // TotalAttachmentSize = 14,
  // CountAttachments = 15,
  Checked = 14,
  UnChecked = 15,
  PercentChecked = 16,
  PercentUnChecked = 17,
}

export const StatTranslate = {
  [StatType.None]: t(Strings.stat_none),
  [StatType.CountAll]: t(Strings.stat_count_all),
  [StatType.Empty]: t(Strings.stat_empty),
  [StatType.Filled]: t(Strings.stat_fill),
  [StatType.Unique]: t(Strings.stat_uniqe),
  [StatType.PercentEmpty]: t(Strings.stat_percent_empty),
  [StatType.PercentFilled]: t(Strings.stat_percent_filled),
  [StatType.PercentUnique]: t(Strings.stat_percent_unique),
  [StatType.Sum]: t(Strings.stat_sum),
  [StatType.Average]: t(Strings.stat_average),
  [StatType.Max]: t(Strings.stat_max),
  [StatType.Min]: t(Strings.stat_min),
  [StatType.DateRangeOfDays]: t(Strings.stat_date_range_of_days),
  [StatType.DateRangeOfMonths]: t(Strings.stat_date_range_of_months),
  [StatType.Checked]: t(Strings.stat_checked),
  [StatType.UnChecked]: t(Strings.stat_un_checked),
  [StatType.PercentChecked]: t(Strings.stat_percent_checked),
  [StatType.PercentUnChecked]: t(Strings.stat_percent_un_checked),
};

export const getStatTypeList = (field: IField, state: IReduxState) => {
  return Field.bindContext(field, state).statTypeList;
};

const statCountAll = (records: string[]) => {
  return records.length;
};

const statEmpty = (cellValues: ICellValue[]) => {
  return cellValues.filter(cellValue => {
    return cellValue == null || (Array.isArray(cellValue) && !cellValue.length);
  }).length;
};

const statFilled = (cellValues: ICellValue[]) => {
  return cellValues.filter(cellValue => {
    return Array.isArray(cellValue) ? cellValue.length : (cellValue != null);
  }).length;
};

const statUnique = (cellValues: ICellValue[], _field: IField) => {
  const _cellValue = cellValues.map(item => {
    return JSON.stringify(item);
  });
  const result = uniq(_cellValue).length;
  return result;
};

// numeric field calculation
const statSum = (cellValues: ICellValue[], field: IField, state: IReduxState) => {
  let res: number | number[] = sum(cellValues) || 0;
  const instance = Field.bindContext(field, state);
  if (instance.basicValueType === BasicValueType.Array) {
    res = [res];
  }
  return instance.cellValueToString(res);
};

// numeric field calculation
const statAverage = (cellValues: ICellValue[], field: IField, state: IReduxState) => {
  // cell is empty, not counted in total
  const total = cellValues.filter(cv => typeof cv === 'number').length;
  let res: number | number[] = sum(cellValues) / total;
  if (field.type === FieldType.Rating) {
    return res.toFixed(2).toString();
  }
  const instance = Field.bindContext(field, state);
  if (instance.basicValueType === BasicValueType.Array) {
    res = [res];
  }
  return instance.cellValueToString(res);
};

// Number & date field calculation
const statMax = (cellValues: ICellValue[], field: IField, state: IReduxState) => {
  let res: number | number[] = (cellValues as (number | null)[]).reduce<number>((accumulator, cellValue: number | null) =>
    Math.max(accumulator, typeof cellValue ==='number' ? cellValue : -Infinity), -Infinity);
  if (!isFinite(res)) return Infinity;
  const instance = Field.bindContext(field, state);
  if (instance.basicValueType === BasicValueType.Array) res = [res];
  return instance.cellValueToString(res);
};

// Number & date field calculation
const statMin = (cellValues: ICellValue[], field: IField, state: IReduxState) => {
  let res: number | number[] = (cellValues as (number | null)[]).reduce<number>((accumulator, cellValue: number | null) =>
    Math.min(accumulator, typeof cellValue ==='number' ? cellValue : Infinity), Infinity);
  if (!isFinite(res)) return -Infinity;
  const instance = Field.bindContext(field, state);
  if (instance.basicValueType === BasicValueType.Array) res = [res];
  return instance.cellValueToString(res);
};

const statDateRangeOfDays = (cellValues: ICellValue[]) => {
  const max = (cellValues as (number | null)[]).reduce<number>((accumulator, cellValue: number | null) =>
    Math.max(accumulator, cellValue || -Infinity), -Infinity) as number;

  const min = (cellValues as (number | null)[]).reduce<number>((accumulator, cellValue: number | null) =>
    Math.min(accumulator, cellValue || Infinity), Infinity) as number;

  if (!isFinite(min)) return 0;
  const rangeDayTime = max - min;
  return Math.floor(rangeDayTime / (60 * 60 * 24 * 1000));
};

const statDateRangeOfMonths = (cellValues: ICellValue[]) => {
  const max = (cellValues as (number | null)[]).reduce((accumulator: number, cellValue: number | null) =>
    Math.max(accumulator, cellValue || -Infinity), -Infinity) as number;

  const min = (cellValues as (number | null)[]).reduce((accumulator: number, cellValue: number | null) =>
    Math.min(accumulator, cellValue || Infinity), Infinity) as number;

  if (!isFinite(min)) return 0;
  const maxDate = new Date(max);
  const minDate = new Date(min);
  let year = maxDate.getFullYear() - minDate.getFullYear();
  let month = maxDate.getMonth() - minDate.getMonth();
  let date = maxDate.getDate() - minDate.getDate();
  let hours = maxDate.getHours() - minDate.getHours();
  let minutes = maxDate.getMinutes() - minDate.getMinutes();
  let seconds = maxDate.getSeconds() - minDate.getSeconds();
  const milliSeconds = maxDate.getMilliseconds() - minDate.getMilliseconds();
  milliSeconds < 0 && seconds--;
  seconds < 0 && minutes--;
  minutes < 0 && hours--;
  hours < 0 && date--;
  date < 0 && month--;
  if (month < 0) {
    month += 12;
    year--;
  }
  return year * 12 + month;
};

/**
 * Get column result based on calculation type
 */
export const getFieldResultByStatType = (
  statType: StatType,
  records: string[],
  field: IField,
  snapshot: ISnapshot,
  state: IReduxState,
) => {
  let cellValues: ICellValue[] = records.map(recId => {
    return getCellValue(state, snapshot, recId, field.id);
  });

  const instance = Field.bindContext(field, state);
  const shouldFlat = instance.isComputed && instance.basicValueType === BasicValueType.Array;
  switch (statType) {
    case StatType.CountAll:
      return statCountAll(records);
    case StatType.Empty:
    case StatType.UnChecked:
      return statEmpty(cellValues);
    case StatType.Filled:
    case StatType.Checked:
      return statFilled(cellValues);
    case StatType.Unique:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statUnique(cellValues, field);
    case StatType.PercentEmpty:
    case StatType.PercentUnChecked:
      return toFixed(statEmpty(cellValues) * 100 / records.length) + '%';
    case StatType.PercentFilled:
    case StatType.PercentChecked:
      return toFixed(statFilled(cellValues) * 100 / records.length) + '%';
    case StatType.PercentUnique:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return toFixed(statUnique(cellValues, field) * 100 / (shouldFlat ? cellValues.length : records.length)) + '%';
    case StatType.Sum:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statSum(cellValues, field, state);
    case StatType.Average:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statAverage(cellValues, field, state);
    case StatType.Max:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statMax(cellValues, field, state);
    case StatType.Min:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statMin(cellValues, field, state);
    case StatType.DateRangeOfDays:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statDateRangeOfDays(cellValues);
    case StatType.DateRangeOfMonths:
      if (shouldFlat) cellValues = cellValues.flat(1) as ICellValue[];
      return statDateRangeOfMonths(cellValues);
    default: {
      return null;
    }
  }
};
