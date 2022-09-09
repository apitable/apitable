export interface IRobotRunHistoryDetail {
  executedNodeIds: string[];
  nodeByIds: {
    [nodeId: string]: {
      typeId: string; // trigger / action 的 typeId
      input?: any;
      output?: any;
      // 开始时间戳
      startAt?: number;
      // 结束时间戳
      endAt?: number;
      errorStacks?: any[];
    }
  }
}
export interface IUISchemaLayoutGroup {
  title: string; // 分组标题
  items: string[];
}
// robot ui 用到的数据上下文
export interface IRobotContext {
  triggerTypes: ITriggerType[];
  actionTypes: IActionType[];
  currentRobotId?: string;
  isHistory?: boolean;
  robotList: IRobotBaseInfo[];
  isNewRobotModalOpen: boolean;
  isEditingRobotName: boolean;
  isEditingRobotDesc: boolean;
}

interface INodeBaseType {
  name: string;
  description: string;
  endpoint: string;
  inputJsonSchema: INodeSchema;
  outputJsonSchema?: INodeSchema;
  service: {
    slug: string;
    name: string;
    logo: string;
  }
}

export interface ITriggerType extends INodeBaseType {
  triggerTypeId: string;
}

export interface IActionType extends INodeBaseType {
  actionTypeId: string;
}

export type INodeType = ITriggerType | IActionType;

export interface IRobotAction {
  id: string;
  prevActionId: string;
  typeId: string;
  input: any;
}
export interface IRobotTrigger {
  triggerId: string;
  triggerTypeId: string;
  input: any;
}
export interface INodeOutputSchema {
  id: string;
  title: string;
  schema: IJsonSchema | undefined;
  uiSchema?: any;
}
export interface IRobot {
  name?: string;
  robotId: string;
  description?: string;
  isActive: boolean;
}
export interface IRobotBaseInfo extends IRobot {
  nodes: any[];
}
export interface IRobotNodeTypeInfo {
  nodeTypeId: string;
  service: {
    logo: string;
  }
}
export interface IRobotCardInfo extends IRobot {
  nodeTypeList: IRobotNodeTypeInfo[];
}

export interface IRobotRunHistoryItem {
  taskId: string;
  createdAt: string;
  robotId: string;
  status: number;
}

export type IRobotRunHistoryList = IRobotRunHistoryItem[];

/**
 * MIT License
 *
 * Copyright (c) 2016 Richard Adams (https://github.com/enriched)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface IJsonSchema {
  $ref?: string;
  /////////////////////////////////////////////////
  // Schema Metadata
  /////////////////////////////////////////////////
  /**
   * This is important because it tells refs where
   * the root of the document is located
   */
  id?: string;
  /**
   * It is recommended that the meta-schema is
   * included in the root of any JSON Schema
   */
  $schema?: IJsonSchema;
  /**
   * Title of the schema
   */
  title?: string;
  /**
   * Schema description
   */
  description?: string;
  /**
   * Default json for the object represented by
   * this schema
   */
  'default'?: any;

  /////////////////////////////////////////////////
  // Number Validation
  /////////////////////////////////////////////////
  /**
   * The value must be a multiple of the number
   * (e.g. 10 is a multiple of 5)
   */
  multipleOf?: number;
  maximum?: number;
  /**
   * If true maximum must be > value, >= otherwise
   */
  exclusiveMaximum?: boolean;
  minimum?: number;
  /**
   * If true minimum must be < value, <= otherwise
   */
  exclusiveMinimum?: boolean;

  /////////////////////////////////////////////////
  // String Validation
  /////////////////////////////////////////////////
  maxLength?: number;
  minLength?: number;
  /**
   * This is a regex string that the value must
   * conform to
   */
  pattern?: string;

  /////////////////////////////////////////////////
  // Array Validation
  /////////////////////////////////////////////////
  additionalItems?: boolean | IJsonSchema;
  items?: IJsonSchema | IJsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;

  /////////////////////////////////////////////////
  // Object Validation
  /////////////////////////////////////////////////
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | IJsonSchema;
  /**
   * Holds simple JSON Schema definitions for
   * referencing from elsewhere.
   */
  definitions?: { [key: string]: IJsonSchema };
  /**
   * The keys that can exist on the object with the
   * json schema that should validate their value
   */
  properties?: { [property: string]: IJsonSchema };
  /**
   * The key of this object is a regex for which
   * properties the schema applies to
   */
  patternProperties?: { [pattern: string]: IJsonSchema };
  /**
   * If the key is present as a property then the
   * string of properties must also be present.
   * If the value is a JSON Schema then it must
   * also be valid for the object if the key is
   * present.
   */
  dependencies?: { [key: string]: IJsonSchema | string[] };

  /////////////////////////////////////////////////
  // Generic
  /////////////////////////////////////////////////
  /**
   * Enumerates the values that this schema can be
   * e.g.
   * {"type": "string",
     *  "enum": ["red", "green", "blue"]}
   */
  'enum'?: any[];
  enumNames?: any[];
  /**
   * The basic type of this schema, can be one of
   * [string, number, object, array, boolean, null]
   * or an array of the acceptable types
   */
  type?: string | string[];

  /////////////////////////////////////////////////
  // Combining Schemas
  /////////////////////////////////////////////////
  allOf?: IJsonSchema[];
  anyOf?: IJsonSchema[];
  oneOf?: IJsonSchema[];
  /**
   * The entity being validated must not match this schema
   */
  not?: IJsonSchema;

  uiSchema?: object;
}

export interface INodeSchema {
  schema: IJsonSchema;
  // 对 IJsonSchema 的扩充。控制表单的 ui，即 react json schema form 中的 uiSchema，这里放在描述的数据的 schema 中。
  uiSchema?: object;
}

export interface IRobotHeadAddBtn {
  style?: React.CSSProperties;
  container?: React.FC<any>;
  toolTips?: any;
  useTextBtn?: boolean;
  btnStyle?: React.CSSProperties;
}
