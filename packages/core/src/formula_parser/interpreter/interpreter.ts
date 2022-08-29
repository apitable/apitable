import {
  AstNode,
  AstNodeType,
  BinaryOperatorNode,
  UnaryOperatorNode,
  ValueOperandNode,
  StringOperandNode,
  CallOperandNode,
  NumberOperandNode,
  PureValueOperandNode,
} from '../parser/ast';
import { TokenType } from '../lexer/token';
import { Functions } from '../functions';
import { IFormulaContext, FormulaBaseError, getBlankValueByType } from 'formula_parser/functions/basic';
import { Field, ArrayValueField } from 'model';
import { BasicValueType, FormulaFuncType } from 'types';
import { plus, minus, times, divide } from 'utils';
import { isNumber, isNull } from 'util';
import { t, Strings } from 'i18n';
import { isString } from 'lodash';

export type ResolverFunction = (value: string, originValue?: boolean) => any;

export class Interpreter {
  readonly resolver: ResolverFunction;
  readonly context: IFormulaContext;

  constructor(resolver: ResolverFunction, scope: IFormulaContext) {
    this.resolver = resolver;
    this.context = scope;
  }

  private transformNodeValue(node: AstNode, value: any, tokenType: TokenType) {
    // 字段值类型的 Node 需要执行专属的字符串转换逻辑
    if (node.name === AstNodeType.ValueOperandNode || node.name === AstNodeType.PureValueOperandNode) {
      const field = (node as ValueOperandNode).field;
      const fieldBasicValueType = Field.bindContext(field, this.context.state).basicValueType;
      /**
       * DateTime 类型针对比较运算符，需要以时间戳格式进行比较，
       * @example {起始时间} = TODAY()
       */
      if (
        [BasicValueType.Number, BasicValueType.Boolean, BasicValueType.String].includes(fieldBasicValueType) ||
        (
          fieldBasicValueType === BasicValueType.DateTime && 
          [
            TokenType.Equal, 
            TokenType.NotEqual, 
            TokenType.Less, 
            TokenType.LessEqual,
            TokenType.Greater, 
            TokenType.GreaterEqual, 
          ].includes(tokenType)
        )
      ) {
        return value;
      }

      if (fieldBasicValueType === BasicValueType.Array) {
        switch (node.innerValueType) {
          // 直接取第一个值进行计算
          case BasicValueType.Number: {
            if (!value?.length) return null;
            if (value.length > 1) {
              throw new FormulaBaseError('');
            }
            return Number(value[0]);
          }
          default:
            return (Field.bindContext(field, this.context.state) as ArrayValueField).arrayValueToString(value);
        }
      }

      return Field.bindContext(field, this.context.state).cellValueToString(value);
    }
    return value;
  }

  /**
   * 通过访问抽象语法树进行求值
   * @param {AstNode} node
   * @returns {any}
   * @memberof Interpreter
   */
  visit(node: AstNode, isErrorScope = false): any {
    if (!node) {
      throw new TypeError('A AST Node is required to visit');
    }
    try {
      switch (node.name) {
        case AstNodeType.BinaryOperatorNode: {
          return this.visitBinaryOperatorNode(node as BinaryOperatorNode);
        }
        case AstNodeType.StringOperandNode: {
          return this.visitStringOperatorNode(node as StringOperandNode);
        }
        case AstNodeType.CallOperandNode: {
          return this.visitCallOperatorNode(node as CallOperandNode, isErrorScope);
        }
        case AstNodeType.NumberOperandNode: {
          return this.visitNumberOperatorNode(node as NumberOperandNode);
        }
        case AstNodeType.UnaryOperatorNode: {
          return this.visitUnaryOperatorNode(node as UnaryOperatorNode);
        }
        case AstNodeType.ValueOperandNode: {
          return this.visitValueOperandNode(node as ValueOperandNode);
        }
        case AstNodeType.PureValueOperandNode: {
          return this.visitPureValueOperandNode(node as PureValueOperandNode);
        }
        default: return;
      }
    } catch (e) {
      if (isErrorScope) {
        return e;
      }
      throw e;
    }

    throw new TypeError(`Unexpected AST Node Type: ${node.name}`);
  }

