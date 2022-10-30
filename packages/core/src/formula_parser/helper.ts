import { handleNullArray } from 'model';
import { FieldType } from 'types';
import { IFormulaParam } from './functions/basic';
import { AstNodeType, ValueOperandNode } from './parser';
import { produce } from 'immer';

/**
 * lookup cv now leaves null by default. 
 * When the formula refers to the lookup field as a parameter, some functions need to convert the null value to make it as expected.
 */
export const handleLookupNullValue = (params: IFormulaParam<any>[]) => {
  return produce(params, draftParams => {
    draftParams.forEach(param => {
      if (param.node.name === AstNodeType.ValueOperandNode
        && (param.node as ValueOperandNode).field.type === FieldType.LookUp
        && handleNullArray(param.value) == null
      ) {
        param.value = null;
      }
    });
  });
};