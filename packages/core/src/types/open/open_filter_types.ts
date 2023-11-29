import { APIMetaFieldType, ITimestamp } from 'types';
import { FilterConjunction, FilterDuration, FOperator } from 'types/view_types';

export type IOpenFilterValueString = string | null;
export type IOpenFilterValueNumber = number | null;
export type IOpenFilterValueBoolean = boolean | null;
export type IOpenFilterValueArray = string[] | null;
export type IOpenFilterValueDataTime = [Exclude<FilterDuration, FilterDuration.ExactDate | FilterDuration.DateRange>] |
[FilterDuration.ExactDate, ITimestamp | null] |
[FilterDuration.DateRange, ITimestamp, ITimestamp] |
[FilterDuration.DateRange, null] |
[FilterDuration.SomeDayBefore, number | null] |
[FilterDuration.SomeDayAfter, number | null] |
null;

export type IOpenFilterValueSelect = string | null;
export type IOpenFilterValueMultiSelect = string[] | null;

export type IOpenFilterValue =
 | IOpenFilterValueString
 | IOpenFilterValueNumber
 | IOpenFilterValueBoolean
 | IOpenFilterValueDataTime
  | IOpenFilterValueArray
 | IOpenFilterValueSelect
 | IOpenFilterValueMultiSelect
 | IOpenFilterValueString[]
 | IOpenFilterValueNumber[]
 | IOpenFilterValueBoolean[]
 | IOpenFilterValueDataTime[]
 | IOpenFilterValueSelect[]
 | IOpenFilterValueMultiSelect[];

export type OpenFOperator = Exclude<FOperator, FOperator.IsRepeat>;

export type IOpenFilterValueMap = {
  [FOperator.Contains]: IOpenFilterValue;
} | {
  [FOperator.DoesNotContain]: IOpenFilterValue;
} | {
  [FOperator.Is]: IOpenFilterValue;
} | {
  [FOperator.IsEmpty]: IOpenFilterValue;
} | {
  [FOperator.IsGreater]: IOpenFilterValue;
} | {
  [FOperator.IsGreaterEqual]: IOpenFilterValue;
} | {
  [FOperator.IsLess]: IOpenFilterValue;
} | {
  [FOperator.IsLessEqual]: IOpenFilterValue;
} | {
  [FOperator.IsNot]: IOpenFilterValue;
} | {
  [FOperator.IsNotEmpty]: IOpenFilterValue;
};

export type IOpenFilterConditionMap = {
  [APIMetaFieldType.NotSupport]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Text]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.SingleText]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.SingleSelect]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.MultiSelect]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Number]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Currency]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Percent]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.DateTime]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Attachment]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Member]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Checkbox]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Rating]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.URL]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Phone]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Email]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.MagicLink]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.TwoWayLink]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.OneWayLink]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.MagicLookUp]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.Formula]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.AutoNumber]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.CreatedTime]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.LastModifiedTime]: IOpenFilterValueMap
} | {
  [APIMetaFieldType.LastModifiedBy]: IOpenFilterValueMap
};

export type IOpenFilterCondition = {
  fieldKey: string;
} & IOpenFilterConditionMap;

export type IOpenFilterConditionGroup = {
  [FilterConjunction.And]: IOpenFilterConditionGroup | IOpenFilterCondition[]
} | {
  [FilterConjunction.Or]: IOpenFilterConditionGroup | IOpenFilterCondition[]
} | {};

export type IOpenFilterInfo = IOpenFilterConditionGroup;
