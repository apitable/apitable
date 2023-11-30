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

import { Strings, t } from 'exports/i18n';
import type { IUnitIds } from 'types/field_types';
import type { FieldType, ITimestamp } from './field_types';

export interface ISortedField {
  fieldId: string;
  desc: boolean;
}

export type IGroupInfo = ISortedField[];
export type ISortInfo = {
  rules: ISortedField[],
  keepSort: boolean,
};

export enum FOperator {
  Is = 'is',
  IsNot = 'isNot',
  Contains = 'contains',
  DoesNotContain = 'doesNotContain',
  IsEmpty = 'isEmpty',
  IsNotEmpty = 'isNotEmpty',
  IsGreater = 'isGreater',
  IsGreaterEqual = 'isGreaterEqual',
  IsLess = 'isLess',
  IsLessEqual = 'isLessEqual',
  IsRepeat = 'isRepeat',
}

export const FOperatorDescMap = {
  [FOperator.Is]: t(Strings.equal),
  [FOperator.IsNot]: t(Strings.not_equal),
  [FOperator.Contains]: t(Strings.contains),
  [FOperator.DoesNotContain]: t(Strings.does_not_contains),
  [FOperator.IsEmpty]: t(Strings.is_empty),
  [FOperator.IsNotEmpty]: t(Strings.is_not_empty),
  [FOperator.IsRepeat]: t(Strings.is_repeat),
};

export enum FilterDuration {
  ExactDate = 'ExactDate',
  DateRange = 'DateRange',
  Today = 'Today',
  Tomorrow = 'Tomorrow',
  Yesterday = 'Yesterday',
  ThisWeek = 'ThisWeek',
  PreviousWeek = 'PreviousWeek',
  ThisMonth = 'ThisMonth',
  PreviousMonth = 'PreviousMonth',
  ThisYear = 'ThisYear',
  SomeDayBefore = 'SomeDayBefore',
  SomeDayAfter = 'SomeDayAfter',
  TheLastWeek = 'TheLastWeek',
  TheNextWeek = 'TheNextWeek',
  TheLastMonth = 'TheLastMonth',
  TheNextMonth = 'TheNextMonth',
}

export type IFilterValue = string;
export type IFilterCheckbox = boolean | null;
export type IFilterText = [IFilterValue] | null;
export type IFilterNumber = [IFilterValue] | null;
// export type IFilterRating = [IFilterValue] | null;
// When the radio field is Include/Not Include , you need to provide a multi-select drop-down
export type IFilterSingleSelect = IFilterValue[] | null;
export type IFilterMultiSelect = IFilterValue[] | null;
export type IFilterWorkDoc = IFilterValue[] | null;
export type IFilterMember = IUnitIds | null;

export type IFilterDateTime =
  [Exclude<FilterDuration, FilterDuration.ExactDate | FilterDuration.DateRange>] |
  [FilterDuration.ExactDate, ITimestamp | null] |
  [FilterDuration.DateRange, string | null] |
  null;

export interface IFilterBaseCondition {
  conditionId: string;
  fieldId: string;
  operator: FOperator;
}

export interface IFilterConditionMap {
  [FieldType.Text]: {
    fieldType: FieldType.Text;
    value: IFilterText;
  };
  [FieldType.SingleText]: {
    fieldType: FieldType.SingleText;
    value: IFilterText;
  };
  [FieldType.Number]: {
    fieldType: FieldType.Number;
    value: IFilterNumber;
  };
  [FieldType.Currency]: {
    fieldType: FieldType.Currency;
    value: IFilterNumber;
  };
  [FieldType.Percent]: {
    fieldType: FieldType.Percent;
    value: IFilterNumber;
  };
  [FieldType.AutoNumber]: {
    fieldType: FieldType.AutoNumber;
    value: IFilterNumber;
  };
  [FieldType.SingleSelect]: {
    fieldType: FieldType.SingleSelect;
    value: IFilterSingleSelect;
  };
  [FieldType.MultiSelect]: {
    fieldType: FieldType.MultiSelect;
    value: IFilterMultiSelect;
  };
  [FieldType.DateTime]: {
    fieldType: FieldType.DateTime;
    value: IFilterDateTime;
  };
  [FieldType.CreatedTime]: {
    fieldType: FieldType.CreatedTime;
    value: IFilterDateTime;
  };
  [FieldType.LastModifiedTime]: {
    fieldType: FieldType.LastModifiedTime;
    value: IFilterDateTime;
  };
  [FieldType.NotSupport]: {
    fieldType: FieldType.NotSupport;
    value: any;
  };
  [FieldType.DeniedField]: {
    fieldType: FieldType.DeniedField;
    value: any;
  };
  [FieldType.Attachment]: {
    fieldType: FieldType.Attachment;
    // TODO: undefined
    value: any;
  };
  [FieldType.Link]: {
    fieldType: FieldType.Link;
    value: any;
  };
  [FieldType.OneWayLink]: {
    fieldType: FieldType.OneWayLink;
    value: any;
  };
  // TODO: The following fields support filter operations
  [FieldType.URL]: {
    fieldType: FieldType.URL;
    value: any;
  };
  [FieldType.Email]: {
    fieldType: FieldType.Email;
    value: any;
  };
  [FieldType.Phone]: {
    fieldType: FieldType.Phone;
    value: any;
  };
  [FieldType.Checkbox]: {
    fieldType: FieldType.Checkbox;
    value: IFilterCheckbox;
  };
  [FieldType.Rating]: {
    fieldType: FieldType.Rating;
    value: IFilterNumber;
  };
  [FieldType.Member]: {
    fieldType: FieldType.Member;
    value: IFilterMember;
  };
  [FieldType.CreatedBy]: {
    fieldType: FieldType.CreatedBy;
    value: IFilterMember;
  };
  [FieldType.LastModifiedBy]: {
    fieldType: FieldType.LastModifiedBy;
    value: IFilterMember;
  };
  [FieldType.LookUp]: {
    fieldType: FieldType.LookUp;
    value: any;
  };
  [FieldType.Formula]: {
    fieldType: FieldType.Formula;
    value: IFilterText;
  };
  [FieldType.Cascader]: {
    fieldType: FieldType.Cascader;
    value: any;
  };
  [FieldType.Button]: {
    fieldType: FieldType.Button;
    value: any;
  };
  [FieldType.WorkDoc]: {
    fieldType: FieldType.WorkDoc;
    value: IFilterWorkDoc;
  };
}

export type IFilterCondition<T extends FieldType = FieldType> = IFilterBaseCondition & IFilterConditionMap[T];

export enum FilterConjunction {
  And = 'and',
  Or = 'or',
}

export const FilterConjunctionDescMap = {
  [FilterConjunction.And]: t(Strings.operator_and),
  [FilterConjunction.Or]: t(Strings.operator_or),
} as const;

export interface IFilterInfo {
  conjunction: FilterConjunction;
  conditions: IFilterCondition[];
}
