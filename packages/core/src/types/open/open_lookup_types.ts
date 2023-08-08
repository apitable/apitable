import { APIMetaFieldType } from 'types/field_api_enums';
import { FieldType } from 'types/field_types';
import { FilterConjunction, FOperator, IFilterConditionMap } from 'types/view_types';

export interface IOpenLookUpFilterBaseCondition {
  // conditionId: string;
  fieldId: string;
  operator: FOperator;
}

export type IOpenLookUpFilterCondition<T extends FieldType = FieldType> = IOpenLookUpFilterBaseCondition &
  Omit<IFilterConditionMap[T], 'fieldType'> & { fieldType: APIMetaFieldType };

export type IWriteOpenLookUpFilterCondition<T extends FieldType = FieldType> = IOpenLookUpFilterCondition<T>;

export interface IOpenLookUpFilterInfo {
  conjunction: FilterConjunction;
  conditions: IOpenLookUpFilterCondition[];
}

export interface IWriteOpenLookUpFilterInfo {
  conjunction: FilterConjunction;
  conditions: IWriteOpenLookUpFilterCondition[];
}
