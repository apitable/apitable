import {
  IExpression, IExpressionOperand, IField, InputParser, IOperand,
  MagicVariableParser, OperandTypeEnums, OperatorEnums,
  ACTION_INPUT_PARSER_BASE_FUNCTIONS, EmptyNullOperand, IFieldPermissionMap, Strings, t
} from '@apitable/core';
import produce from 'immer';
import { Transforms, Selection } from 'slate';
import { ReactEditor } from 'slate-react';
import { fields2Schema } from '../../helper';
import { IJsonSchema, INodeOutputSchema, IUISchemaLayoutGroup } from '../../interface';

const parser = new MagicVariableParser<any>(ACTION_INPUT_PARSER_BASE_FUNCTIONS);
const inputParser = new InputParser(parser);

const functionNameMap = {
  length: t(Strings.robot_variables_array_length),
  // uppercase: '大写',
  // lowercase: '小写',
  // capitalize: '首字母大写',
  // trim: '去首尾空格',
  JSONStringify: t(Strings.robot_variables_stringify_json),
  flatten: t(Strings.robot_variables_array_flatten),
};

export interface ISchemaPropertyListItem {
  key: string;
  label?: string;
  schema?: IJsonSchema;
  uiSchema?: any;
  expression: IExpression;
  // 能不能继续选择，和是否可以直接插入是不相关的。二者可以共存。
  hasChildren: boolean;
  canInsert: boolean;
  disabled?: boolean; // 是否禁用
  isPrototype?: boolean; // 是否是数据结构原型链上的属性和方法，例如字符串、数组的长度、字符串的 trim 等。目前只有数组存在长度。
}

export type ISchemaPropertyListItemClickFunc = (listItem: ISchemaPropertyListItem, goIntoChildren?: boolean) => void;

const getPropertyItem = (props: {
  expression: IExpression,
  propertySchema,
  key: string,
  isJSONField: boolean
}) => {
  const { expression, propertySchema, key, isJSONField } = props;
  // 基础类型可以直接插入
  let canInsert = ['string', 'number', 'boolean'].includes(propertySchema.type!.toString());
  // JSON string 类型
  const _hasChild = isJSONField && propertySchema.type === 'string';
  // 复合类型需要选下一步
  const hasChildren = _hasChild || ['array', 'object'].includes(propertySchema.type!.toString());
  if (propertySchema.type === 'array') {
    // array 子元素是 string number boolean 也可以直接结束。
    canInsert = ['string', 'number', 'boolean'].includes((propertySchema.items! as IJsonSchema).type as string);
  }
  const _expression: IExpression = {
    operator: OperatorEnums.GetObjectProperty,
    operands: [
      {
        type: OperandTypeEnums.Expression,
        value: expression as IExpression
      },
      {
        type: OperandTypeEnums.Literal,
        value: [key]
      }
    ],
  };
  return {
    key: key,
    label: propertySchema.title,
    schema: propertySchema,
    disabled: propertySchema['disabled'],
    expression: _expression,
    hasChildren,
    canInsert
  };
};

const getObjectSchemaPropertyList = (props: {
  expression: any, schema: IJsonSchema, isJSONField: boolean
}) => {
  const { schema, expression, isJSONField } = props;
  if (!schema.properties) return [];
  const propertiesKeys = Object.keys(schema.properties);
  return propertiesKeys.map((key) => {
    const propertySchema = schema.properties![key];
    return getPropertyItem({
      expression, propertySchema, key, isJSONField
    });
  });
};

const getArraySchemaPropertyList = (props: {
  expression: any,
  schema: IJsonSchema,
  shouldFlatten?: boolean
  isJSONField: boolean
}) => {
  const { schema, shouldFlatten, isJSONField } = props;
  let expression = props.expression;
  const itemSchema = schema.items as IJsonSchema;
  const metaProperty = {
    key: 'length',
    label: t(Strings.robot_variables_array_length),
    schema: itemSchema,
    expression: {
      operator: OperatorEnums.Length,
      operands: [
        {
          type: OperandTypeEnums.Expression,
          value: expression as IExpression
        }
      ],
    } as IExpression,
    hasChildren: false,
    canInsert: true,
    isPrototype: true
  };
  const res: any[] = [];

  if (shouldFlatten) {
    expression = {
      operator: OperatorEnums.Flatten,
      operands: [
        {
          type: OperandTypeEnums.Expression,
          value: expression as IExpression
        },
      ],
    };
  }
  const hasChildren = ['array', 'object'].includes(itemSchema.type!.toString());
  if (hasChildren) {
    if (itemSchema.type === 'object') {
      // TODO: 这里可以优化，数组对象的属性获取可以用单独的表达式表达。
      res.push(...getObjectSchemaPropertyList({
        expression, schema: itemSchema, isJSONField
      }));
    }
    if (itemSchema.type === 'array') {
      // 数组套数组先 flatten
      res.push(...getArraySchemaPropertyList({
        expression, schema: itemSchema, shouldFlatten: true, isJSONField
      }));
    }
  }
  if (!shouldFlatten) {
    res.push(metaProperty);
  }
  return res;
};

