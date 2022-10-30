import { FieldType, IField, ISelectField, IMultiSelectField } from 'types/field_types';
import { IFilterCondition } from 'types/view_types';

type ISelectFieldType = ISelectField | IMultiSelectField;

// Check that the column type switch causes the filter to fail
export const checkTypeSwitch = (item?: IFilterCondition<FieldType>, field?: IField) => {
  const isSameType = item?.fieldType === field?.type;
  if (!isSameType) {
    return true;
  }
  
  // After checking for two type switches (the type didn't change), but the option id changed
  if (item?.fieldType && [FieldType.SingleSelect, FieldType.MultiSelect].includes(item?.fieldType)) {
    const value = item?.value;
    const { options } = (field as ISelectFieldType).property;
    const ids = options.map(o => o.id);
    // value does not exist, indicating that it has not been selected
    // Determine whether value has a corresponding value in options id
    return Boolean(value) && (
      Array.isArray(value) ? !value.every(v => ids.includes(v)) : !ids.includes(value)
    );
  }
  return false;
};