  private visitBinaryOperatorNode(node: BinaryOperatorNode): any {
    const tokenType = node.token.type;
    let left = this.transformNodeValue(node.left, this.visit(node.left), tokenType);
    let right = this.transformNodeValue(node.right, this.visit(node.right), tokenType);

    // 对 BLANK 函数做值转换处理
    if (node.left.token?.value.toUpperCase() === 'BLANK') {
      left = getBlankValueByType(node.right.valueType, right);
    }
    if (node.right.token?.value.toUpperCase() === 'BLANK') {
      right = getBlankValueByType(node.left.valueType, left);
    }

    switch (tokenType) {
      case TokenType.And: {
        return Boolean(left && right);
      }
      case TokenType.Or: {
        return Boolean(left || right);
      }
      case TokenType.Add: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        if (isNumber(left) && isNumber(right)) {
          return plus(left, right);
        }
        return left + right;
      }
      case TokenType.Minus: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return minus(left, right);
      }
      case TokenType.Times: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return times(left, right);
      }
      case TokenType.Div: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return divide(left, right);
      }
      case TokenType.Mod: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return left % right;
      }
      case TokenType.Equal: {
        // tslint:disable-next-line: triple-equals
        return left == right; // eslint-disable-line eqeqeq
      }
      case TokenType.NotEqual: {
        // tslint:disable-next-line: triple-equals
        return left != right; // eslint-disable-line eqeqeq
      }
      case TokenType.Greater: {
        return left > right;
      }
      case TokenType.GreaterEqual: {
        return left >= right;
      }
      case TokenType.Less: {
        return left < right;
      }
      case TokenType.LessEqual: {
        return left <= right;
      }
      case TokenType.Concat: {
        return String(left == null ? '' : left) + String(right == null ? '' : right);
      }
      default: return;
    }
    throw new TypeError(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitUnaryOperatorNode(node: UnaryOperatorNode): number | boolean {
    if (node.token.type === TokenType.Not) {
      return !this.visit(node.child);
    }
    if (node.token.type === TokenType.Add) {
      return +this.visit(node.child);
    }
    if (node.token.type === TokenType.Minus) {
      return -this.visit(node.child);
    }
    throw new TypeError(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitValueOperandNode(node: ValueOperandNode, originValue?: boolean): any {
    return this.resolver(node.value.slice(1, -1), originValue);
  }

  private visitPureValueOperandNode(node: PureValueOperandNode, originValue?: boolean): any {
    return this.resolver(node.value, originValue);
  }

  private visitStringOperatorNode(node: StringOperandNode): string {
    return node.value.slice(1, -1);
  }

  private visitCallOperatorNode(node: CallOperandNode, isErrorScope = false): any {
    const fnName = node.value.toUpperCase();
    const fnClass = Functions.get(fnName);
    if (!fnClass) {
      throw new TypeError(t(Strings.function_err_not_found_function_name_as, {
        fnName,
      }));
    }
    // IS_ERROR 函数需要监测到内部方程式是否会报错，IF/SWITCH 需要执行到 Error 才进行报错，
    // 因此这里对 IS_ERROR/IF/SWITCH 函数做特殊标记
    // TODO：这里先做 ISERROR 的兼容，刷完用户数据后统一删掉
    if (fnName === 'ISERROR' || fnName === 'IS_ERROR' || fnName === 'IF' || fnName === 'SWITCH') {
      isErrorScope = true;
    }

    const params = node.params.map(param => {
      let value = this.visit(param, isErrorScope);
      let valueType = param.valueType;
      // 字段值类型的 Node 需要执行专属的字符串转换逻辑
      if (param.name === AstNodeType.ValueOperandNode || param.name === AstNodeType.PureValueOperandNode) {
        const field = (param as ValueOperandNode).field;

        // 若参数类型为 Array && 不被函数参数类型接受
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.Array) {
          const innerValueType = param.innerValueType;

          // 数组内置类型为 Number 且只有一项时，可进行相应的运算，
          // 若有多项，为避免用户误会，采取直接报错的形式
          if (innerValueType === BasicValueType.Number) {
            if (value?.length > 1) {
              throw new FormulaBaseError('');
            }
            value = value && value[0];
          } else {
            // 数组内置类型不为 Number，直接转为字符串
            value = value?.length && value.filter(v => !isNull(v)).join(', ');
          }
          innerValueType && (valueType = innerValueType);
        }

        /**
         * value 值返回规则（粒度为具体的公式类）：
         * 1. 若 acceptValueType 不包含 valueType，则会统一经过 cellValueToString 方法处理；
         * 2. 若需要返回原始值，则需要添加当前 valueType 到 acceptValueType；
         */
        if (!fnClass.func.acceptValueType.has(valueType)) {
          if (isString(value)) {
            value = value.split(', ');
          }
          value = Field.bindContext(field, this.context.state).cellValueToString(value as any);
        }
      } else {
        // 将数组类型值转换为字符串类型。(理论上只会有字段值才会有数组类型，所以这里不会生效)
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.Array) {
          value = String(value);
        }

        // 将日期类型值转换为字符串类型。
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.DateTime) {
          value = value == null ? value : new Date(value).toISOString();
        }
      }

      return { node: param, value };
    });

    fnClass.func.validateParams(node.params);
    // 对 DateTime 类函数做预检查
    // LAST_MODIFIED_TIME 基于 record.recordMeta 进行计算，无需其他单元格的值
    if (fnClass.func.type === FormulaFuncType.DateTime && params.length && params[0]?.value == null && fnName !== 'LAST_MODIFIED_TIME') {
      return null;
    }
    return fnClass.func.func(params, this.context);
  }

  private visitNumberOperatorNode(node: NumberOperandNode): number {
    return Number(node.value);
  }
}
