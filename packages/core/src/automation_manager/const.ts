export const EmptyObjectOperand = {
  type: 'Expression',
  value: {
    operator: 'newObject',
    operands: []
  }
};

export const EmptyArrayOperand = {
  type: 'Expression',
  value: {
    operator: 'newArray',
    operands: []
  }
};

export const EmptyNullOperand = {
  type: 'Literal',
  value: null,
};