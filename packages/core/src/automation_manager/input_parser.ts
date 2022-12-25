/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * parse the input template with context, and return the parsed result
 * eg: render(`say ${{ trigger.event.output }}`,{ "trigger":{ "event": "output":{ "hello" } } }) => "say hello"
 * at the beginning, we use regular expression to parse the template
 * but for now, we use AST to parse the template, just keep code of regular expression here
 * `InputParser` just a wrapper of ast parser, for more detail, see `MagicVariableParser` or check the test unit to see how to use it
 */

import { IExpressionOperand } from './interface';
import { MagicVariableParser } from './magic_variable/magic_variable_parser';

export class InputParser<T> {
  // match `${{ xxxx }}`
  inputJSONPathRe = /\$\{\{([\w [\].]+)\}\}/g;
  expressionParser: MagicVariableParser<T>;
  constructor(expressionParser: MagicVariableParser<T>) {
    this.expressionParser = expressionParser;
  }

  render(input: IExpressionOperand, context: T): any {
    return this.expressionParser.exec(input.value, context);
    // return Object.keys(input).reduce((acc, key) => {
    //   const value = input[key];
    //   if (typeof value !== 'object' || ![OperandTypeEnums.Literal, OperandTypeEnums.Expression].includes(value?.type)) {
    //     throw Error('Object Value Must Be A IOperand Object!');
    //   }
    //   switch (value.type) {
    //     case OperandTypeEnums.Literal:
    //       acc[key] = value.value;
    //       break;
    //     case OperandTypeEnums.Expression:
    //       acc[key] = this.expressionParser.exec(value.value, context);
    //       break;
    //     default:
    //       throw Error('Object Value Must Be A IOperand Object!');
    //   }
    //   return acc;
    // }, {});
  }

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

  //  * trigger.output
  //  **/
  // private getValueByPath(path: string, context: T): string {
  //   const pathArray = path.split('.');
  //   let value;
  //   const triggerNodeId = context.executedNodeIds[0];
  //   const actionsNodeIds = context.executedNodeIds.slice(1);
  //   for (let i = 0; i < pathArray.length; i++) {
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
