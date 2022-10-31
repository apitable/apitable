import { IExpression, OperandTypeEnums } from 'automation_manager/interface';
import { MagicVariableParserABC } from 'automation_manager/interface/magic_variable.interface';

export class MagicVariableParser<T> extends MagicVariableParserABC<T> {
  // built-in functions
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

  // clone and freeze globalContext to avoid mutation
  exec(expression: IExpression, _globalContext: T): any {
    const globalContext = Object.freeze(JSON.parse(JSON.stringify(_globalContext)));
    return this._exec(expression, globalContext);
  }

  // parse expression and return value
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
    // global context always pass as first argument
    return operatorFunc(globalContext, ...args);
  }
}
