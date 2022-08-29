/**
 * 解析 action 中的动态参数语法, 结合上下文将动态 input 渲染成静态 input
 * 这里先实现基于正则的模版渲染。对外职能：将 input （template / ast） 结合 context 生成静态 input
 */

import { IExpressionOperand, OperandTypeEnums } from './interface';
import { MagicVariableParser } from './magic_variable/magic_variable_parser';

export class InputParser<T> {
  // ${{ xxxx }} 匹配这种模版语法
  inputJSONPathRe = /\$\{\{([\w [\].]+)\}\}/g;
  expressionParser: MagicVariableParser<T>;
  constructor(expressionParser: MagicVariableParser<T>) {
    this.expressionParser = expressionParser;
  }

  /**
   * 实现基于 S-表达式 的动态参数渲染
   */
  render(input: IExpressionOperand, context: T): any {
    // trigger action input 现在默认都是表达式操作数
    return this.expressionParser.exec(input.value, context);
    return Object.keys(input).reduce((acc, key) => {
      const value = input[key];
      if (typeof value !== 'object' || ![OperandTypeEnums.Literal, OperandTypeEnums.Expression].includes(value?.type)) {
        throw Error('Object Value Must Be A IOperand Object!');
      }
      switch (value.type) {
        case OperandTypeEnums.Literal:
          acc[key] = value.value;
          break;
        case OperandTypeEnums.Expression:
          acc[key] = this.expressionParser.exec(value.value, context);
          break;
        default:
          throw Error('Object Value Must Be A IOperand Object!');
      }
      return acc;
    }, {});
  }

  /**
   * 实现正则匹配的动态参数渲染
   */
  // renderByRegex(input: string, context: T): string {
  //   let result = input;
  //   let match;
  //   while ((match = this.inputJSONPathRe.exec(input)) !== null) {
  //     const path = match[1];
  //     const value = this.getValueByPath(path, context);
  //     console.log(value, path, context);
  //     result = result.replace(match[0], value);
  //   }
  //   return result;
  // }

  // /** 解析 json path 结合 context 获取输出值
  //  * trigger.output
  //  **/
  // private getValueByPath(path: string, context: T): string {
  //   const pathArray = path.split('.');
  //   let value;
  //   const triggerNodeId = context.executedNodeIds[0];
  //   const actionsNodeIds = context.executedNodeIds.slice(1);
  //   // trigger 表示 
  //   for (let i = 0; i < pathArray.length; i++) {
  //     // 第一个 path 表明从哪个节点开始， trigger 和 actions 有所区分。
  //     const curPath = pathArray[i].trim();
  //     if (0 === i) {
  //       if (curPath === 'trigger') {
  //         value = context.context[triggerNodeId];
  //         continue;
  //       }
  //       if (curPath.startsWith('action')) {
  //         const actionIndex = curPath.split('[')[1].split(']')[0];
  //         value = context.context[actionsNodeIds[actionIndex]];
  //         console.log(value);
  //         continue;
  //       }
  //     }
  //     // TODO: 支持数组和对象通过中括号取值：trigger.output.fields["不能 点的字段名"]
  //     // if (curPath.startsWith('[') && curPath.endsWith(']')) {
  //     //   const key = curPath.substring(1, curPath.length - 1);
  //     //   if (Array.isArray(value) && isNumber(key)) {
  //     //     value = value[Number(key)];
  //     //   } else {
  //     //     value = value[curPath];
  //     //   }
  //     // }
  //     value = value[curPath];
  //   }
  //   return value;
  // }
}
