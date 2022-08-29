import { nanoid } from 'nanoid';

export function generateRowId() {
  return nanoid();
}

/**
 * 给每个 array item 添加一个唯一 key
 * @param formData 
 */
export function generateKeyedFormData(formData: any) {
  const { operands } = formData.value;
  const newOperands = operands.map((v) => (
    { ...v, key: v.key || generateRowId() }
  ));
  return {
    ...formData,
    value: {
      ...formData.value,
      operands: newOperands
    },
  };
  // return Array.isArray(formData) ? formData.map(item => {
  //   return {
  //     key: generateRowId(),
  //     item,
  //   };
  // }) : [];
}

export function keyedToPlainFormData(keyedFormData: any) {
  const { operands } = keyedFormData.value;
  const newOperands = operands.map((v) => {
    // eslint-disable-next-line
    const { key, ...rest } = v;
    return { ...rest };
  });
  return {
    ...keyedFormData,
    value: {
      ...keyedFormData.value,
      operands: newOperands
    },
  };
  // return keyedFormData.map((keyedItem: any) => keyedItem.item);
}

export const EmptyArrayOperand = {
  type: 'Expression',
  value: {
    operator: 'newArray',
    operands: []
  }
};