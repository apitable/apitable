import {
  SingleSelectField,
} from 'model';
import { IField, FieldType } from 'types/field_types';

/**
 * 1.多选转单选时，传入的值是一个 ISelectedId[], 这里判断第一个是否存在于 newField 中
 * 2.单选转单选时，传入的值是一个 ISelectedId, 这里判断该 ISelectedId 是否存在于 newField 中
 * 3.其他类型转单选，传入的是一个 文本(name)，这里判断该文本是否已存在于 newField option 中
 * @export
 * @param {(string[] | string | null)} value
 * @param {SingleSelectField} newField
 * @param {Field} oldField
 * @returns {(string | null)}
 */
export function str2single(value: string[] | string | null,
  newField: SingleSelectField,
  oldField: IField): string | null {
  if (value == null) return null;
  /* 如果 value 是一个数组，但旧类型不是多选类型，则返回空 */
  if (Array.isArray(value) && oldField.type !== FieldType.MultiSelect) {
    console.warn(`当 value 参数是数组时，type 类型应该是多选类型:${FieldType.MultiSelect}，现在的类型时：${oldField.type}`);
    return null;
  }
  /* 当旧类型是多选时，value 是一个数组 */
  if (Array.isArray(value) && oldField.type === FieldType.MultiSelect) {
    value = value as string[];
    if (value.length > 0) {
      const id = value[0];
      const option = newField.findOptionById(id);
      return option ? option.id : null;
    }
    return null;
  } else if (oldField.type === FieldType.SingleSelect) {
    const option = newField.findOptionById(value as string);
    return option ? option.id : null;
  } 
  const option = newField.findOptionByName(value as string);
  return option ? option.id : null;
  
}
