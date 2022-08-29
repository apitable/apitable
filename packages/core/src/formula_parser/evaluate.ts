import { FormulaExprLexer } from './lexer/lexer';
import { AstNode } from './parser/ast';
import { FormulaExprParser } from './parser/parser';
import { Interpreter, ResolverFunction } from './interpreter/interpreter';
import { IFieldMap, IFieldPermissionMap, IReduxState, Selectors } from 'store';
import { TokenType } from './lexer';
import { getCellValue, getDatasheet, getFieldMap } from 'store/selector';
import { Field, LookUpField, ArrayValueField } from 'model';
import { IFormulaContext, IFormulaEvaluateContext, FormulaBaseError } from './functions/basic';
import { BasicValueType, FieldType, IField } from 'types';
import { t, Strings } from 'i18n';
import { isFinite, isNumber } from 'lodash';
import { ConfigConstant } from 'config';

export interface IFormulaExpr {
  lexer: FormulaExprLexer;
  ast: AstNode;
}

export interface IFormulaError {
  error: Error;
}

// 保留的关键字: values 用于对 lookup 字段进行 rollup 计算
export const ROLLUP_KEY_WORDS = 'values';

function resolverWrapper(context: IFormulaContext): ResolverFunction {
  /**
   * Resolver 的作用是，给定一个 fieldId，根据字符串从 context 中获取值
   * params
   * @value 字段 ID
   * @originValue: 是否返回原始单元格的值
   */
  return (fieldId: string) => {
    /**
     * 当公式在 lookUp 字段中运行的时候，对保留关键字进行检查。
     * 当关键字命中的时候，返回 LookUpField 的 cellValueArray 而不是 cellValue
     */
    const hostField = context.field;
    const state = context.state;
    // TODO: 列权限第一期，因为中间层不主动推送数据，getFieldMap 又主动对数据做了屏蔽，所以这里暂时直接使用 datasheet 获取 fieldmap
    const datasheet = getDatasheet(state, context.field.property.datasheetId)!;
    const fieldMap = datasheet.snapshot.meta.fieldMap;
    // const fieldMap = getFieldMap(state, context.field.property.datasheetId)!;
    if (hostField.type === FieldType.LookUp && fieldId === ROLLUP_KEY_WORDS) {
      const flatCellValue = LookUpField.bindContext(hostField, state).getFlatCellValue(context.record.id, true);
      return LookUpField.bindContext(hostField, state).cellValueToArray(flatCellValue);
    }

    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);

    const field = fieldMap[fieldId];
    if (!field && !fieldRole) {
      throw new Error(t(Strings.not_found_vika_field_the_name_as, {
        value: fieldId,
      }));
    }

    const record = context.record;
    const recordSnapshot = { meta: { fieldMap: fieldMap }, recordMap: { [record.id]: record }};
    const cellValue = getCellValue(state, recordSnapshot, record.id, fieldId, false, datasheet.id, true);

    // string 类型字段要做一下特殊处理。将 Segment|id 类型转为纯 string；
    const fieldBasicValueType = Field.bindContext(field, state).basicValueType;
    // 当前 ""、[]、false 在 getCellValue 时都会被转成 null，为保证公式计算结果正确，需对布尔类型进行转换 null => false
    if (fieldBasicValueType === BasicValueType.Boolean) {
      return Boolean(cellValue);
    }
    if (fieldBasicValueType === BasicValueType.String) {
      return Field.bindContext(field, state).cellValueToString(cellValue as any);
    }
    if (fieldBasicValueType === BasicValueType.Array) {
      return (Field.bindContext(field, state) as ArrayValueField).cellValueToArray(cellValue as any);
    }
    return cellValue;
  };

}

// 公式字段计算结果的缓存器。输入值不变，不需要重新计算
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
  expression: string, context: { field: IField, fieldMap: IFieldMap, state: IReduxState }, updateCache?: boolean,
): IFormulaExpr | IFormulaError {
  if (!expression || !expression.trim()) {
    return {
      error: new Error(t(Strings.function_content_empty)),
    };
  }

  const field = context.field;
  const datasheetId = (field && (field.property && (field.property as any).datasheetId)) || '';

  if (!updateCache && ExpCache.has(datasheetId, field.id, expression)) {
    return ExpCache.get(datasheetId, field.id, expression)!;
  }

  const lexer = new FormulaExprLexer(expression);
  if (lexer.errors.length) {
    ExpCache.set(datasheetId, field.id, expression, { error: lexer.errors[0] });
  } else {
    try {
      const ast = new FormulaExprParser(lexer, context).parse();
      ExpCache.set(datasheetId, field.id, expression, { lexer, ast });
    } catch (e) {
      ExpCache.set(datasheetId, field.id, expression, { error: e });
    }
  }

  return ExpCache.get(datasheetId, field.id, expression)!;
}

/**
 * 传入表达式和 context，进行求值
 * rootNode 为抽象语法树的根
 * interpreter 作用为访问该抽象语法树
 * @export
 * @param {string} expression
 * @param {*} context
 * @param {Resolver} [resolver]
 * @returns {any}
 */
export function evaluate(
  expression: string,
  context: IFormulaEvaluateContext,
  shouldThrow?: boolean,
  forceThrow?: boolean,
): any {
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

    // 针对 NaN/Infinite/-Infinite 值进行报错
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

// 将以 fieldName 作为变量名的表达式转换为以 fieldId 作为变量名的表达式
export function expressionTransform(
  expression: string, { fieldMap, fieldPermissionMap }: { fieldMap: IFieldMap, fieldPermissionMap?: IFieldPermissionMap }, to: 'id' | 'name',
): string {
  if (!expression) {
    return expression;
  }

  const lexer = new FormulaExprLexer(expression);
  if (!lexer) {
    return '';
  }

  // 将 fieldMap 转换一下，以 name 作为 key
  let revertFieldMap = fieldMap;
  if (to === 'id') {
    revertFieldMap = {};
    for (const key in fieldMap) {
      const field = fieldMap[key];
      revertFieldMap[field.name] = field;
    }
  }

  return lexer.fullMatches.reduce<string>((str, token) => {
    let tokenValue = token.value;

    function getPureTokenValue() {
      const pureTokenValue = token.value.replace(/\\(.)/g, '$1');
      const field = revertFieldMap[pureTokenValue];
      // 根据 to 参数进行变量名转换
      if (!field) {
        return tokenValue;
      }
      if (to === 'id') {
        return field.id;
      }

      const name = field.name.replace(/(\{|\})/g, '\\$1');
      // 当 name 包含非法参数的时候，要进行{}包装
      if (/[/+\-|=*/><()（）!&%'"“”‘’^`~,，\s]/.test(name)) {
        return `{${name}}`;
      }
      console.log(t(Strings.not_found_field_the_name_as, {
        value: pureTokenValue,
      }));
      return name;
    }

    function getTokenValue() {
      const pureTokenValue = tokenValue.slice(1, -1).replace(/\\(.)/g, '$1');
      const field = revertFieldMap[pureTokenValue];
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, pureTokenValue);

      if (fieldRole === ConfigConstant.Role.None) {
        return `{${t(Strings.crypto_field)}}`;
      }

      // 根据 to 参数进行变量名转换
      if (field) {
        return to === 'id' ? `{${field.id}}` : `{${field.name.replace(/(\{|\})/g, '\\$1')}}`;
      }

      console.log(t(Strings.not_found_field_the_name_as, {
        value: pureTokenValue,
      }));
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
