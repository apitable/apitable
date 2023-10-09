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

import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
import toPath from 'lodash/toPath';
import { validateMagicForm } from '@apitable/core';
import { isObject, mergeObjects } from './func';

const ajv = createAjvInstance();

const ROOT_SCHEMA_PREFIX = '__rjsf_rootSchema';

function createAjvInstance() {
  const ajv = new Ajv({
    errorDataPath: 'property',
    allErrors: true,
    multipleOfPrecision: 8,
    schemaId: 'auto',
    unknownFormats: 'ignore',
  });

  // add custom formats
  ajv.addFormat('data-url', /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/);
  ajv.addFormat(
    'color',
    // eslint-disable-next-line
    /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,
  );
  return ajv;
}

function toErrorSchema(errors: any[]) {
  // Transforms a ajv validation errors list:
  // [
  //   {property: ".level1.level2[2].level3", message: "err a"},
  //   {property: ".level1.level2[2].level3", message: "err b"},
  //   {property: ".level1.level2[4].level3", message: "err b"},
  // ]
  // Into an error tree:
  // {
  //   level1: {
  //     level2: {
  //       2: {level3: {errors: ["err a", "err b"]}},
  //       4: {level3: {errors: ["err b"]}},
  //     }
  //   }
  // };
  if (!errors.length) {
    return {};
  }
  return errors.reduce((errorSchema: any, error: { property: any; message: any }) => {
    const { property, message } = error;
    const path = toPath(property);
    let parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1);
    }

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        parent[segment] = {};
      }
      parent = parent[segment];
    }

    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message);
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }
    return errorSchema;
  }, {});
}

/**
 * Error message for all fields.
 * @param errorSchema
 * @param fieldName
 */
export function toErrorList(errorSchema: any, fieldName = 'root') {
  // XXX: We should transform fieldName as a full field path string.
  let errorList: any[] = [];
  if ('__errors' in errorSchema) {
    errorList = errorList.concat(
      (errorSchema.__errors as any[]).map((stack: any) => {
        return {
          stack: `${fieldName}: ${stack}`,
        };
      }),
    );
  }
  return Object.keys(errorSchema).reduce((acc, key) => {
    if (key !== '__errors') {
      acc = acc.concat(toErrorList(errorSchema[key], key));
    }
    return acc;
  }, errorList);
}

/**
 * It's not working for now.
 * @param formData
 */
function createErrorHandler(formData: object): {
  __errors: any[];
  addError(message: any): void;
} {
  const handler: {
    __errors: any[];
    addError(message: any): void;
  } = {
    // We store the list of errors for this node in a property named __errors
    // to avoid name collision with a possible sub schema field named
    // "errors" (see `utils.toErrorSchema`).
    __errors: [],
    addError(message: any) {
      this.__errors.push(message);
    },
  };
  if (isObject(formData)) {
    return Object.keys(formData).reduce((acc, key) => {
      return { ...acc, [key]: createErrorHandler(formData[key]) };
    }, handler);
  }
  if (Array.isArray(formData)) {
    return formData.reduce((acc, value, key) => {
      return { ...acc, [key]: createErrorHandler(value) };
    }, handler);
  }
  return handler;
}

function unwrapErrorHandler(errorHandler: object): any {
  return Object.keys(errorHandler).reduce((acc, key) => {
    if (key === 'addError') {
      return acc;
    } else if (key === '__errors') {
      return { ...acc, [key]: errorHandler[key] };
    }
    return { ...acc, [key]: unwrapErrorHandler(errorHandler[key]) };
  }, {});
}

/**
 * Transforming the error output from ajv to format used by jsonschema.
 * At some point, components should be updated to support ajv.
 */
function transformAjvErrors(errors = []) {
  if (errors === null) {
    return [];
  }

  return errors.map((e) => {
    const { dataPath, keyword, message, params, schemaPath } = e;
    const property = `${dataPath}`;

    // put data in expected format
    return {
      name: keyword,
      property,
      message,
      params, // specific to ajv
      stack: `${property} ${message}`.trim(),
      schemaPath,
    };
  });
}

/**
 * This function processes the formData with a user `validate` contributed
 * function, which receives the form data and an `errorHandler` object that
 * will be used to add custom validation errors for each field.
 */
