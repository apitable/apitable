import { IExpression, OperandTypeEnums } from 'automation_manager/interface';
import { MagicVariableParserABC } from 'automation_manager/interface/magic_variable.interface';

export class MagicVariableParser<T> extends MagicVariableParserABC<T> {
  // 预置的系统函数（操作符）
  sysFunctions: Function[];
  passFunctions: Function[];
  sysFunctionMap: { [key: string]: Function };
  constructor(sysFunctions: Function[], passFunctions: Function[] = []) {
    super();
    this.sysFunctions = sysFunctions;
    this.passFunctions = passFunctions;
    this.sysFunctionMap = sysFunctions.reduce((map, func) => {
      map[func.name] = func;
      return map;
    }, {});
  }

  // clone and freeze globalContext 在表达式解析时，上下文是只读的。
  exec(expression: IExpression, _globalContext: T): any {
    const globalContext = Object.freeze(JSON.parse(JSON.stringify(_globalContext)));
    return this._exec(expression, globalContext);
  }

  // 解析执行表达式
  _exec(expression: IExpression, globalContext: T): any {
    const operatorFunc = this.sysFunctionMap[expression.operator];
    if (this.passFunctions.length && this.passFunctions.includes(operatorFunc)) {
      return null;
    }
    if (!operatorFunc) {
      throw Error(`${expression.operator} not implemented.`);
    }
    const { operands } = expression;
    const args = operands.map(operand => {
      if (typeof operand === 'string') {
        return operand;
      }
      if (operand.type === OperandTypeEnums.Literal) {
        return operand.value;
      }
      return this._exec(operand.value, globalContext);
    });
    // 全局上下文始终作为第一个参数传入
    return operatorFunc(globalContext, ...args);
  }
}
