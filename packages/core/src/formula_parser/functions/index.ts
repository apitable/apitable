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

import * as array from './array';
import * as logical from './logical';
import * as numeric from './numeric';
import * as text from './text';
import * as record from './record';
import * as dateTime from './date_time';
import { FormulaFunc, FormulaBaseError } from './basic';
import { t, Strings } from 'exports/i18n';
export { FormulaBaseError };

export interface IFunction {
  name: string;
  func: typeof FormulaFunc;
  summary: string;
  definition: string;
  example: string;
  linkUrl?: string;
}

export const FunctionExample = {
  name: t(Strings.formula_example_title),
  func: {},
  definition: t(Strings.function_example_usage),
  summary: t(Strings.function_example_summary),
  example: t(Strings.function_example_example),
};

export const Functions = new Map<string, IFunction>([
  // Numeric
  ['SUM', {
    name: 'SUM',
    func: numeric.Sum,
    definition: 'SUM(number1, [number2, ...])',
    summary: t(Strings.function_sum_summary),
    example: t(Strings.function_sum_example),
  }],
  ['AVERAGE', {
    name: 'AVERAGE',
    func: numeric.Average,
    definition: 'AVERAGE(number1, [number2, ...])',
    summary: t(Strings.function_average_summary),
    example: t(Strings.function_average_example),
  }],
  ['MAX', {
    name: 'MAX',
    func: numeric.Max,
    definition: 'MAX(number1, [number2, ...])',
    summary: t(Strings.function_max_summary),
    example: t(Strings.function_max_example),
  }],
  ['MIN', {
    name: 'MIN',
    func: numeric.Min,
    definition: 'MIN(number1, [number2, ...])',
    summary: t(Strings.function_min_summary),
    example: t(Strings.function_min_example),
  }],
  ['ROUND', {
    name: 'ROUND',
    func: numeric.Round,
    definition: 'ROUND(value, [precision])',
    summary: t(Strings.function_round_summary),
    example: t(Strings.function_round_example),
  }],
  ['ROUNDUP', {
    name: 'ROUNDUP',
    func: numeric.RoundUp,
    definition: 'ROUNDUP(value, [precision])',
    summary: t(Strings.function_roundup_summary),
    example: t(Strings.function_roundup_example),
  }],
  ['ROUNDDOWN', {
    name: 'ROUNDDOWN',
    func: numeric.RoundDown,
    definition: 'ROUNDDOWN(value, [precision])',
    summary: t(Strings.function_rounddown_summary),
    example: t(Strings.function_rounddown_example),
  }],
  ['CEILING', {
    name: 'CEILING',
    func: numeric.Ceiling,
    definition: 'CEILING(value, [significance])',
    summary: t(Strings.function_ceiling_summary),
    example: t(Strings.function_ceiling_example),
  }],
  ['FLOOR', {
    name: 'FLOOR',
    func: numeric.Floor,
    definition: 'FLOOR(value, [significance])',
    summary: t(Strings.function_floor_summary),
    example: t(Strings.function_floor_example),
  }],
  ['EVEN', {
    name: 'EVEN',
    func: numeric.Even,
    definition: 'EVEN(value)',
    summary: t(Strings.function_even_summary),
    example: t(Strings.function_even_example),
  }],
  ['ODD', {
    name: 'ODD',
    func: numeric.Odd,
    definition: 'ODD(value)',
    summary: t(Strings.function_odd_summary),
    example: t(Strings.function_odd_example),
  }],
  ['INT', {
    name: 'INT',
    func: numeric.Int,
    definition: 'INT(value)',
    summary: t(Strings.function_int_summary),
    example: t(Strings.function_int_example),
  }],
  ['ABS', {
    name: 'ABS',
    func: numeric.Abs,
    definition: 'ABS(value)',
    summary: t(Strings.function_abs_summary),
    example: t(Strings.function_abs_example),
  }],
  ['SQRT', {
    name: 'SQRT',
    func: numeric.Sqrt,
    definition: 'SQRT(value)',
    summary: t(Strings.function_sqrt_summary),
    example: t(Strings.function_sqrt_example),
  }],
  ['MOD', {
    name: 'MOD',
    func: numeric.Mod,
    definition: 'MOD(value, divisor)',
    summary: t(Strings.function_mod_summary),
    example: t(Strings.function_mod_example),
  }],
  ['POWER', {
    name: 'POWER',
    func: numeric.Power,
    definition: 'POWER(base, power)',
    summary: t(Strings.function_power_summary),
    example: t(Strings.function_power_example),
  }],
  ['EXP', {
    name: 'EXP',
    func: numeric.Exp,
    definition: 'EXP(power)',
    summary: t(Strings.function_exp_summary),
    example: t(Strings.function_exp_example),
  }],
  ['LOG', {
    name: 'LOG',
    func: numeric.Log,
    definition: 'LOG(number, base=10))',
    summary: t(Strings.function_log_summary),
    example: t(Strings.function_log_example),
  }],
  ['VALUE', {
    name: 'VALUE',
    func: numeric.Value,
    definition: 'VALUE(text)',
    summary: t(Strings.function_value_summary),
    example: t(Strings.function_value_example),
  }],

  // Text
  ['CONCATENATE', {
    name: 'CONCATENATE',
    func: text.Concatenate,
    definition: 'CONCATENATE(text1, [text2, ...])',
    summary: t(Strings.function_concatenate_summary),
    example: t(Strings.function_concatenate_example),
  }],
  ['FIND', {
    name: 'FIND',
    func: text.Find,
    definition: 'FIND(stringToFind, whereToSearch, [startFromPosition])',
    summary: t(Strings.function_find_summary),
    example: t(Strings.function_find_example),
  }],
  ['SEARCH', {
    name: 'SEARCH',
    func: text.Search,
    definition: 'SEARCH(stringToFind, whereToSearch, [startFromPosition])',
    summary: t(Strings.function_search_summary),
    example: t(Strings.function_search_example),
  }],
  ['MID', {
    name: 'MID',
    func: text.Mid,
    definition: 'MID(string, whereToStart, count)',
    summary: t(Strings.function_mid_summary),
    example: t(Strings.function_mid_example),
  }],
  ['REPLACE', {
    name: 'REPLACE',
    func: text.Replace,
    definition: 'REPLACE(string, whereToStart, count, replacement)',
    summary: t(Strings.function_replace_summary),
    example: t(Strings.function_replace_example),
  }],
  ['SUBSTITUTE', {
    name: 'SUBSTITUTE',
    func: text.Substitute,
    definition: 'Substitute(string, oldText, newText, [index])',
    summary: t(Strings.function_substitute_summary),
    example: t(Strings.function_substitute_example),
  }],
  ['LEN', {
    name: 'LEN',
    func: text.Len,
    definition: 'LEN(string)',
    summary: t(Strings.function_len_summary),
    example: t(Strings.function_len_example),
  }],
  ['LEFT', {
    name: 'LEFT',
    func: text.Left,
    definition: 'LEFT(string, howMany)',
    summary: t(Strings.function_left_summary),
    example: t(Strings.function_left_example),
  }],
  ['RIGHT', {
    name: 'RIGHT',
    func: text.Right,
    definition: 'RIGHT(string, howMany)',
    summary: t(Strings.function_right_summary),
    example: t(Strings.function_right_example),
  }],
  ['LOWER', {
    name: 'LOWER',
    func: text.Lower,
    definition: 'LOWER(string)',
    summary: t(Strings.function_lower_summary),
    example: t(Strings.function_lower_example),
  }],
  ['UPPER', {
    name: 'UPPER',
    func: text.Upper,
    definition: 'UPPER(string)',
    summary: t(Strings.function_upper_summary),
    example: t(Strings.function_upper_example),
  }],
  ['REPT', {
    name: 'REPT',
    func: text.Rept,
    definition: 'REPT(string, number)',
    summary: t(Strings.function_rept_summary),
    example: t(Strings.function_rept_example),
  }],
  ['T', {
    name: 'T',
    func: text.T,
    definition: 'T(value)',
    summary: t(Strings.function_t_summary),
    example: t(Strings.function_t_example),
  }],
  ['TRIM', {
    name: 'TRIM',
    func: text.Trim,
    definition: 'TRIM(string)',
    summary: t(Strings.function_trim_summary),
    example: t(Strings.function_trim_example),
  }],
  ['ENCODE_URL_COMPONENT', {
    name: 'ENCODE_URL_COMPONENT',
    func: text.EncodeUrlComponent,
    definition: 'ENCODE_URL_COMPONENT(component_string)',
    summary: t(Strings.function_encode_url_component_summary),
    example: t(Strings.function_encode_url_component_example),
  }],

  // Logical
  ['IF', {
    name: 'IF',
    func: logical.If,
    definition: 'IF(logical, value1, value2)',
    summary: t(Strings.function_if_summary),
    example: t(Strings.function_if_example),
  }],
  ['SWITCH', {
    name: 'SWITCH',
    func: logical.Switch,
    definition: 'SWITCH(expression, [pattern, result...], [default])',
    summary: t(Strings.function_switch_summary),
    example: t(Strings.function_switch_example),
  }],
  ['TRUE', {
    name: 'TRUE',
    func: logical.True,
    definition: 'TRUE()',
    summary: t(Strings.function_true_summary),
    example: t(Strings.function_true_example),
  }],
  ['FALSE', {
    name: 'FALSE',
    func: logical.False,
    definition: 'FALSE()',
    summary: t(Strings.function_false_summary),
    example: t(Strings.function_false_example),
  }],
  ['AND', {
    name: 'AND',
    func: logical.And,
    definition: 'AND(logical1, [logical2, ...])',
    summary: t(Strings.function_and_summary),
    example: t(Strings.function_and_example),
  }],
  ['OR', {
    name: 'OR',
    func: logical.Or,
    definition: 'OR(logical1, [logical2, ...])',
    summary: t(Strings.function_or_summary),
    example: t(Strings.function_or_example),
  }],
  ['XOR', {
    name: 'XOR',
    func: logical.Xor,
    definition: 'XOR(logical1, [logical2, ...])',
    summary: t(Strings.function_xor_summary),
    example: t(Strings.function_xor_example),
  }],
  ['BLANK', {
    name: 'BLANK',
    func: logical.Blank,
    definition: 'BLANK()',
    summary: t(Strings.function_blank_summary),
    example: t(Strings.function_blank_example),
  }],
  ['ERROR', {
    name: 'ERROR',
    func: logical.FormulaError,
    definition: 'ERROR(message)',
    summary: t(Strings.function_error_summary),
    example: t(Strings.function_error_example),
  }],
  // TODO: Do ISERROR compatibility here first, and delete the user data after brushing
  ['ISERROR', {
    name: 'ISERROR',
    func: logical.IsError,
    definition: 'ISERROR(expr)',
    summary: t(Strings.function_is_error_example),
    example: t(Strings.function_is_error_example),
  }],
  ['IS_ERROR', {
    name: 'IS_ERROR',
    func: logical.IsError,
    definition: 'IS_ERROR(expr)',
    summary: t(Strings.function_is_error_summary),
    example: t(Strings.function_is_error_example),
  }],
  ['NOT', {
    name: 'NOT',
    func: logical.Not,
    definition: 'NOT(boolean)',
    summary: t(Strings.function_not_summary),
    example: t(Strings.function_not_example),
  }],

  // DateTime
  ['TODAY', {
    name: 'TODAY',
    func: dateTime.Today,
    definition: 'TODAY()',
    summary: t(Strings.function_today_summary),
    example: t(Strings.function_today_example),
  }],
  ['NOW', {
    name: 'NOW',
    func: dateTime.Now,
    definition: 'NOW()',
    summary: t(Strings.function_now_summary),
    example: t(Strings.function_now_example),
  }],
  ['TONOW', {
    name: 'TONOW',
    func: dateTime.ToNow,
    definition: 'TONOW(date, units)',
    summary: t(Strings.function_tonow_summary),
    example: t(Strings.function_tonow_example),
    linkUrl: t(Strings.function_tonow_url),
  }],
  ['FROMNOW', {
    name: 'FROMNOW',
    func: dateTime.FromNow,
    definition: 'FROMNOW(date, units)',
    summary: t(Strings.function_fromnow_summary),
    example: t(Strings.function_fromnow_example),
    linkUrl: t(Strings.function_fromnow_url),
  }],
  ['DATEADD', {
    name: 'DATEADD',
    func: dateTime.Dateadd,
    definition: 'DATEADD(date, count, units)',
    summary: t(Strings.function_dateadd_summary),
    example: t(Strings.function_dateadd_example),
    linkUrl: t(Strings.function_dateadd_url),
  }],
  ['DATETIME_DIFF', {
    name: 'DATETIME_DIFF',
    func: dateTime.DatetimeDiff,
    definition: 'DATETIME_DIFF(date1, date2, [units])',
    summary: t(Strings.function_datetime_diff_summary),
    example: t(Strings.function_datetime_diff_example),
    linkUrl: t(Strings.function_datetime_diff_url),
  }],
  ['WORKDAY', {
    name: 'WORKDAY',
    func: dateTime.WorkDay,
    definition: 'WORKDAY(startDate, numDays, [holidays])',
    summary: t(Strings.function_workday_summary),
    example: t(Strings.function_workday_example),
  }],
  ['WORKDAY_DIFF', {
    name: 'WORKDAY_DIFF',
    func: dateTime.WorkDayDiff,
    definition: 'WORKDAY_DIFF(startDate, endDate, [holidays])',
    summary: t(Strings.function_workday_diff_summary),
    example: t(Strings.function_workday_diff_example),
  }],
  ['IS_AFTER', {
    name: 'IS_AFTER',
    func: dateTime.IsAfter,
    definition: 'IS_AFTER(date1, date2)',
    summary: t(Strings.function_is_after_summary),
    example: t(Strings.function_is_after_example),
  }],
  ['IS_BEFORE', {
    name: 'IS_BEFORE',
    func: dateTime.IsBefore,
    definition: 'IS_BEFORE(date1, date2)',
    summary: t(Strings.function_is_before_summary),
    example: t(Strings.function_is_before_example),
  }],
  ['IS_SAME', {
    name: 'IS_SAME',
    func: dateTime.IsSame,
    definition: 'IS_SAME(date1, date2, [units])',
    summary: t(Strings.function_is_same_summary),
    example: t(Strings.function_is_same_example),
    linkUrl: t(Strings.function_is_same_url),
  }],
  ['DATETIME_FORMAT', {
    name: 'DATETIME_FORMAT',
    func: dateTime.DateTimeFormat,
    definition: 'DATETIME_FORMAT(date, [specified_output_format])',
    summary: t(Strings.function_datetime_format_summary),
    example: t(Strings.function_datetime_format_example),
    linkUrl: t(Strings.function_datetime_format_url),
  }],
  ['DATETIME_PARSE', {
    name: 'DATETIME_PARSE',
    func: dateTime.DateTimeParse,
    definition: 'DATETIME_PARSE(date, [input_format])',
    summary: t(Strings.function_datetime_parse_summary),
    example: t(Strings.function_datetime_parse_example),
    linkUrl: t(Strings.function_datetime_parse_url),
  }],
  ['DATESTR', {
    name: 'DATESTR',
    func: dateTime.DateStr,
    definition: 'DATESTR(date)',
    summary: t(Strings.function_datestr_summary),
    example: t(Strings.function_datestr_example),
  }],
  ['TIMESTR', {
    name: 'TIMESTR',
    func: dateTime.TimeStr,
    definition: 'TIMESTR(date)',
    summary: t(Strings.function_timestr_summary),
    example: t(Strings.function_timestr_example),
  }],
  ['YEAR', {
    name: 'YEAR',
    func: dateTime.Year,
    definition: 'YEAR(date)',
    summary: t(Strings.function_year_summary),
    example: t(Strings.function_year_example),
  }],
  ['MONTH', {
    name: 'MONTH',
    func: dateTime.Month,
    definition: 'MONTH(date)',
    summary: t(Strings.function_month_summary),
    example: t(Strings.function_month_example),
  }],
  ['WEEKDAY', {
    name: 'WEEKDAY',
    func: dateTime.Weekday,
    definition: 'WEEKDAY(date, [startDayOfWeek])',
    summary: t(Strings.function_weekday_summary),
    example: t(Strings.function_weekday_example),
  }],
  ['WEEKNUM', {
    name: 'WEEKNUM',
    func: dateTime.WeekNum,
    definition: 'WEEKNUM(date, [startDayOfWeek])',
    summary: t(Strings.function_weeknum_summary),
    example: t(Strings.function_weeknum_example),
  }],
  ['DAY', {
    name: 'DAY',
    func: dateTime.Day,
    definition: 'DAY(date)',
    summary: t(Strings.function_day_summary),
    example: t(Strings.function_day_example),
  }],
  ['HOUR', {
    name: 'HOUR',
    func: dateTime.Hour,
    definition: 'HOUR(date)',
    summary: t(Strings.function_hour_summary),
    example: t(Strings.function_hour_example),
  }],
  ['MINUTE', {
    name: 'MINUTE',
    func: dateTime.Minute,
    definition: 'MINUTE(date)',
    summary: t(Strings.function_minute_summary),
    example: t(Strings.function_minute_example),
  }],
  ['SECOND', {
    name: 'SECOND',
    func: dateTime.Second,
    definition: 'SECOND(date)',
    summary: t(Strings.function_second_summary),
    example: t(Strings.function_second_example),
  }],
  ['SET_LOCALE', {
    name: 'SET_LOCALE',
    func: dateTime.SetLocale,
    definition: 'SET_LOCALE(date, [locale_modifier])',
    summary: t(Strings.function_set_locale_summary),
    example: t(Strings.function_set_locale_example),
    linkUrl: t(Strings.function_set_locale_url),
  }],
  ['SET_TIMEZONE', {
    name: 'SET_TIMEZONE',
    func: dateTime.SetTimeZone,
    definition: 'SET_TIMEZONE(date, [tz_identifier])',
    summary: t(Strings.function_set_timezone_summary),
    example: t(Strings.function_set_timezone_example),
  }],
  ['CREATED_TIME', {
    name: 'CREATED_TIME',
    func: dateTime.CreatedTime,
    definition: 'CREATED_TIME()',
    summary: t(Strings.function_created_time_summary),
    example: t(Strings.function_created_time_example),
  }],
  ['LAST_MODIFIED_TIME', {
    name: 'LAST_MODIFIED_TIME',
    func: dateTime.LastModifiedTime,
    definition: 'LAST_MODIFIED_TIME()',
    summary: t(Strings.function_last_modified_time_summary),
    example: t(Strings.function_last_modified_time_example),
  }],

  // Array
  ['ARRAYCOMPACT', {
    name: 'ARRAYCOMPACT',
    func: array.ArrayCompact,
    definition: 'ARRAYCOMPACT([item1, item2, item3])',
    summary: t(Strings.function_arraycompact_summary),
    example: t(Strings.function_arraycompact_example),
  }],
  ['ARRAYUNIQUE', {
    name: 'ARRAYUNIQUE',
    func: array.ArrayUnique,
    definition: 'ARRAYUNIQUE([item1, item2, item3])',
    summary: t(Strings.function_arrayunique_summary),
    example: t(Strings.function_arrayunique_example),
  }],
  ['ARRAYJOIN', {
    name: 'ARRAYJOIN',
    func: array.ArrayJoin,
    definition: 'ARRAYJOIN([item1, item2, item3], separator)',
    summary: t(Strings.function_arrayjoin_summary),
    example: t(Strings.function_arrayjoin_example),
  }],
  ['ARRAYFLATTEN', {
    name: 'ARRAYFLATTEN',
    func: array.ArrayFlatten,
    definition: 'ARRAYFLATTEN([item1, item2, item3])',
    summary: t(Strings.function_arrayflatten_summary),
    example: t(Strings.function_arrayflatten_example),
  }],
  ['COUNT', {
    name: 'COUNT',
    func: array.Count,
    definition: 'COUNT(number1, [number2, ...])',
    summary: t(Strings.function_count_summary),
    example: t(Strings.function_count_example),
  }],
  ['COUNTA', {
    name: 'COUNTA',
    func: array.Counta,
    definition: 'COUNTA(textOrNumber1, [number2, ...])',
    summary: t(Strings.function_counta_summary),
    example: t(Strings.function_counta_example),
  }],
  ['COUNTIF', {
    name: 'COUNTIF',
    func: array.CountIf,
    definition: 'COUNTIF(values, keyword, operation)',
    summary: t(Strings.function_countif_summary),
    example: t(Strings.function_countif_example),
  }],
  ['COUNTALL', {
    name: 'COUNTALL',
    func: array.Countall,
    definition: 'COUNTALL(textOrNumber1, [number2, ...])',
    summary: t(Strings.function_countall_summary),
    example: t(Strings.function_countall_example),
  }],

  // Record
  ['RECORD_ID', {
    name: 'RECORD_ID',
    func: record.RecordId,
    definition: 'RECORD_ID()',
    summary: t(Strings.function_record_id_summary),
    example: t(Strings.function_record_id_example),
  }],
]);