const getSchemaPropertyList = (props: {
  schema?: IJsonSchema;
  uiSchema?: any;
  expression?: IExpression;
  isJSONField?: boolean;
  key?: string;
}): ISchemaPropertyListItem[] => {
  const { schema, expression, key, isJSONField = false } = props;
  if (!schema) {
    // 没有 schema 但是有 expression，表示对基础类型的原型操作。
    if (isJSONField && expression) {
      return [{
        key: key!,
        label: functionNameMap[expression.operator],
        schema: schema,
        disabled: false,
        expression: expression,
        hasChildren: false,
        canInsert: true,
      }];
    }
    return [];
  }
  switch (schema.type) {
    // const stringMethods = ['length', 'uppercase', 'lowercase', 'capitalize', 'trim'];
    case 'string':
    case 'number':
    case 'boolean':
      const _expression: IExpression = {
        operator: OperatorEnums.GetObjectProperty,
        operands: [
          {
            type: OperandTypeEnums.Expression,
            value: expression as IExpression
          },
          {
            type: OperandTypeEnums.Literal,
            value: [key]
          }
        ],
      };
      // 基础类型直接插入
      return [{
        key: key!,
        label: schema.title,
        schema: schema,
        disabled: schema['disabled'],
        expression: _expression,
        hasChildren: false,
        canInsert: true,
      }];
    case 'array':
      return getArraySchemaPropertyList({ expression, schema, isJSONField });
    // return [...arrayMeta, ...getSchemaPropertyList({ schema: itemSchema, expression })];
    case 'object':
      return getObjectSchemaPropertyList({ expression, schema, isJSONField });
    default:
      return [];
  }
};

export interface ISchemaAndExpressionItem {
  uiSchema?: any;
  schema?: IJsonSchema;
  expression: IExpression;
}

/**
 * schemaExpressionList 维护当前查看 schema 的堆栈，根据 schema property 生产对应动态参数的表达式列表
 * - 根据 schemaExpressionList 动态计算，始终取最后一个计算。
 * - 长度为 1 时，输出前置节点的列表。
 * - 后续的列表，根据选中节点的数据类型来动态生成。
 * - - 父节点需要知道子节点的数据类型，才能生成子节点的列表。
 * - - 子节点需要知道父节点的表达式，才能生成自己的表达式。
 */
export const getCurrentVariableList = (props: {
  schemaExpressionList: ISchemaAndExpressionItem[];
  nodeOutputSchemaList: INodeOutputSchema[];
  isJSONField: boolean;
}): ISchemaPropertyListItem[] => {
  const { schemaExpressionList, nodeOutputSchemaList, isJSONField = false } = props;
  // node => children => children
  if (schemaExpressionList.length === 0) {
    // 第一层的选择列表是所有的前置节点输出。
    return nodeOutputSchemaList.map(({ id, title, schema, uiSchema }) => {
      const expression: IExpression = {
        operator: OperatorEnums.GetNodeOutput,
        operands: [
          {
            type: OperandTypeEnums.Literal,
            value: id,
          }
        ]
      };
      return {
        key: id,
        label: title,
        schema,
        uiSchema,
        expression,
        canInsert: false,
        disabled: !schema,
        hasChildren: Boolean(schema?.properties && Object.keys(schema?.properties).length > 0),
      };
    });
  }
  // 后续的列表，通过 schemaExpressionList 最后一项 schema 计算出来
  const { schema, expression, uiSchema } = schemaExpressionList[schemaExpressionList.length - 1];
  return getSchemaPropertyList({
    schema,
    uiSchema,
    expression,
    isJSONField
  });
};

