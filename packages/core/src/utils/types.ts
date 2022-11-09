import {
  IField,
  ISelectField,
  FieldType,
  ISingleSelectField,
  IMultiSelectField,
} from 'types/field_types';
import { IGroupInfo } from '../types';
import { ISnapshot } from '../exports/store/interfaces';
import { ViewType } from '../modules/shared/store/constants';

export function assertNever(x: never) {
  console.error(`${x} is not a never type`);
}

export function isSelectType(type: FieldType | null): type is FieldType.MultiSelect | FieldType.SingleSelect {
  return type === FieldType.MultiSelect || type === FieldType.SingleSelect;
}

export function isGroupFieldType(type: FieldType, viewType: ViewType = ViewType.Kanban): boolean {
  switch (viewType) {
    case ViewType.Grid: {
    // All grid fields can be grouped
      return true;
    }
    case ViewType.Kanban: {
      return type === FieldType.SingleSelect || type === FieldType.Member;
    }
  }
  return false;
}
export function isSelectField(field: Omit<IField, 'id'>): field is Omit<ISelectField, 'id'>;
export function isSelectField(field: IField): field is ISingleSelectField | IMultiSelectField;
export function isSelectField(field: IField | Omit<IField, 'id'>)
  : field is ISingleSelectField | IMultiSelectField | Omit<ISelectField, 'id'> {
  return isSelectType(field.type);
}

export function isGroupFieldValid(snapshot: ISnapshot, group: IGroupInfo, viewType: ViewType): boolean {
  if (viewType === ViewType.Kanban && group.length > 1) {
    return false;
  } else if (viewType === ViewType.Grid && group.length > 3) {
    return false;
  }
  return group.every(gp => {
    const field = snapshot.meta.fieldMap[gp.fieldId];
    return field && isGroupFieldType(field.type, viewType);
  });
}

export function isTextBaseType(type: FieldType): boolean {
  return [FieldType.Text, FieldType.Phone, FieldType.Email, FieldType.URL, FieldType.SingleText].includes(type);
}

export function isEnhanceTextType(type: FieldType): boolean {
  return [FieldType.Phone, FieldType.Email, FieldType.URL].includes(type);
}

export function isFormula(type: FieldType): boolean {
  return type === FieldType.Formula;
}

export function getTextFieldType(type: FieldType) {
  return {
    isSingleText: type === FieldType.SingleText,
    isEnhanceText: isEnhanceTextType(type),
  };
}

export function isNumberBaseType(type: FieldType): boolean {
  return [FieldType.Number, FieldType.Rating, FieldType.Currency, FieldType.Percent, FieldType.AutoNumber].includes(type);
}
