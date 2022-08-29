/**
 * 表达式相关的操作工具函数
 */
import produce from 'immer';
import { isEqual } from 'lodash';
import { EmptyNullOperand, EmptyObjectOperand, EmptyArrayOperand } from './const';

// 判断一个对象是否是操作数
export const isOperand = (value: any) => {
  if (value == null) return false;
  return typeof value === 'object' && value.type === 'Literal' || value.type === 'Expression';
};

export const isLiteralOperand = (value: any) => {
  return isOperand(value) && value.type === 'Literal';
};

// 判断一个对象是否是数组操作数
export const isArrayOperand = (operand: any) => {
  return isOperand(operand) && !isLiteralOperand(operand) && operand.value.operator === 'newArray';
};

// 判断一个对象是否是对象操作数
export const isObjectOperand = (operand: any) => {
  return isOperand(operand) && !isLiteralOperand(operand) && operand.value.operator === 'newObject';
};

/**
 * 获取对象操作数指定 key 的值
 * @param objectOperand 
 * @param key 
 * @param propertySchema 获取的属性的 schema，由此返回默认的空值。 
 */
export const getObjectOperandProperty = (objectOperand, key, propertySchema) => {
  if (isObjectOperand(objectOperand)) {
    const keyIndex = objectOperand.value.operands.findIndex((operand, index) => {
      return index % 2 === 0 && typeof operand === 'string' ? key === operand : isEqual(operand, key);
    });
    if (keyIndex > -1) {
      return objectOperand.value.operands[keyIndex + 1];
    }
    return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
  // formData 本身就是空的
  if (objectOperand == null || Object.keys(objectOperand).length === 0) {
    return JSON.parse(JSON.stringify(EmptyNullOperand));
  }
  // 拿不到，返回空值。
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

// 获取操作数值的类型
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

export const isOperandNullValue = (operand, schema) => {
  // 操作数的空值
  if (operand.type === 'Literal' && operand.value === null) {
    return true;
  }
  switch (schema.type) {
    case 'object':
      return isEqual(operand, EmptyObjectOperand);
    case 'array':
      return isEqual(operand, EmptyArrayOperand);
    case 'string':
      break;
    case 'boolean':
      break;
    case 'number':
      break;
  }
  return;
};

/**
 * 递归合并合并 objects 对象
 * - ['key1',{k11:v11,k12:v12},'key1',{k11:v12,k22:v22},'key2','value22'] => 
 * {
 *   key1: {
 *      k11: v12,
 *      k12:v12, // 后面的没有这个 key 保留
 *      k22: v22 // 前面的没有这个 key 加上
 *   }
 *   key2: 'value22'
 * }
 * @param operands 
 */
export const objectCombOperand = (operands: any[]) => {
  // 后面的相同 key 的 item 会覆盖前面的。
  const newItems: any[] = [];
  for (let idx = 0; idx < operands.length; idx += 2) {
    // idx 0 2 4 6 8 
    const itemKey = operands[idx]; // 0
    const itemValue = operands[idx + 1]; //1
    // 偶数位为 key
    const newItemKeys = newItems.filter((item, index) => {
      return index % 2 === 0;
    });
    const itemKeyIndex = newItemKeys.findIndex(key => isEqual(key, itemKey));
    if (itemKeyIndex > -1) {
      const itemValueIndex = itemKeyIndex * 2 + 1;
      const oldItemValue = newItems[itemValueIndex];
      // 没有模式匹配啊阿啊阿啊
      if (isObjectOperand(oldItemValue) && isObjectOperand(itemValue)) {
        newItems[itemValueIndex] = mergeOperand(oldItemValue, itemValue);
      } else {
        newItems[itemValueIndex] = itemValue;
      }
    } else {
      // 不存在的 key 直接加 
      newItems.push(itemKey);
      newItems.push(itemValue);
    }
  }
  return newItems;
};
export const removeArrayOperandItemByIndex = (arrayOperand, index: number) => {
  return produce(arrayOperand, draft => {
    if (isOperand(draft)) {
      draft.value.operands.splice(index, 1);
    }
    return draft;
  });
};

/**
 * 将正常的嵌套结构的对象转化为操作数
 */
export const data2Operand = (data: any) => {
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
      // 普通对象
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
 * 合并两个操作数
 * @param operand1 
 * @param operand2 
 */
export const mergeOperand = (operand1, operand2) => {
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