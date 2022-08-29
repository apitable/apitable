import { IExpression } from './expression.interface';

export abstract class MagicVariableParserABC<T> {

  /**
   * 初始化解析器时，传入的系统函数
   */
  abstract sysFunctions: Function[];
  /**
   * 解析表达式，输出计算后的值
   */
  abstract exec(expression: IExpression, globalContext: T): any;
}