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

import { AstNode, FormulaExprParser } from './parser';
import { Interpreter, ResolverFunction } from './interpreter/interpreter';
import { IFieldMap, IFieldPermissionMap, IReduxState } from 'exports/store/interfaces';
import {
  getDatasheet,
  getFieldMap,
  getFieldPermissionMap,
  getFieldRoleByFieldId,
  getCellValue
} from 'modules/database/store/selectors/resource/datasheet';
import { TokenType, FormulaExprLexer } from './lexer';
import { Field } from 'model/field';
import { ArrayValueField } from 'model/field/array_field';
import { IFormulaContext, IFormulaEvaluateContext, FormulaBaseError } from './functions/basic';
import { BasicValueType, FieldType, IField } from 'types';
import { t, Strings } from 'exports/i18n';
import { isFinite, isNumber } from 'lodash';
import { ConfigConstant } from 'config';
import { ROLLUP_KEY_WORDS } from './consts';

export interface IFormulaExpr {
  lexer: FormulaExprLexer;
  ast: AstNode;
}

export interface IFormulaError {
  error: Error;
}

function resolverWrapper(context: IFormulaContext): ResolverFunction {
  /**
   * The role of the resolver is, given a fieldId, get the value from the context according to the string
   *params
   * @value field ID
   * @originValue: whether to return the value of the original cell
   */
  return (fieldId: string) => {
    /**
     * Check for reserved keywords when formulas are run in the lookUp field.
     * When the keyword is hit, return LookUpField's cellValueArray instead of cellValue
     */
    const hostField = context.field;
    const state = context.state;
    // TODO: The first phase of column permissions,
    // because the middle layer does not actively push data,
    // and getFieldMap actively masks the data, so here we temporarily use the datasheet to get the fieldmap directly
    const datasheet = getDatasheet(state, context.field.property.datasheetId)!;
    const fieldMap = datasheet.snapshot.meta.fieldMap;
    // const fieldMap = getFieldMap(state, context.field.property.datasheetId)!;
    if (hostField.type === FieldType.LookUp && fieldId === ROLLUP_KEY_WORDS) {
      const flatCellValue = Field.bindContext(hostField, state).getFlatCellValue(context.record.id, true);
      return Field.bindContext(hostField, state).cellValueToArray(flatCellValue);
    }

    const fieldPermissionMap = getFieldPermissionMap(state, datasheet.id);
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);

    const field = fieldMap[fieldId];
    if (!field && !fieldRole) {
      throw new Error(
        t(Strings.view_field_search_not_found_tip, {
          value: fieldId,
        }),
      );
    }

    const record = context.record;
    const recordSnapshot = { meta: { fieldMap: fieldMap }, recordMap: { [record.id]: record } };
    const cellValue = getCellValue(state, recordSnapshot, record.id, fieldId, false, datasheet.id, true);

    // TODO what if field is undefined?
    // String type fields need special treatment. Convert Segment|id type to pure string;
    const fieldBasicValueType = Field.bindContext(field!, state).basicValueType;
    // Currently "", [], false will be converted to null when getCellValue,
    // in order to ensure the correct calculation result of the formula, the boolean type needs to be converted null => false
    if (fieldBasicValueType === BasicValueType.Boolean) {
      return Boolean(cellValue);
    }
    if (fieldBasicValueType === BasicValueType.String) {
      // TODO what if field is undefined?
      return Field.bindContext(field!, state).cellValueToString(cellValue as any);
    }
    if (fieldBasicValueType === BasicValueType.Array) {
      // TODO what if field is undefined?
      return (Field.bindContext(field!, state) as ArrayValueField).cellValueToArray(cellValue as any);
    }
    return cellValue;
  };
}

// The buffer for the calculation result of the formula field. The input value is unchanged and does not need to be recalculated
export class ExpCache {
  static cache = new Map<string, IFormulaExpr | IFormulaError>();

  static set(datasheetId: string, fieldId: string, exp: string, ast: IFormulaExpr | IFormulaError) {
    return this.cache.set(datasheetId + fieldId + exp, ast);
  }

  static get(datasheetId: string, fieldId: string, exp: string) {
    return this.cache.get(datasheetId + fieldId + exp);
  }

  static has(datasheetId: string, fieldId: string, exp: string) {
    return this.cache.has(datasheetId + fieldId + exp);
  }

  static del(datasheetId: string, fieldId: string, exp: string) {
    return this.cache.delete(datasheetId + fieldId + exp);
  }

  static clearAll() {
    return this.cache.clear();
  }
}

