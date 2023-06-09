import { APIMetaFieldType } from 'types/field_api_enums';
import { FieldType } from 'types/field_types';
import { FilterConjunction, FOperator, IFilterConditionMap } from 'types/view_types';

export enum OpenLookUpFilterConjunction {
  And = 'AND',
  Or = 'OR',
}

export const OPEN_LOOKUP_FILTER_CONJ_TO_FILTER_CONJ: { [key in OpenLookUpFilterConjunction]: FilterConjunction } = {
  [OpenLookUpFilterConjunction.And]: FilterConjunction.And,
  [OpenLookUpFilterConjunction.Or]: FilterConjunction.Or,
};

export const FILTER_CONJ_TO_OPEN_LOOKUP_FILTER_CONJ: { [key in FilterConjunction]: OpenLookUpFilterConjunction } = {
  [FilterConjunction.And]: OpenLookUpFilterConjunction.And,
  [FilterConjunction.Or]: OpenLookUpFilterConjunction.Or,
};

export enum OpenLookUpFilterOperator {
  Is = 'EQUAL',
  IsNot = 'NOT_EQUAL',
  Contains = 'CONTAIN',
  DoesNotContain = 'NOT_CONTAIN',
  IsEmpty = 'IS_EMPTY',
  IsNotEmpty = 'NOT_EMPTY',
  IsGreater = 'GREATER_THAN',
  IsGreaterEqual = 'GREATER_THAN_EQUAL',
  IsLess = 'LESS_THAN',
  IsLessEqual = 'LESS_THAN_EQUAL',
  IsRepeat = 'DUPLICATE',
}

export const FILTER_OPER_TO_OPEN_LOOKUP_FILTER_OPER: { [key in FOperator]: OpenLookUpFilterOperator } = {
  [FOperator.Is]: OpenLookUpFilterOperator.Is,
  [FOperator.IsNot]: OpenLookUpFilterOperator.IsNot,
  [FOperator.Contains]: OpenLookUpFilterOperator.Contains,
  [FOperator.DoesNotContain]: OpenLookUpFilterOperator.DoesNotContain,
  [FOperator.IsEmpty]: OpenLookUpFilterOperator.IsEmpty,
  [FOperator.IsNotEmpty]: OpenLookUpFilterOperator.IsNotEmpty,
  [FOperator.IsGreater]: OpenLookUpFilterOperator.IsGreater,
  [FOperator.IsGreaterEqual]: OpenLookUpFilterOperator.IsGreaterEqual,
  [FOperator.IsLess]: OpenLookUpFilterOperator.IsLess,
  [FOperator.IsLessEqual]: OpenLookUpFilterOperator.IsLessEqual,
  [FOperator.IsRepeat]: OpenLookUpFilterOperator.IsRepeat,
};

export const OPEN_LOOKUP_FILTER_OPER_TO_FILTER_OPER: { [key in OpenLookUpFilterOperator]: FOperator } = {
  [OpenLookUpFilterOperator.Is]: FOperator.Is,
  [OpenLookUpFilterOperator.IsNot]: FOperator.IsNot,
  [OpenLookUpFilterOperator.Contains]: FOperator.Contains,
  [OpenLookUpFilterOperator.DoesNotContain]: FOperator.DoesNotContain,
  [OpenLookUpFilterOperator.IsEmpty]: FOperator.IsEmpty,
  [OpenLookUpFilterOperator.IsNotEmpty]: FOperator.IsNotEmpty,
  [OpenLookUpFilterOperator.IsGreater]: FOperator.IsGreater,
  [OpenLookUpFilterOperator.IsGreaterEqual]: FOperator.IsGreaterEqual,
  [OpenLookUpFilterOperator.IsLess]: FOperator.IsLess,
  [OpenLookUpFilterOperator.IsLessEqual]: FOperator.IsLessEqual,
  [OpenLookUpFilterOperator.IsRepeat]: FOperator.IsRepeat,
};

export interface IOpenLookUpFilterBaseCondition {
  // conditionId: string;
  fieldId: string;
  operator: OpenLookUpFilterOperator;
}

export type IOpenLookUpFilterCondition<T extends FieldType = FieldType> = IOpenLookUpFilterBaseCondition &
  Omit<IFilterConditionMap[T], 'fieldType'> & { fieldType: APIMetaFieldType };

export type IWriteOpenLookUpFilterCondition<T extends FieldType = FieldType> = IOpenLookUpFilterCondition<T>;

export interface IOpenLookUpFilterInfo {
  conjunction: OpenLookUpFilterConjunction;
  conditions: IOpenLookUpFilterCondition[];
}

export interface IWriteOpenLookUpFilterInfo {
  conjunction: OpenLookUpFilterConjunction;
  conditions: IWriteOpenLookUpFilterCondition[];
}