export const getGroupedVariableList = (props: {
  variableList: ISchemaPropertyListItem[];
  schemaExpressionList: ISchemaAndExpressionItem[];
}) => {
  const { schemaExpressionList, variableList } = props;
  const listItemMap: { [key: string]: ISchemaPropertyListItem } = variableList.reduce((map, item) => {
    map[item.key] = item;
    return map;
  }, {});
  const listUISchema = schemaExpressionList.length > 0 ? schemaExpressionList[schemaExpressionList.length - 1].uiSchema : undefined;

  if (!listUISchema) {
    return variableList;
  }
  const layout: IUISchemaLayoutGroup[] = listUISchema?.layout;
  // 存在布局时，需要重新排序。且不能影响上下左右快捷键。

  // 因为 useSelectIndex 依赖 list 顺序，必须要在外面处理分组后的顺序
  // 存在 layout 时候，列表会重新排序
  return layout.map(eachGroup => eachGroup.items).flat().reduce((resList, item) => {
    const listItem = listItemMap[item];
    if (listItem) {
      resList.push(listItem);
    }
    return resList;
  }, [] as any[]);
};

export type IExpressionChainNode = {
  type: 'property' | 'function';
  name: string;
  value: string;
};

/*
  将表达式转化为链式调用的节点列表 tree -> list
  单目运算符转化为链式调用格式，length(JSONStringify(getNodeOutput("nodeId"))) => "nodeId".JSONStringify().length()
  多目运算符
   - getObjectProperty(getNodeOutput("nodeId"),['property1','property2']) => "nodeId".'property1'.'property2'
   - getArrayItemProperty([{a:1},{a:2}],['a']) => [{a:1},{a:2}].'a'
 */
export const getExpressionChainList = (expression: IExpression): IExpressionChainNode[] => {
  const exprChainList: IExpressionChainNode[] = [];

  switch (expression.operator as string) {
    // 双目运算符
    case 'getObjectProperty':
      const chainList = expression.operands[1].value.map(item => ({
        type: 'property',
        name: item, // 根据属性名称 + schema 再获取展示名称
        value: item,
      }));
      exprChainList.push(...chainList, ...getExpressionChainList(expression.operands[0].value as IExpression));
      break;
    // 单目运算符
    case 'getNodeOutput': // 这个是起点，特殊处理。
      exprChainList.push({
        type: 'function',
        name: expression.operator,
        value: expression.operands[0].value,
      });
      break;
    case 'JSONStringify':
    case 'length':
    case 'uppercase':
    case 'lowercase':
    case 'capitalize':
    case 'trim':
    case 'flatten':
      exprChainList.push({
        type: 'function',
        name: functionNameMap[expression.operator],
        value: expression.operator,
      }, ...getExpressionChainList(expression.operands[0].value as IExpression));
      break;
  }
  return exprChainList;
};
const isExpression = (value: any) => {
  return typeof value === 'object' && value.type === 'Expression';
};
const isLiteral = (value: any) => {
  return typeof value === 'object' && value.type === 'Literal';
};

// TODO: 确定 paragraph 不会多级嵌套，添加测试用例
const expression2SlateValue = (operand: IOperand) => {
  const resWrapper: any = [];
  operand.value.operands.forEach((operand: IOperand) => {
    const res: any = {
      type: 'paragraph',
      children: []
    };
    operand.value.operands.forEach((operand: IOperand) => {
      switch (operand.type) {
        case OperandTypeEnums.Literal:
          res.children.push({
            // type: 'text',
            text: operand.value,
          });
          break;
        case OperandTypeEnums.Expression:
          res.children.push({
            type: 'magicVariable',
            data: operand.value,
            children: [{ text: '' }],
          });
          break;
      }
    });
    resWrapper.push(res);
  });
  return resWrapper;
};

export const formData2SlateValue = (value: any) => {
  if (isExpression(value)) {
    return expression2SlateValue(value);
  }
  const initTextValue = isLiteral(value) ? value.value || '' : '';
  return [
    {
      type: 'paragraph',
      children: [
        { text: initTextValue }
      ],
    },
  ];
};

