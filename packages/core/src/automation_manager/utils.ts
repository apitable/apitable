/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * utils for operand
 */
import produce from 'immer';
import { JSONSchema7 } from 'json-schema';
import { isEqual } from 'lodash';
import { EmptyNullOperand, EmptyObjectOperand, EmptyArrayOperand } from './const';

// is input value an operand
export const isOperand = (value: any) => {
  if (value == null) return false;
  return typeof value === 'object' && value.type === 'Literal' || value.type === 'Expression';
};

// is input value an expression
export const isLiteralOperand = (value: any) => {
  return isOperand(value) && value.type === 'Literal';
};

// is input value an array operand
export const isArrayOperand = (operand: any) => {
  return isOperand(operand) && !isLiteralOperand(operand) && operand.value.operator === 'newArray';
};

// is input value an object operand
export const isObjectOperand = (operand: any) => {
  return isOperand(operand) && !isLiteralOperand(operand) && operand.value.operator === 'newObject';
};

/**
 * get value of operand-object by key
 * @param objectOperand
 * @param key
 * @param propertySchema
 */
export const getObjectOperandProperty = (objectOperand: any, key: string, propertySchema: any) => {
  if (isObjectOperand(objectOperand)) {
    const keyIndex = (objectOperand.value.operands as any[]).findIndex((operand, index) => {
      return index % 2 === 0 && typeof operand === 'string' ? key === operand : isEqual(operand, key);
    });
    if (keyIndex > -1) {
      return objectOperand.value.operands[keyIndex + 1];
    }
    return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
  // when formData is empty, return default null value
  if (objectOperand == null || Object.keys(objectOperand).length === 0) {
    return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
  switch (propertySchema.type) {
    case 'object':
      return JSON.parse(JSON.stringify(EmptyObjectOperand));
    case 'array':
      return JSON.parse(JSON.stringify(EmptyArrayOperand));
    default:
      return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
};

const getExpressionOperatorReturnType = (operator: string) => {
  const OperatorReturnTypeMap = {
    newArray: 'array',
    newObject: 'object',
    concatString: 'string',
    getArrayLength: 'number',
    concatParagraph: 'string',
    and: 'boolean',
    or: 'boolean',
    JSONStringify: 'string',
    length: 'number',
  };
  return OperatorReturnTypeMap[operator] || 'null';
};

// get return type of operand
export const getOperandValueType = (operand: any) => {
  if (!isOperand(operand)) {
    throw Error('must be operand');
  }
  if (operand.type === 'Literal') {
    return typeof operand.value;
  }
  if (operand.type === 'Expression') {
    return getExpressionOperatorReturnType(operand.value.operator);
  }
  throw Error('must be operand');
};

export const isOperandNullValue = (operand: any, schema: any): boolean => {
  // if null
  if (operand.type === 'Literal' && operand.value === null) {
    return true;
  }
  switch (schema.type) {
    case 'object': {
      return Object.keys(schema.properties!).some(propertyKey => {
        const propertySchema = schema.properties![propertyKey] as JSONSchema7;
        const propertyValue = getObjectOperandProperty(operand, propertyKey, propertySchema);
        return isOperandNullValue(propertyValue, propertySchema);
      });
    }
    case 'array':
      return isEqual(operand, EmptyArrayOperand);
    case 'string':
      break;
    case 'boolean':
      break;
    case 'number':
      break;
  }
  return false;
};

/**
 * merge to the array of operands into one object operand
 * - ['key1',{k11:v11,k12:v12},'key1',{k11:v12,k22:v22},'key2','value22'] =>
 * {
 *   key1: {
 *      k11: v12, // params[0].key1.k11 is overrided by params[2].key1.k11
 *      k12: v12, // params[0].key1 has 'k12' and params[2].key1 has no 'k12', so keep params[0].key1.k12
 *      k22: v22  // params[2].key1 has 'k22' and params[0].key1 has no 'k22', so keep params[2].key1.k22
 *   }
 *   key2: 'value22'
 * }
 * @param operands
 */
export const objectCombOperand = (operands: any[]) => {
  const newItems: any[] = [];
  for (let idx = 0; idx < operands.length; idx += 2) {
    // idx 0 2 4 6 8
    const itemKey = operands[idx]; // 0
    const itemValue = operands[idx + 1]; //1
    // even numbers is key & odd numbers is value
    const newItemKeys = newItems.filter((_item, index) => {
      return index % 2 === 0;
    });
    const itemKeyIndex = newItemKeys.findIndex(key => isEqual(key, itemKey));
    if (itemKeyIndex > -1) {
      const itemValueIndex = itemKeyIndex * 2 + 1;
      const oldItemValue = newItems[itemValueIndex];
      if (isObjectOperand(oldItemValue) && isObjectOperand(itemValue)) {
        newItems[itemValueIndex] = mergeOperand(oldItemValue, itemValue);
      } else {
        newItems[itemValueIndex] = itemValue;
      }
    } else {
      newItems.push(itemKey);
      newItems.push(itemValue);
    }
  }
  return newItems;
};
export const removeArrayOperandItemByIndex = (arrayOperand: any, index: number) => {
  return produce(arrayOperand, (draft: any) => {
    if (isOperand(draft)) {
      draft.value.operands.splice(index, 1);
    }
    return draft;
  });
};

/**
 * transform an object to an operand
 */
export const data2Operand = (data: any): any => {
  if (data == null) {
    return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
  switch (typeof data) {
    case 'object':
      // array
      if (Array.isArray(data)) {
        return {
          type: 'Expression',
          value: {
            operator: 'newArray',
            operands: data.map(item => data2Operand(item))
          }
        };
      }
      return {
        type: 'Expression',
        value: {
          operator: 'newObject',
          operands: Object.keys(data).map(key => [key, data2Operand(data[key])]).flat()
        }
      };
    case 'string':
    case 'number':
    case 'boolean':
      return {
        type: 'Literal',
        value: data
      };
  }
};

/**
 * merge two operands into one
 * @param operand1
 * @param operand2
 */
export const mergeOperand = (operand1: any, operand2: any) => {
  if (isObjectOperand(operand1) && isObjectOperand(operand2)) {
    return {
      type: 'Expression',
      value: {
        operator: 'newObject',
        operands: objectCombOperand([...operand1.value.operands, ...operand2.value.operands])
      }
    };
  }
  return operand1;
};

export const getLiteralOperandValue = (operand: any) => {
  if (isLiteralOperand(operand)) {
    return operand.value;
  }
  throw Error('must be literal operand');
};
