import { IExpression } from './expression.interface';

export abstract class MagicVariableParserABC<T> {

  /**
   * init parser with system functions
   */
  abstract sysFunctions: Function[];
  /**
   * expression, the value of output calc
   */
  abstract exec(expression: IExpression, globalContext: T): any;
}