import { FormulaFunc, IFormulaParam, IFormulaContext } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser';

class RecordFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Record;
}

export class RecordId extends RecordFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(_params: [IFormulaParam<number>], context: IFormulaContext): string {
    return context ? context.record.id : '';
  }
}
