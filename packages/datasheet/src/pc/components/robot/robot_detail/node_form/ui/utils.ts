import { IUiSchema } from '../core/interface';

// export const getObjectDepth = (props: ObjectFieldTemplateProps): number => {
//   const { idSchema } = props;
//   const ids = idSchema.$id.split('_');
//   return ids.length - 1;
// };

export const getOptions = (key: string, uiSchema: IUiSchema): {
  has: boolean,
  value?: any,
} => {
  if ('ui:options' in uiSchema && key in uiSchema['ui:options']!) {
    return {
      has: true,
      value: uiSchema['ui:options']![key]
    };
  }
  return {
    has: false,
  };
};

export const literal2Operand = (literal: any): object => {
  return {
    type: 'Literal',
    value: literal
  };
};

export const operand2Literal = (operand: any): any => {
  if (operand == null) {
    return null;
  }
  if (operand.type === 'Literal') {
    return operand.value;
  }
  return operand;
};