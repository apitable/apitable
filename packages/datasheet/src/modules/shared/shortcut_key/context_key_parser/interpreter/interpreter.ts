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

import { TokenType } from '../lexer/token';
import { AstNode, AstNodeType, BinaryOperatorNode, UnaryOperatorNode, ValueOperandNode } from '../parser/ast';

export type ResolverFunction = (value: string) => any;

export class Interpreter {
  readonly resolver: ResolverFunction;

  constructor(resolver: ResolverFunction) {
    this.resolver = resolver;
  }

  /**
   * Valuation by accessing the abstract syntax tree
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
