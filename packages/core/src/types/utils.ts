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

import type { AxiosResponse } from 'axios';
import type { DefaultStatusMessage } from 'config/constant';
import { Object } from 'ts-toolbelt';

/**
  * part specified as optional type
  */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type IAxiosResponse<T = any> = Object.Merge<{
  data: {
    success: boolean;
    code: number;
    message: DefaultStatusMessage;
    data: T;
  }
}, AxiosResponse<T>>;

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
