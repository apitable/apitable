import { handleNullArray } from 'model';
import { FieldType } from 'types';
import { IFormulaParam } from './functions/basic';
import { AstNodeType, ValueOperandNode } from './parser';
import { produce } from 'immer';

/**
 * lookup cv 现在默认保留空值。公式引用 lookup 字段作为参数时，部分函数需要对其空值做转换处理，使其符合预期。
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