export function parse(
  expression: string,
  context: { field: IField; fieldMap: IFieldMap; state: IReduxState },
  updateCache?: boolean,
): IFormulaExpr | IFormulaError {
  if (!expression || !expression.trim()) {
    return {
      error: new Error(t(Strings.function_content_empty)),
    };
  }

  const field = context.field;
  const datasheetId = (field && field.property && (field.property as any).datasheetId) || '';

  if (!updateCache && ExpCache.has(datasheetId, field.id, expression)) {
    return ExpCache.get(datasheetId, field.id, expression)!;
  }

  const lexer = new FormulaExprLexer(expression);
  if (lexer.errors.length) {
    ExpCache.set(datasheetId, field.id, expression, { error: lexer.errors[0]! });
  } else {
    try {
      const ast = new FormulaExprParser(lexer, context).parse();
      ExpCache.set(datasheetId, field.id, expression, { lexer, ast });
    } catch (e) {
      ExpCache.set(datasheetId, field.id, expression, { error: e as Error });
    }
  }

  return ExpCache.get(datasheetId, field.id, expression)!;
}

/**
 * Pass in the expression and context, enter row evaluation
 * rootNode is the root of the abstract syntax tree
 * The interpreter is used to access the abstract syntax tree
 * @export
 * @param {string} expression
 * @param {*} context
 * @param {Resolver} [resolver]
 * @returns {any}
 */
export function evaluate(expression: string, context: IFormulaEvaluateContext, shouldThrow?: boolean, forceThrow?: boolean): any {
  if (!expression) {
    return null;
  }
  const state = context.state;
  const fieldMap = getFieldMap(state, context.field.property.datasheetId)!;
  const fExpr = parse(expression, { field: context.field, fieldMap, state });
  if ('error' in fExpr) {
    if (forceThrow) {
      throw fExpr.error;
    }
    return null;
  }

  // console.log(util.inspect(fExpr, { showHidden: false, depth: null }));

  try {
    const resolverFn = resolverWrapper(context);
    const interpreter = new Interpreter(resolverFn, context);
    const result = interpreter.visit(fExpr.ast);

    // Error for NaN/Infinite/-Infinite values
    if (isNumber(result) && !isFinite(result)) {
      throw new FormulaBaseError('NaN');
    }
    return result;
  } catch (e) {
    if (shouldThrow) {
      throw e;
    }
    return e;
  }
}

// Convert an expression with fieldName as variable name to an expression with fieldId as variable name
export function expressionTransform(
  expression: string,
  { fieldMap, fieldPermissionMap }: { fieldMap: IFieldMap; fieldPermissionMap?: IFieldPermissionMap },
  to: 'id' | 'name',
): string {
  if (!expression) {
    return expression;
  }

  const lexer = new FormulaExprLexer(expression);
  if (!lexer) {
    return '';
  }

  // Convert fieldMap and use name as key
  let revertFieldMap = fieldMap;
  if (to === 'id') {
    revertFieldMap = {};
    for (const key in fieldMap) {
      const field = fieldMap[key]!;
      revertFieldMap[field.name] = field;
    }
  }

  return lexer.fullMatches.reduce<string>((str, token) => {
    let tokenValue = token.value;

    function getPureTokenValue() {
      const pureTokenValue = token.value.replace(/\\(.)/g, '$1');
      const field = revertFieldMap[pureTokenValue];
      // Convert the variable name according to the to parameter
      if (!field) {
        return tokenValue;
      }
      if (to === 'id') {
        return field.id;
      }

      const name = field.name.replace(/[{}\\]/g, '\\$&');
      // When name contains illegal parameters, {} wrapping is required
      if (/[/+\-|=*/><()（）!&%'"“”‘’^`~,，\s]/.test(name)) {
        return `{${name}}`;
      }
      console.log(
        t(Strings.not_found_field_the_name_as, {
          value: pureTokenValue,
        }),
      );
      return name;
    }

    function getTokenValue() {
      const pureTokenValue = tokenValue.slice(1, -1).replace(/\\(.)/g, '$1');
      const field = revertFieldMap[pureTokenValue];
      const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, pureTokenValue);

      if (fieldRole === ConfigConstant.Role.None) {
        return `{${t(Strings.crypto_field)}}`;
      }

      // Convert the variable name according to the 'to' parameter
      if (field) {
        return to === 'id' ? `{${field.id}}` : `{${field.name.replace(/[{}\\]/g, '\\$&')}}`;
      }

      console.log(
        t(Strings.not_found_field_the_name_as, {
          value: pureTokenValue,
        }),
      );
      return tokenValue;
    }

    if (token.type === TokenType.PureValue) {
      tokenValue = getPureTokenValue();
    }

    if (token.type === TokenType.Value) {
      tokenValue = getTokenValue();
    }

    return str + tokenValue;
  }, '');
}