export const hasMagicVariable = (values: any) => {
  // 是否存在 magicVariable，存在时输出值为 表达式，不存在时输出值为 字符串
  const isValueIncludesMagicVariable = (value) => {
    if (value?.type === 'magicVariable') return true;
    if (value?.type === 'paragraph') {
      return value.children.some((child) => {
        return isValueIncludesMagicVariable(child);
      });
    }
  };
  return values.some((value) => {
    return isValueIncludesMagicVariable(value);
  });
};

export const transformParagraphToExpression = (paragraph) => {
  const res: any = {
    type: OperandTypeEnums.Expression,
    value: {
      operator: 'concatString' as OperatorEnums,
      operands: []
    }
  };
  paragraph.children.forEach((child) => {
    if (child.type === 'magicVariable') {
      res.value.operands.push({
        type: OperandTypeEnums.Expression,
        value: child.data,
      });
    } else {
      res.value.operands.push({
        type: OperandTypeEnums.Literal,
        value: child.text,
      });
    }
  });
  return res;
};

export const transformSlateValue = (paragraphs: any): {
  isMagicVariable: boolean;
  value: any;
} => {
  // concatString -> [concatString,concatString,concatString:[Literal,Expression]]
  const isMagicVariable = hasMagicVariable(paragraphs);
  const res: IExpressionOperand = {
    type: OperandTypeEnums.Expression,
    value: {
      operator: 'concatParagraph' as OperatorEnums,
      operands: []
    }
  };
  paragraphs.forEach((paragraph) => {
    res.value.operands.push(transformParagraphToExpression(paragraph));
  });
  // 如果不包含动态参数，校验下是不是空值。
  if (!isMagicVariable) {
    const parserString = inputParser.render(res, {});
    // console.log(parserString, 'parserString');
    // 空字符串当作空处理
    if (parserString.length === 0) {
      return {
        isMagicVariable,
        value: JSON.parse(JSON.stringify(EmptyNullOperand)),
      };
    }
  }
  return {
    isMagicVariable,
    value: res,
  };
};

export const withMagicVariable = (editor) => {
  const { isInline, isVoid, onChange } = editor;

  editor.isInline = element => {
    return element.type === 'magicVariable' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'magicVariable' ? true : isVoid(element);
  };

  editor.onChange = (...params) => {
    // 记录最后一次selection值，确保编辑器失焦后能将新节点插入正确的位置，比如新加一个链接元素
    if (editor.selection) {
      // ref.current = editor.selection as unknown as Selection;
      editor.lastSelection = editor.selection as unknown as Selection;
    }
    onChange(...params);
  };

  // editor.normalizeNode = (node, editor) => {

  // }

  return editor;
};

export const insertMagicVariable = (data, editor) => {
  const mv = {
    type: 'magicVariable',
    data,
    children: [{ text: '' }],
  };
  const { lastSelection } = editor as any;
  if (lastSelection) {
    ReactEditor.focus(editor as any);
    Transforms.select(editor, lastSelection);
    // 删除 / ，插入神奇变量
    Transforms.delete(editor, { distance: 1, unit: 'character', reverse: true });
    // console.log(lastSelection, 'lastSelection');
    Transforms.insertNodes(editor, [mv]);
    // slate transform 将光标移动到新插入的位置
    Transforms.move(editor, {
      distance: 1,
      unit: 'offset',
    });
  }
};

export const enrichDatasheetTriggerOutputSchema = (
  nodeOutputSchema: INodeOutputSchema,
  fields: IField[],
  fieldPermissionMap: IFieldPermissionMap,
) => {
  return produce(nodeOutputSchema, nodeOutputSchema => {
    const enrichedFieldsSchema = fields2Schema(fields, fieldPermissionMap);
    // trigger 一定有 outputJsonSchema
    nodeOutputSchema.schema!.properties = {
      ...nodeOutputSchema.schema!.properties, // 原本自带的 schema properties
      ...enrichedFieldsSchema.properties // 动态扩充字段相关的 schema properties
    };
    nodeOutputSchema.uiSchema = {
      layout: [
        {
          title: t(Strings.robot_variables_select_columns),
          items: Object.keys(enrichedFieldsSchema.properties!)
        },
        {
          title: t(Strings.robot_variables_select_basics),
          items: [
            'recordId',
            'recordUrl',
            'datasheetId',
            'datasheetName'
          ]
        }
      ]
    };
    return nodeOutputSchema;
  });
};