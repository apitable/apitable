import { BooleanExprLexer } from './lexer/lexer';
import { AstNode } from './parser/ast';
import { BooleanExprParser } from './parser/parser';
import { Interpreter, ResolverFunction } from './interpreter/interpreter';

export interface IContext { [key: string]: () => boolean; }
export type Resolver = (value: string, context: IContext) => boolean;

/**
 * Resolver 的作用是，给定一个字符串，根据字符串从 context 中获取值
 *
 * Example:
 * value = 'a', context = { a: true }
 * objectResolver 要做的就是返回 context[value]()
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
 * 传入表达式和 context，进行求值
 * rootNode 为抽象语法树的根
 * interpreter 作用为访问该抽象语法树
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

