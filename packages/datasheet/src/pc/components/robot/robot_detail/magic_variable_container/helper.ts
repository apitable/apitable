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

import produce from 'immer';
import { isSafari } from 'react-device-detect';
import { BaseEditor, Selection, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  ACTION_INPUT_PARSER_BASE_FUNCTIONS,
  EmptyNullOperand,
  FieldType,
  IExpression,
  IExpressionOperand,
  IField,
  IFieldPermissionMap,
  InputParser,
  IOperand,
  MagicVariableParser,
  OperandTypeEnums,
  OperatorEnums,
  Strings,
  t,
} from '@apitable/core';
import { getFieldTypeIcon } from '../../../multi_grid/field_setting';
import { fields2Schema } from '../../helper';
import { IJsonSchema, INodeOutputSchema, IUISchemaLayoutGroup } from '../../interface';

const parser = new MagicVariableParser<any>(ACTION_INPUT_PARSER_BASE_FUNCTIONS);
const inputParser = new InputParser(parser);

const functionNameMap = {
  length: t(Strings.robot_variables_array_length),
  JSONStringify: t(Strings.robot_variables_stringify_json),
  flatten: t(Strings.robot_variables_array_flatten),
};

export interface ISchemaPropertyListItem {
  key: string;
  label?: string;
  icon?: string | Element | undefined;

  schema?: IJsonSchema;
  uiSchema?: any;
  expression: IExpression;
  description?: string;
  // The ability to continue the selection is irrelevant to the possibility of direct insertion. The two can coexist.
  hasChildren: boolean;
  canInsert: boolean;
  disabled?: boolean;
  // Are properties and methods on the prototype chain of data structures,
  // such as strings, length of arrays, trim of strings, etc. Currently only length exists for arrays.
  isPrototype?: boolean;
}

export type ISchemaPropertyListItemClickFunc = (listItem: ISchemaPropertyListItem, goIntoChildren?: boolean) => void;

const getPropertyItem = (props: { expression: IExpression; propertySchema: any; key: string; isJSONField: boolean }) => {
  const { expression, propertySchema, key, isJSONField } = props;
  // The base type can be inserted directly
  let canInsert = ['string', 'number', 'boolean'].includes(propertySchema.type!.toString());
  const _hasChild = isJSONField && propertySchema.type === 'string';
  // The composite type needs to be selected in the next step
  const hasChildren = _hasChild || ['array', 'object'].includes(propertySchema.type!.toString());
  if (propertySchema.type === 'array') {
    canInsert = ['string', 'number', 'boolean'].includes((propertySchema.items! as IJsonSchema).type as string);
  }
  const _expression: IExpression = {
    operator: OperatorEnums.GetObjectProperty,
    operands: [
      {
        type: OperandTypeEnums.Expression,
        value: expression as IExpression,
      },
      {
        type: OperandTypeEnums.Literal,
        value: [key],
      },
    ],
  };
  return {
    key: key,
    label: propertySchema.title,
    schema: propertySchema,
    disabled: propertySchema['disabled'],
    expression: _expression,
    hasChildren,
    canInsert,
  };
};

const getObjectSchemaPropertyList = (props: { expression: any; schema: IJsonSchema; isJSONField: boolean }) => {
  const { schema, expression, isJSONField } = props;
  if (!schema.properties) return [];
  const propertiesKeys = Object.keys(schema.properties);
  return propertiesKeys.map((key) => {
    const propertySchema = schema.properties![key];
    return getPropertyItem({
      expression,
      propertySchema,
      key,
      isJSONField,
    });
  });
};

