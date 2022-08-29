import { FormulaFunc, IFormulaParam, IFormulaContext } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser';

class RecordFunc extends FormulaFunc {
  static readonly type = FormulaFuncType.Record;
}

export class RecordId extends RecordFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<number>], context: IFormulaContext): string {
    return context ? context.record.id : '';
  }
}
