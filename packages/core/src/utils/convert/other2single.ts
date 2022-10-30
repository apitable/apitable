import {
  SingleSelectField,
} from 'model';
import { IField, FieldType } from 'types/field_types';

/**
 * 1. When converting from multiple selection to single selection, 
 * the incoming value is an ISelectedId[], here it is judged whether the first one exists in newField
 * 2. When converting from radio to radio, the incoming value is an ISelectedId, here it is judged whether the ISelectedId exists in newField
 * 3. For other types to radio selection, a text (name) is passed in. Here it is judged whether the text already exists in the newField option
 * 
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
  /* If value is an array, but the old type is not a multi-select type, return null */
  if (Array.isArray(value) && oldField.type !== FieldType.MultiSelect) {
    console.warn(`When the value parameter is an array, the type should be a multi-select type: \
                  ${FieldType.MultiSelect}, the current type: ${oldField.type}`);
    return null;
  }
  /* When the old type is multiple selection, value is an array */
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