const getArraySchemaPropertyList = (props: { expression: any; schema: IJsonSchema; shouldFlatten?: boolean; isJSONField: boolean }) => {
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
          value: expression as IExpression,
        },
      ],
    } as IExpression,
    hasChildren: false,
    canInsert: true,
    isPrototype: true,
  };
  const res: any[] = [];

  if (shouldFlatten) {
    expression = {
      operator: OperatorEnums.Flatten,
      operands: [
        {
          type: OperandTypeEnums.Expression,
          value: expression as IExpression,
        },
      ],
    };
  }
  const hasChildren = ['array', 'object'].includes(itemSchema.type!.toString());
  if (hasChildren) {
    if (itemSchema.type === 'object') {
      // TODO: Here it can be optimized that property fetching for array objects can be expressed in a separate expression.
      res.push(
        ...getObjectSchemaPropertyList({
          expression,
          schema: itemSchema,
          isJSONField,
        }),
      );
    }
    if (itemSchema.type === 'array') {
      // Arrays over arrays first flatten
      res.push(
        ...getArraySchemaPropertyList({
          expression,
          schema: itemSchema,
          shouldFlatten: true,
          isJSONField,
        }),
      );
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
    // There is no schema but there is expression, which represents a prototype operation on the base type.
    if (isJSONField && expression) {
      return [
        {
          key: key!,
          label: functionNameMap[expression.operator],
          schema: schema,
          disabled: false,
          expression: expression,
          hasChildren: false,
          canInsert: true,
        },
      ];
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
            value: expression as IExpression,
          },
          {
            type: OperandTypeEnums.Literal,
            value: [key],
          },
        ],
      };
      // Base type direct insertion
      return [
        {
          key: key!,
          label: schema.title,
          icon: getFieldTypeIcon(schema.type! as unknown as FieldType),
          schema: schema,
          disabled: schema['disabled'],
          expression: _expression,
          hasChildren: false,
          canInsert: true,
        },
      ];
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
 * schemaExpressionList maintains a stack of the currently viewed schema,
 * producing a list of expressions corresponding to dynamic parameters based on the schema property
 * - Calculated dynamically based on schemaExpressionList, always taking the last one.
 * - When the length is 1, the list of predecessor nodes is output.
 * - The subsequent list is generated dynamically based on the data type of the selected node.
 * - - The parent node needs to know the data type of the child nodes in order to generate the list of child nodes.
 * - - Child nodes need to know the expression of the parent node in order to generate their own expressions.
 */
export const getCurrentVariableList = (props: {
  schemaExpressionList: ISchemaAndExpressionItem[];
  nodeOutputSchemaList: INodeOutputSchema[];
  isJSONField: boolean;
}): ISchemaPropertyListItem[] => {
  const { schemaExpressionList, nodeOutputSchemaList, isJSONField = false } = props;

  if (schemaExpressionList.length === 0) {
    // The selection list of the first layer is the output of all the predecessor nodes.
    return nodeOutputSchemaList.map(({ id, title, schema, description, icon, uiSchema }) => {
      const expression: IExpression = {
        operator: OperatorEnums.GetNodeOutput,
        operands: [
          {
            type: OperandTypeEnums.Literal,
            value: id,
          },
        ],
      };
      return {
        key: id,
        label: title,
        icon: icon,
        schema,
        description,
        uiSchema,
        expression,
        canInsert: false,
        disabled: !schema,
        hasChildren: Boolean(schema?.properties && Object.keys(schema?.properties).length > 0),
      };
    });
  }
  // The subsequent list, calculated from the last schema of the schemaExpressionList
  const { schema, expression, uiSchema } = schemaExpressionList[schemaExpressionList.length - 1];
  return getSchemaPropertyList({
    schema,
    uiSchema,
    expression,
    isJSONField,
  });
};

