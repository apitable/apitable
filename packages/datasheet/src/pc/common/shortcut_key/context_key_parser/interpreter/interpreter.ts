import {
  AstNode,
  AstNodeType,
  BinaryOperatorNode,
  UnaryOperatorNode,
  ValueOperandNode,
} from '../parser/ast';
import { TokenType } from '../lexer/token';

export type ResolverFunction = (value: string) => any;

export class Interpreter {
  readonly resolver: ResolverFunction;

  constructor(resolver: ResolverFunction) {
    this.resolver = resolver;
  }

  /**
   * 通过访问抽象语法树进行求值
   * @param {AstNode} node
   * @returns {boolean}
   * @memberof Interpreter
   */
  visit(node: AstNode): boolean {
    if (!node) {
      throw new Error('A AST Node is required to visit');
    }

    switch (node.name) {
      case AstNodeType.BinaryOperatorNode: {
        return this.visitBinaryOperatorNode(node as BinaryOperatorNode);
      }
      case AstNodeType.UnaryOperatorNode: {
        return this.visitUnaryOperatorNode(node as UnaryOperatorNode);
      }
      case AstNodeType.ValueOperandNode:
      default: {
        return this.visitValueOperandNode(node as ValueOperandNode);
      }
    }

    throw new Error(`Unexpected AST Node Type: ${node.name}`);
  }

  private visitBinaryOperatorNode(node: BinaryOperatorNode): boolean {
    if (node.token.type === TokenType.And) {
      return this.visit(node.left) && this.visit(node.right);
    } else if (node.token.type === TokenType.Or) {
      return this.visit(node.left) || this.visit(node.right);
    }
    throw new Error(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitUnaryOperatorNode(node: UnaryOperatorNode): boolean {
    if (node.token.type === TokenType.Not) {
      return !this.visit(node.child);
    }
    throw new Error(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitValueOperandNode(node: ValueOperandNode): boolean {
    if (node.value === 'true') {
      return true;
    } else if (node.value === 'false' || node.value === 'null') {
      return false;
    } 
    return this.resolveValue(node.value);
    
  }

  private resolveValue(value: string): boolean {
    const resolvedValue = !!this.resolver(value);
    return resolvedValue;
  }
}
