import { FieldType, IField, ISelectField, IMultiSelectField } from 'types/field_types';
import { IFilterCondition } from 'types/view_types';

type ISelectFieldType = ISelectField | IMultiSelectField;

// 检查列类型切换导致筛选失效
export const checkTypeSwitch = (item?: IFilterCondition<FieldType>, field?: IField) => {
  const isSameType = item?.fieldType === field?.type;
  if (!isSameType) {
    return true;
  }
  
  // 检查两次类型切换后（类型没有变化），但是 option id 改变了
  if (item?.fieldType && [FieldType.SingleSelect, FieldType.MultiSelect].includes(item?.fieldType)) {
    const value = item?.value;
    const { options } = (field as ISelectFieldType).property;
    const ids = options.map(o => o.id);
    // value 不存在，表示还未选择
    // 判断 value 是否在 options id 中有对应的值
    return Boolean(value) && (
      Array.isArray(value) ? !value.every(v => ids.includes(v)) : !ids.includes(value)
    );
  }
  return false;
};