export const getGroupedVariableList = (props: { variableList: ISchemaPropertyListItem[]; schemaExpressionList: ISchemaAndExpressionItem[] }) => {
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
  // When layout exists, it needs to be reordered. And it cannot affect the up/down/left/right shortcut keys.
  // Because useSelectIndex depends on the list order, the grouped order must be handled outside
  // When layout exists, the list is reordered
  return layout
    .map((eachGroup) => eachGroup.items)
    .flat()
    .reduce((resList, item) => {
      const listItem = listItemMap[item];
      if (listItem) {
        resList.push({
          ...listItem,
          icon: listItem.icon ?? listItem?.schema?.icon,
        });
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
 Convert an expression into a list of nodes for a chain call tree -> list
 monadic operators into chain call format:
 - length(JSONStringify(getNodeOutput("nodeId"))) => "nodeId".JSONStringify().length()
 Multi-eye operator:
 - getObjectProperty(getNodeOutput("nodeId"),['property1','property2']) => "nodeId".'property1'.'property2'
 - getArrayItemProperty([{a:1},{a:2}],['a']) => [{a:1},{a:2}].'a'
 */
export const getExpressionChainList = (expression: IExpression): IExpressionChainNode[] => {
  const exprChainList: IExpressionChainNode[] = [];

  switch (expression.operator as string) {
    // Binocular operators
    case 'getObjectProperty':
      const chainList = expression.operands[1].value.map((item: any) => ({
        type: 'property',
        name: item, // Get the display name based on the attribute name + schema
        value: item,
      }));
      exprChainList.push(...chainList, ...getExpressionChainList(expression.operands[0].value as IExpression));
      break;
    // monadic operators
    case 'getNodeOutput': // This is the starting point, special treatment.
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
      exprChainList.push(
        {
          type: 'function',
          name: functionNameMap[expression.operator],
          value: expression.operator,
        },
        ...getExpressionChainList(expression.operands[0].value as IExpression),
      );
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

// TODO: Make sure the paragraph will not be nested in multiple levels, add test cases
const expression2SlateValue = (operand: IOperand) => {
  const resWrapper: any = [];
  operand.value.operands.forEach((operand: IOperand) => {
    const res: any = {
      type: 'paragraph',
      children: [],
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
      children: [{ text: initTextValue }],
    },
  ];
};

export const hasMagicVariable = (values: any) => {
  // If or not magicVariable exists, the output value is an expression if it exists, or a string if it doesn't.
  const isValueIncludesMagicVariable = (value: any) => {
    if (value?.type === 'magicVariable') return true;
    if (value?.type === 'paragraph') {
      return value.children.some((child: any) => {
        return isValueIncludesMagicVariable(child);
      });
    }
  };
  return values.some((value: any) => {
    return isValueIncludesMagicVariable(value);
  });
};

export const transformParagraphToExpression = (paragraph: any) => {
  const res: any = {
    type: OperandTypeEnums.Expression,
    value: {
      operator: 'concatString' as OperatorEnums,
      operands: [],
    },
  };
  paragraph.children.forEach((child: any) => {
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

export const transformSlateValue = (
  paragraphs: any,
): {
  isMagicVariable: boolean;
  value: any;
} => {
  // concatString -> [concatString,concatString,concatString:[Literal,Expression]]
  const isMagicVariable = hasMagicVariable(paragraphs);
  const res: IExpressionOperand = {
    type: OperandTypeEnums.Expression,
    value: {
      operator: 'concatParagraph' as OperatorEnums,
      operands: [],
    },
  };
  paragraphs.forEach((paragraph: any) => {
    res.value.operands.push(transformParagraphToExpression(paragraph));
  });
  // If it does not contain dynamic parameters, check if the value is null.
  if (!isMagicVariable) {
    const parserString = inputParser.render(res, {});
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

export const withMagicVariable = (editor: any) => {
  const { isInline, isVoid, onChange } = editor;

  editor.isInline = (element: { type: string }) => {
    return element.type === 'magicVariable' ? true : isInline(element);
  };

  editor.isVoid = (element: { type: string }) => {
    return element.type === 'magicVariable' ? true : isVoid(element);
  };

  editor.onChange = (...params: any) => {
    // Record the last selection value to ensure that the new node is inserted in the correct position after the editor loses focus,
    // for example, by adding a new link element
    if (editor.selection) {
      // ref.current = editor.selection as unknown as Selection;
      editor.lastSelection = editor.selection as unknown as Selection;
    }
    onChange(...params);
  };

  return editor;
};

export const insertMagicVariable = (data: any, editor: BaseEditor, callback: () => void) => {
  setTimeout(() => {
    const mv = {
      type: 'magicVariable',
      data,
      children: [{ text: '' }],
    };
    const { lastSelection } = editor as any;
    if (lastSelection) {
      try {
        ReactEditor.focus(editor as any);
      } catch (e) {
        console.error('ReactEditor.focus', e);
      }
      Transforms.select(editor, lastSelection);
      if (!isSafari) {
        // Delete / , insert magic variable
        try {
          Transforms.delete(editor, { distance: 1, unit: 'character', reverse: true });
        } catch (e) {
          console.error('Transforms.delete', e);
        }
      }
      try {
        Transforms.insertNodes(editor, [mv]);
      } catch (e) {
        console.error('Transforms.insertNodes', e);
      }

      try {
        // slate transform moves the cursor to the newly inserted position
        Transforms.move(editor, {
          distance: 1,
          unit: 'offset',
        });
      } catch (e) {
        console.error('Transforms.move', e);
      }
    }
    callback();
  }, 0);
};

export const enrichDatasheetTriggerOutputSchema = (
  nodeOutputSchema: INodeOutputSchema,
  fields: IField[],
  fieldPermissionMap: IFieldPermissionMap,
) => {
  return produce(nodeOutputSchema, (nodeOutputSchema) => {
    const enrichedFieldsSchema = fields2Schema(fields, fieldPermissionMap);
    // trigger must have outputJsonSchema
    nodeOutputSchema.schema!.properties = {
      ...nodeOutputSchema.schema!.properties, // The original self-contained schema properties
      ...enrichedFieldsSchema.properties, // Dynamically expand field-related schema properties
    };
    nodeOutputSchema.uiSchema = {
      layout: [
        {
          title: t(Strings.field),
          items: Object.keys(enrichedFieldsSchema.properties!),
        },
        {
          title: t(Strings.robot_variables_select_basics),
          items: ['recordId', 'recordUrl', 'datasheetId', 'datasheetName'],
        },
      ],
    };
    return nodeOutputSchema;
  });
};
