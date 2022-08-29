import {
  MultiSelectField,
} from 'model';
import { IField, FieldType } from 'types/field_types';

/**
 * 1.单选转多选时，传入的值是一个 string, 这里判断该 string 是否存在于 newField 中
 * 2.多选转多选时，传入的值是一个 string[], 这里判断 string[]里的 id 是否存在于 newField 中
 * 3.其他类型转单选，传入的是一个 文本(name)，这里判断该文本是否已存在于 newField option 中
 * @export
 * @param {(string[] | string | null)} value
 * @param {MultiSelectField} newField
 * @param {Field} oldField
 * @returns {(string[] | null)}
 */
export function str2multi(value: string[] | string | null,
  newField: MultiSelectField,
  oldField: IField): string[] | null {
  if (value == null) return null;
  /* 如果 value 是一个数组，但旧类型不是多选类型，则返回空 */
  if (Array.isArray(value) && oldField.type !== FieldType.MultiSelect) {
    console.warn(`当 value 参数是数组时，type 类型应该是多选类型:${FieldType.MultiSelect}，现在的类型时：${oldField.type}`);
    return null;
  }
  if (oldField.type === FieldType.SingleSelect) {
    const option = newField.findOptionById(value as string);
    return option ? [option.id] : null;
  } else if (Array.isArray(value) && oldField.type === FieldType.MultiSelect) {
    const result: string[] = [];
    (value as string[]).forEach(v => {
      const option = newField.findOptionById(v);
      if (option) {
        result.push(option.id);
      }
    });
    return result.length > 0 ? result : null;
  } 
  const option = newField.findOptionByName(value as string);
  if (option) {
    return [option.id];
  } 
  return null;

}
