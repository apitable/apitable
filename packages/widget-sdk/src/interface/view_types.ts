import { NumFieldType as FieldType } from './field_types';
import { APIMetaViewType } from 'core';

export enum ViewType {
  /** 维格视图 */
  Grid = APIMetaViewType.Grid,
  /** 相册视图 */
  Gallery = APIMetaViewType.Gallery,
  /** 看板视图 */
  Kanban = APIMetaViewType.Kanban,
  /** 甘特视图 */
  Gantt = APIMetaViewType.Gantt,
  /** 日历视图 */
  Calendar = APIMetaViewType.Calendar,
  /** 架构视图 */
  Architecture = APIMetaViewType.Architecture,
}

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

export enum FilterDurationDesc {
  ExactDate = '指定日期',
  DateRange = '时间范围',
  Today = '今天',
  Tomorrow = '明天',
  Yesterday = '昨天',
  TheLastWeek = '过去 7 天',
  TheNextWeek = '未来 7 天',
  TheLastMonth = '过去 30 天',
  TheNextMonth = '未来 30 天',
  ThisWeek = '本周',
  PreviousWeek = '上周',
  ThisMonth = '本月',
  PreviousMonth = '上月',
  ThisYear = '今年',
  SomeDayBefore = '多少天前',
  SomeDayAfter = '多少天后'
}

export type IFilterValue = string;
export type IFilterCheckbox = [boolean] | null;
export type IFilterText = [IFilterValue] | null;
export type IFilterNumber = [IFilterValue] | null;
// export type IFilterRating = [IFilterValue] | null;
// 单选字段为 包含/不包含 时，需提供多选下拉
export type IFilterSingleSelect = IFilterValue[] | null;
export type IFilterMultiSelect = IFilterValue[] | null;
export type IFilterMember = string[] | null;

export type IFilterDateTime =
  [Exclude<FilterDuration, FilterDuration.ExactDate>] |
  [FilterDuration.ExactDate, number | null] |
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
    fieldType: FieldType.SingleText,
    value: IFilterText,
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
    fieldType: FieldType.Attachment,
    // TODO: 未定义
    value: any,
  };
  [FieldType.Link]: {
    fieldType: FieldType.Link,
    value: any,
  };
  // TODO: 下面的字段支持 filter 操作
  [FieldType.URL]: {
    fieldType: FieldType.URL,
    value: any,
  };
  [FieldType.Email]: {
    fieldType: FieldType.Email,
    value: any,
  };
  [FieldType.Phone]: {
    fieldType: FieldType.Phone,
    value: any,
  };
  [FieldType.Checkbox]: {
    fieldType: FieldType.Checkbox,
    value: IFilterCheckbox,
  };
  [FieldType.Rating]: {
    fieldType: FieldType.Rating,
    value: IFilterNumber,
  };
  [FieldType.Member]: {
    fieldType: FieldType.Member,
    value: IFilterMember,
  };
  [FieldType.CreatedBy]: {
    fieldType: FieldType.CreatedBy,
    value: IFilterMember,
  };
  [FieldType.LastModifiedBy]: {
    fieldType: FieldType.LastModifiedBy,
    value: IFilterMember,
  };
  [FieldType.LookUp]: {
    fieldType: FieldType.LookUp,
    value: any,
  };
  [FieldType.Formula]: {
    fieldType: FieldType.Formula,
    value: IFilterText,
  };
}

export type IFilterCondition<T extends FieldType = FieldType> = IFilterBaseCondition & IFilterConditionMap[T];

export enum FilterConjunction {
  And = 'and',
  Or = 'or',
}

export interface IFilterInfo {
  conjunction: FilterConjunction;
  conditions: IFilterCondition[];
}