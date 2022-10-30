import {
  MultiSelectField,
} from 'model';
import { IField, FieldType } from 'types/field_types';

/**
 * 1. When converting from single selection to multiple selection, 
 * the incoming value is a string, here it is judged whether the string exists in newField
 * 
 * 2. When converting multiple selections to multiple selections, 
 * the incoming value is a string[], here it is judged whether the id in string[] exists in newField
 * 
 * 3. For other types to radio selection, a text (name) is passed in. 
 * Here it is judged whether the text already exists in the newField option
 * 
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
  /* If value is an array, but the old type is not a multi-select type, return null */
  if (Array.isArray(value) && oldField.type !== FieldType.MultiSelect) {
    console.warn(`When the value parameter is an array, the type should be a multi-select type: \
                  ${FieldType.MultiSelect}, the current type: ${oldField.type}`);
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
