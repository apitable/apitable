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

import { Interpreter, ResolverFunction } from './interpreter/interpreter';
import { BooleanExprLexer } from './lexer/lexer';
import { AstNode } from './parser/ast';
import { BooleanExprParser } from './parser/parser';

export interface IContext {
  [key: string]: () => boolean;
}
export type Resolver = (value: string, context: IContext) => boolean;

/**
 * Resolver is to get the value from the context given a string
 *
 * Example:
 * value = 'a', context = { a: true }
 * objectResolver All you have to do is return context[value]()
 */
const objectResolver: Resolver = (value: string, context: IContext): boolean => {
  if (context && context.hasOwnProperty(value)) {
    return context[value]();
  }
  return false;
};

function resolverWrapper(context: any, resolver?: Resolver): ResolverFunction {
  if (resolver) {
    return (value: string) => resolver(value, context);
  }

  return (value: string) => objectResolver(value, context);
}

const cache: Record<string, AstNode> = {};

function ContextKeyParse(expression: string): AstNode {
  if (cache[expression]) {
    return cache[expression];
  }

  const lexer = new BooleanExprLexer(expression);
  const parser = new BooleanExprParser(lexer);

  cache[expression] = parser.parse();

  return cache[expression];
}

/**
 * Pass in the expression and context to evaluate
 * rootNode Root of the abstract syntax tree
 * interpreter The effect is to access the abstract syntax tree
 * @export
 * @param {string} expression
 * @param {*} context
 * @param {Resolver} [resolver]
 * @returns {boolean}
 */
export function ContextKeyEvaluate(expression: string, context: any, resolver?: Resolver): boolean {
  const rootNode = ContextKeyParse(expression);
  const resolverFn = resolverWrapper(context, resolver);
  const interpreter = new Interpreter(resolverFn);

  return interpreter.visit(rootNode);
}