export default function validateFormData(
  formData: any,
  schema: string | boolean | object,
  customValidate: ((arg0: any, arg1: any) => any) | undefined = undefined,
  _transformErrors:
    | ((
        arg0: {
          name: never;
          property: string;
          message: never;
          params: never; // specific to ajv
          stack: string;
          schemaPath: never;
        }[],
      ) => {
        name: never;
        property: string;
        message: never;
        params: never; // specific to ajv
        stack: string;
        schemaPath: never;
      }[])
    | undefined = undefined,
  _additionalMetaSchemas = [],
  _customFormats = {},
) {
  // Include form data with undefined values, which is required for validation.
  const rootSchema = schema as JSONSchema7;
  // FIXME: Improve the processing logic of default values
  // formData = getDefaultFormState(schema, formData, rootSchema, true);

  let validationError: any = null;
  const { errors: propertyErrors, validationError: _validationError } = validateMagicForm(rootSchema, formData);
  if (_validationError) {
    validationError = _validationError;
  }
  let errors: any = transformAjvErrors(propertyErrors as any);

  const noProperMetaSchema =
    validationError &&
    validationError.message &&
    typeof validationError.message === 'string' &&
    validationError.message.includes('no schema with key or ref ');

  if (noProperMetaSchema) {
    errors = [
      ...errors,
      {
        stack: validationError.message,
      },
    ];
  }

  let errorSchema = toErrorSchema(errors);

  if (noProperMetaSchema) {
    errorSchema = {
      ...errorSchema,
      ...{
        $schema: {
          __errors: [validationError.message],
        },
      },
    };
  }

  // customValidate is an additional validation function where ajv's checksum error results are retained
  if (typeof customValidate !== 'function') {
    return { errors, errorSchema };
  }

  const errorHandler = customValidate(formData, createErrorHandler(formData));

  const userErrorSchema1 = unwrapErrorHandler({
    datasheetId: {
      __errors: ['testxxxxxxxx']
    }
  });
  const userErrorSchema = unwrapErrorHandler(errorHandler);
  const newErrorSchema = mergeObjects(errorSchema, userErrorSchema, true);
  // XXX: The errors list produced is not fully compliant with the format
  // exposed by the jsonschema lib, which contains full field paths and other
  // properties.
  const newErrors = toErrorList(newErrorSchema);

  return {
    errors: newErrors,
    errorSchema: newErrorSchema,
  };
}

/**
 * Recursively prefixes all $ref's in a schema with `ROOT_SCHEMA_PREFIX`
 * This is used in isValid to make references to the rootSchema
 */
export function withIdRefPrefix(schemaNode: { constructor: ObjectConstructor }) {
  let obj: any = schemaNode;
  if (schemaNode.constructor === Object) {
    obj = { ...schemaNode };
    for (const key in obj) {
      const value = obj[key];
      if (key === '$ref' && typeof value === 'string' && value.startsWith('#')) {
        obj[key] = ROOT_SCHEMA_PREFIX + value;
      } else {
        obj[key] = withIdRefPrefix(value);
      }
    }
  } else if (Array.isArray(schemaNode)) {
    obj = [...schemaNode];
    for (let i = 0; i < obj.length; i++) {
      obj[i] = withIdRefPrefix(obj[i]);
    }
  }
  return obj;
}

/**
 * Validates data against a schema, returning true if the data is valid, or
 * false otherwise. If the schema is invalid, then this function will return
 * false.
 */
export function isValid(schema: any, data: any, rootSchema: object | object[]) {
  try {
    // add the rootSchema ROOT_SCHEMA_PREFIX as id.
    // then rewrite the schema ref's to point to the rootSchema
    // this accounts for the case where schema have references to models
    // that lives in the rootSchema but not in the schema in question.
    return ajv.addSchema(rootSchema, ROOT_SCHEMA_PREFIX).validate(withIdRefPrefix(schema), data);
  } catch (e) {
    return false;
  } finally {
    // make sure we remove the rootSchema from the global ajv instance
    ajv.removeSchema(ROOT_SCHEMA_PREFIX);
  }
}
