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

import { JSONSchema7 } from 'json-schema';
// @ts-ignore
import mergeAllOf from 'json-schema-merge-allof';
import jsonpointer from 'jsonpointer';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import union from 'lodash/union';
import { createElement } from 'react';
import * as ReactIs from 'react-is';
import { data2Operand, EmptyNullOperand, getObjectOperandProperty, isArrayOperand, isObjectOperand, mergeOperand } from '@apitable/core';
import fields from './components/fields';
import widgets from './components/widgets';
import { ADDITIONAL_PROPERTY_FLAG, widgetMap } from './const';
import { isObject, mergeObjects } from './func';
import { IFormProps, IPathSchema, IRangeSpec, IRegistry, IUiSchema, IWidget } from './interface';
import { default as validate, default as validateFormData, isValid, toErrorList } from './validate';

export function canExpand(schema: JSONSchema7, uiSchema: IUiSchema, formData: any) {
  if (!schema.additionalProperties) {
    return false;
  }
  const { expandable } = getUiOptions(uiSchema) || {};
  if (expandable === false) {
    return expandable;
  }
  // if ui:options.expandable was not explicitly set to false, we can add
  // another property if we have not exceeded maxProperties yet
  if (schema.maxProperties !== undefined) {
    return Object.keys(formData).length < schema.maxProperties;
  }
  return true;
}

export function getDefaultRegistry(): IRegistry {
  return {
    fields: fields as any,
    widgets: widgets as any,
    definitions: {},
    rootSchema: {},
    formContext: {},
  };
}

export const getRegistry = (props: any): IRegistry => {
  // For BC, accept passed SchemaField and TitleField props and pass them to
  // the "fields" registry one.
  const { fields, widgets } = getDefaultRegistry();
  return {
    fields: { ...fields, ...props.fields },
    widgets: { ...widgets, ...props.widgets },
    ArrayFieldTemplate: props.ArrayFieldTemplate,
    ObjectFieldTemplate: props.ObjectFieldTemplate,
    FieldTemplate: props.FieldTemplate,
    definitions: props.schema.definitions || {},
    rootSchema: props.schema,
    formContext: props.formContext || {},
  };
};

/* Gets the type of a given schema. */
export function getSchemaType(schema: JSONSchema7): string {
  const { type } = schema;

  if (!type && schema.const) {
    return guessType(schema.const);
  }

  if (!type && schema.enum) {
    return 'string';
  }

  if (!type && (schema.properties || schema.additionalProperties)) {
    return 'object';
  }
  if (Array.isArray(type) && type.length === 2 && type.includes('null')) {
    return type.find((type) => type !== 'null')!;
  }
  return type as string;
}

export function getWidget(schema: JSONSchema7, widget: IWidget | string, registeredWidgets: { [name: string]: IWidget } = {}): IWidget {
  const type = getSchemaType(schema);

  const mergeOptions = (Widget: any) => {
    // cache return value as property of widget for proper react reconciliation
    if (!Widget.MergedWidget) {
      const defaultOptions = (Widget.defaultProps && Widget.defaultProps.options) || {};
      Widget.MergedWidget = ({ options = {}, ...props }) => <Widget options={{ ...defaultOptions, ...options }} {...props} />;
    }
    return Widget.MergedWidget;
  };

  if (typeof widget === 'function' || ReactIs.isForwardRef(createElement(widget)) || ReactIs.isMemo(widget)) {
    return mergeOptions(widget);
  }

  if (typeof widget !== 'string') {
    throw new Error(`Unsupported widget definition: ${typeof widget}`);
  }

  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widget];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`);
  }

  if (widgetMap[type].hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widgetMap[type][widget]];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  throw new Error(`No widget "${widget}" for type "${type}"`);
}

export function hasWidget(schema: JSONSchema7, widget: string, registeredWidgets = {}) {
  try {
    getWidget(schema, widget, registeredWidgets);
    return true;
  } catch (e) {
    if (!(e instanceof Error)) throw e;
    if (e.message && (e.message.startsWith('No widget') || e.message.startsWith('Unsupported widget'))) {
      return false;
    }
    throw e;
  }
}

/**
 * Calculates the default values in the schema, and the returned defaults are always the original values.
 * @param _schema 
 * @param parentDefaults
 * @param rootSchema
 * @param rawFormData
 * @param includeUndefinedValues
 */
function computeDefaults(_schema: any, parentDefaults: { [x: string]: any }, rootSchema: any, rawFormData = {}, includeUndefinedValues = false): any {
  let schema = isObject(_schema) ? _schema : {};
  const formData = rawFormData;
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults;
  if (isObject(defaults) && isObject(schema?.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default);
  } else if ('default' in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ('$ref' in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(schema.$ref, rootSchema);
    return computeDefaults(refSchema, defaults, rootSchema, formData, includeUndefinedValues);
  } else if ('dependencies' in schema) {
    const resolvedSchema = resolveDependencies(schema, rootSchema, formData);
    return computeDefaults(resolvedSchema, defaults, rootSchema, formData, includeUndefinedValues);
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map((itemSchema: any, idx: number) =>
      computeDefaults(itemSchema, Array.isArray(parentDefaults) ? parentDefaults[idx] : undefined, rootSchema, formData, includeUndefinedValues),
    );
  } else if ('oneOf' in schema) {
    schema = schema.oneOf[getMatchingOption(undefined, schema.oneOf, rootSchema)];
  } else if ('anyOf' in schema) {
    schema = schema.anyOf[getMatchingOption(undefined, schema.anyOf, rootSchema)];
  }

  // Not defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === 'undefined') {
    defaults = schema.default;
  }

  switch (getSchemaType(schema)) {
    // We need to recur for object schema inner default values.
    case 'object':
      return Object.keys(schema.properties || {}).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults we might
        // have from a previous run: defaults[key].
        const computedDefault = computeDefaults(
          schema.properties[key],
          (defaults || {})[key],
          rootSchema,
          getObjectOperandProperty(formData, key, schema.properties[key]),
          // (formData || {})[key], //FIXME: Need to get the property value using the expression method
          includeUndefinedValues,
        );
        if (includeUndefinedValues || computedDefault !== undefined) {
          acc[key] = computedDefault;
        }
        return acc;
      }, {});

    case 'array':
      // Inject defaults into existing array defaults
      if (Array.isArray(defaults)) {
        defaults = defaults.map((item, idx) => {
          return computeDefaults(schema.items[idx] || schema.additionalItems || {}, item, rootSchema);
        });
      }

      // Deeply inject defaults into already existing form data
      if (Array.isArray(rawFormData)) {
        defaults = rawFormData.map((item, idx) => {
          return computeDefaults(schema.items, (defaults || {})[idx], rootSchema, item);
        });
      }
      if (schema.minItems) {
        if (!isMultiSelect(schema, rootSchema)) {
          const defaultsLength = defaults ? defaults.length : 0;
          if (schema.minItems > defaultsLength) {
            const defaultEntries = defaults || [];
            // populate the array with the defaults
            const fillerSchema = Array.isArray(schema.items) ? schema.additionalItems : schema.items;
            const fillerEntries = new Array(schema.minItems - defaultsLength).fill(computeDefaults(fillerSchema, fillerSchema.defaults, rootSchema));
            // then fill up the rest with either the item default or empty, up to minItems

            return defaultEntries.concat(fillerEntries);
          }
        } else {
          return defaults ? defaults : [];
        }
      }
  }
  return defaults;
}

export function getDefaultFormState(_schema: any, formData: any, rootSchema = {}, includeUndefinedValues = false) {
  if (!isObject(_schema)) {
    throw new Error('Invalid schema: ' + _schema);
  }
  const schema = retrieveSchema(_schema, rootSchema, formData);
  // Recursively get the default values declared in the schema
  const _defaults = computeDefaults(schema, _schema.default, rootSchema, formData, includeUndefinedValues);
  // The default value is converted to an operand
  const defaults = data2Operand(_defaults);
  if (formData == null) {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isArrayOperand(formData) || isObjectOperand(formData)) {
    return mergeOperand(defaults, formData);
  }
  // The schema defaults are merged with the initialized formData passed in.
  // if (isObject(formData) || Array.isArray(formData)) {
  //   return mergeDefaultsWithFormData(defaults, formData);
  // }
  if (formData === 0 || formData === false || formData === '') {
    return formData;
  }
  return formData || defaults;
}

/**
 * When merging defaults and form data, we want to merge in this specific way:
 * - objects are deeply merged
 * - arrays are merged in such a way that:
 *   - when the array is set in form data, only array entries set in form data
 *     are deeply merged; additional entries from the defaults are ignored
 *   - when the array is not set in form data, the default is copied over
 * - scalars are overwritten/set by form data
 */
export function mergeDefaultsWithFormData(defaults: any[], formData: any): any {
  if (Array.isArray(formData)) {
    if (!Array.isArray(defaults)) {
      defaults = [];
    }
    return formData.map((value, idx) => {
      if (defaults[idx]) {
        return mergeDefaultsWithFormData(defaults[idx], value);
      }
      return value;
    });
  } else if (isObject(formData)) {
    const acc = Object.assign({}, defaults); // Prevent mutation of source object.
    return Object.keys(formData).reduce((acc, key) => {
      acc[key] = mergeDefaultsWithFormData(defaults ? defaults[key] : {}, formData[key]);
      return acc;
    }, acc);
  }
  return formData;
}

export function getUiOptions(uiSchema: IUiSchema): IUiSchema['ui:options'] {
  // get all passed options from ui:widget, ui:options, and ui:<optionName>
  return Object.keys(uiSchema)
    .filter((key) => key.indexOf('ui:') === 0)
    .reduce((options, key) => {
      const value = uiSchema[key];
      if (key === 'ui:widget' && isObject(value)) {
        console.warn('Setting options via ui:widget object is deprecated, use ui:options instead');
        return {
          ...options,
          ...(value.options || {}),
          widget: value.component,
        };
      }
      if (key === 'ui:options' && isObject(value)) {
        return { ...options, ...value };
      }
      return { ...options, [key.substring(3)]: value };
    }, {});
}

export function getDisplayLabel(schema: JSONSchema7, uiSchema: IUiSchema, rootSchema: any) {
  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions!;
  const schemaType = getSchemaType(schema);

  if (schemaType === 'array') {
    displayLabel = isMultiSelect(schema, rootSchema) || isFilesArray(schema, uiSchema, rootSchema);
  }

  if (schemaType === 'object') {
    displayLabel = false;
  }
  if (schemaType === 'boolean' && !uiSchema['ui:widget']) {
    displayLabel = false;
  }
  if (uiSchema['ui:field']) {
    displayLabel = false;
  }
  return displayLabel;
}

export function asNumber(value: string | null) {
  if (value === '') {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (/\.$/.test(value)) {
    // "3." can't really be considered a number even if it parses in js. The
    // user is most likely entering a float.
    return value;
  }
  if (/\.0$/.test(value)) {
    // we need to return this as a string here, to allow for input like 3.07
    return value;
  }
  const n = Number(value);
  const valid = typeof n === 'number' && !Number.isNaN(n);

  if (/\.\d*0$/.test(value)) {
    // It's a number, that's cool - but we need it as a string so it doesn't screw
    // with the user when entering dollar amounts or other values (such as those with
    // specific precision or number of significant digits)
    return value;
  }

  return valid ? n : value;
}

export function orderProperties(properties: any[], order?: any[]) {
  if (!Array.isArray(order)) {
    return properties;
  }

  const arrayToHash = (arr: any[]) =>
    arr.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
  const errorPropList = (arr: any[]) => (arr.length > 1 ? `properties '${arr.join("', '")}'` : `property '${arr[0]}'`);
  const propertyHash = arrayToHash(properties);
  const orderFiltered = order.filter((prop) => prop === '*' || propertyHash[prop]);
  const orderHash = arrayToHash(orderFiltered);

  const rest = properties.filter((prop: string) => !orderHash[prop]);
  const restIndex = orderFiltered.indexOf('*');
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(`uiSchema order list does not contain ${errorPropList(rest)}`);
    }
    return orderFiltered;
  }
  if (restIndex !== orderFiltered.lastIndexOf('*')) {
    throw new Error('uiSchema order list contains more than one wildcard item');
  }

  const complete = [...orderFiltered];
  complete.splice(restIndex, 1, ...rest);
  return complete;
}

/**
 * This function checks if the given schema matches a single
 * constant value.
 */
export function isConstant(schema: any) {
  return (Array.isArray(schema.enum) && schema.enum.length === 1) || schema.hasOwnProperty('const');
}

export function toConstant(schema: any) {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0];
  } else if (schema.hasOwnProperty('const')) {
    return schema.const;
  }
  throw new Error('schema cannot be inferred as a constant');
}

// export function isSelect(_schema: JSONSchema7, definitions?: IRegistry['definitions']): boolean;

export function isSelect(_schema: JSONSchema7, rootSchema: IRegistry['definitions'] = {}): boolean {
  const schema = retrieveSchema(_schema, rootSchema);
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(schema.enum)) {
    return true;
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every((altSchemas) => isConstant(altSchemas));
  }
  return false;
}

// export function isMultiSelect(schema: JSONSchema7, definitions?: IRegistry['definitions']): boolean;
export function isMultiSelect(schema: JSONSchema7, rootSchema: IRegistry['definitions'] = {}): boolean {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items as JSONSchema7, rootSchema);
}

export function isFilesArray(schema: any, uiSchema: any, rootSchema = {}) {
  if (uiSchema['ui:widget'] === 'files') {
    return true;
  } else if (schema.items) {
    const itemsSchema = retrieveSchema(schema.items, rootSchema);
    return itemsSchema.type === 'string' && itemsSchema.format === 'data-url';
  }
  return false;
}

export function isFixedItems(schema: JSONSchema7) {
  return Array.isArray(schema.items) && schema.items.length > 0 && schema.items.every((item) => isObject(item as any));
}

export function allowAdditionalItems(schema: JSONSchema7) {
  if (schema.additionalItems === true) {
    console.warn('additionalItems=true is currently not supported');
  }
  return isObject(schema.additionalItems as any);
}

export function optionsList(schema: any) {
  if (schema.enum) {
    return schema.enum.map((value: any, i: number) => {
      const label = (schema.enumNames && schema.enumNames[i]) || String(value);
      return { label, value };
    });
  }
  const altSchemas = schema.oneOf || schema.anyOf;
  return altSchemas.map((schema: any) => {
    const value = toConstant(schema);
    const label = schema.title || String(value);
    return {
      schema,
      label,
      value,
    };
  });
}

export function findSchemaDefinition($ref: string, rootSchema = {}): any {
  const origRef = $ref;
  if ($ref.startsWith('#')) {
    // Decode URI fragment representation.
    $ref = decodeURIComponent($ref.substring(1));
  } else {
    throw new Error(`Could not find a definition for ${origRef}.`);
  }
  const current = jsonpointer.get(rootSchema, $ref);
  if (current === undefined) {
    throw new Error(`Could not find a definition for ${origRef}.`);
  }
  if (current.hasOwnProperty('$ref')) {
    return findSchemaDefinition(current.$ref, rootSchema);
  }
  return current;
}

// In the case where we have to implicitly create a schema, it is useful to know what type to use
//  based on the data we are defining
export const guessType = function guessType(value: any) {
  if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'string') {
    return 'string';
  } else if (value == null) {
    return 'null';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (!isNaN(value)) {
    return 'number';
  } else if (typeof value === 'object') {
    return 'object';
  }
  // Default to string if we can't figure it out
  return 'string';
};

// This function will create new "properties" items for each key in our formData
export function stubExistingAdditionalProperties(schema: any, rootSchema = {}, formData = {}) {
  // Clone the schema so we don't ruin the consumer's original
  schema = {
    ...schema,
    properties: { ...schema.properties },
  };

  Object.keys(formData).forEach((key) => {
    if (schema.properties.hasOwnProperty(key)) {
      // No need to stub, our schema already has the property
      return;
    }

    let additionalProperties;
    if (schema.additionalProperties.hasOwnProperty('$ref')) {
      additionalProperties = retrieveSchema({ $ref: schema.additionalProperties['$ref'] }, rootSchema, formData);
    } else if (schema.additionalProperties.hasOwnProperty('type')) {
      additionalProperties = { ...schema.additionalProperties };
    } else {
      additionalProperties = { type: guessType(formData[key]) };
    }

    // The type of our new key should match the additionalProperties value;
    schema.properties[key] = additionalProperties;
    // Set our additional property flag so we know it was dynamically added
    schema.properties[key][ADDITIONAL_PROPERTY_FLAG] = true;
  });

  return schema;
}

export function resolveSchema(schema: any, rootSchema = {}, formData = {}): any {
  if (schema.hasOwnProperty('$ref')) {
    return resolveReference(schema, rootSchema, formData);
  } else if (schema.hasOwnProperty('dependencies')) {
    const resolvedSchema = resolveDependencies(schema, rootSchema, formData);
    return retrieveSchema(resolvedSchema, rootSchema, formData);
  } else if (schema.hasOwnProperty('allOf')) {
    return {
      ...schema,
      allOf: schema.allOf.map((allOfSubschema: JSONSchema7) => retrieveSchema(allOfSubschema, rootSchema, formData)),
    };
  }
  // No $ref or dependencies attribute found, returning the original schema.
  return schema;
}

function resolveReference(schema: JSONSchema7, rootSchema: {} | undefined, formData: object | undefined) {
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref!, rootSchema);
  // Drop the $ref property of the source schema.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $ref, ...localSchema } = schema;
  // Update referenced schema definition with local schema properties.
  return retrieveSchema({ ...$refSchema, ...localSchema }, rootSchema, formData);
}

export function retrieveSchema(schema: JSONSchema7, rootSchema: object = {}, formData: object = {}) {
  if (!isObject(schema)) {
    return {};
  }
  let resolvedSchema = resolveSchema(schema, rootSchema, formData);
  if ('allOf' in schema) {
    try {
      resolvedSchema = mergeAllOf({
        ...resolvedSchema,
        allOf: resolvedSchema.allOf,
      });
    } catch (e) {
      console.warn('could not merge subschemas in allOf:\n' + e);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { allOf, ...resolvedSchemaWithoutAllOf } = resolvedSchema;
      return resolvedSchemaWithoutAllOf;
    }
  }
  const hasAdditionalProperties = resolvedSchema.hasOwnProperty('additionalProperties') && resolvedSchema.additionalProperties !== false;
  if (hasAdditionalProperties) {
    return stubExistingAdditionalProperties(resolvedSchema, rootSchema, formData);
  }
  return resolvedSchema;
}

function resolveDependencies(schema: JSONSchema7, rootSchema: any, formData: any) {
  // Drop the dependencies from the source schema.
  const { dependencies = {}, ...restResolvedSchema } = schema;
  let resolvedSchema = restResolvedSchema;
  if ('oneOf' in resolvedSchema) {
    resolvedSchema = (resolvedSchema.oneOf as JSONSchema7[])[getMatchingOption(formData, resolvedSchema.oneOf as JSONSchema7[], rootSchema)];
  } else if ('anyOf' in resolvedSchema) {
    resolvedSchema = (resolvedSchema.anyOf as JSONSchema7[])[getMatchingOption(formData, resolvedSchema.anyOf as JSONSchema7[], rootSchema)];
  }
  return processDependencies(dependencies, resolvedSchema, rootSchema, formData);
}

function processDependencies(
  dependencies: { [x: string]: any },
  resolvedSchema: any,
  rootSchema: object | undefined,
  formData: object | undefined,
): any {
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (getObjectOperandProperty(formData, dependencyKey, resolvedSchema) === EmptyNullOperand) {
      continue;
    }
    // Skip this dependency if it is not included in the schema (such as when dependencyKey is itself a hidden dependency.)
    if (resolvedSchema.properties && !(dependencyKey in resolvedSchema.properties)) {
      continue;
    }
    const { [dependencyKey]: dependencyValue, ...remainingDependencies } = dependencies;
    if (Array.isArray(dependencyValue)) {
      resolvedSchema = withDependentProperties(resolvedSchema, dependencyValue);
    } else if (isObject(dependencyValue)) {
      resolvedSchema = withDependentSchema(resolvedSchema, rootSchema, formData, dependencyKey, dependencyValue);
    }
    return processDependencies(remainingDependencies, resolvedSchema, rootSchema, formData);
  }
  return resolvedSchema;
}

function withDependentProperties(schema: any, additionallyRequired: any[]) {
  if (!additionallyRequired) {
    return schema;
  }
  const required = Array.isArray(schema.required) ? Array.from(new Set([...schema.required, ...additionallyRequired])) : additionallyRequired;
  return { ...schema, required: required };
}

function withDependentSchema(
  schema: any,
  rootSchema: object | undefined,
  formData: object | undefined,
  dependencyKey: string,
  dependencyValue: JSONSchema7,
) {
  const { oneOf, ...dependentSchema } = retrieveSchema(dependencyValue, rootSchema, formData);
  schema = mergeSchemas(schema, dependentSchema);
  // Since it does not contain oneOf, we return the original schema.
  if (oneOf === undefined) {
    return schema;
  } else if (!Array.isArray(oneOf)) {
    throw new Error(`invalid: it is some ${typeof oneOf} instead of an array`);
  }
  // Resolve $refs inside oneOf.
  const resolvedOneOf = oneOf.map((subschema) => (subschema.hasOwnProperty('$ref') ? resolveReference(subschema, rootSchema, formData) : subschema));
  return withExactlyOneSubschema(schema, rootSchema, formData, dependencyKey, resolvedOneOf);
}

function withExactlyOneSubschema(schema: any, rootSchema: object | undefined, formData: object | undefined, dependencyKey: string, oneOf: any[]) {
  const validSubschemas = oneOf.filter((subschema: any) => {
    if (!subschema.properties) {
      return false;
    }
    const { [dependencyKey]: conditionPropertySchema } = subschema.properties;
    if (conditionPropertySchema) {
      const conditionSchema = {
        type: 'object',
        properties: {
          [dependencyKey]: conditionPropertySchema,
        },
      };
      const { errors } = validateFormData(formData, conditionSchema);
      return errors.length === 0;
    }
    return false;
  });
  if (validSubschemas.length !== 1) {
    console.warn("ignoring oneOf in dependencies because there isn't exactly one subschema that is valid");
    return schema;
  }
  const subschema = validSubschemas[0];
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [dependencyKey]: conditionPropertySchema,
    ...dependentSubschema
  } = subschema.properties;
  const dependentSchema = { ...subschema, properties: dependentSubschema };
  return mergeSchemas(schema, retrieveSchema(dependentSchema, rootSchema, formData));
}

// Recursively merge deeply nested schemas.
// The difference between mergeSchemas and mergeObjects
// is that mergeSchemas only concats arrays for
// values under the "required" keyword, and when it does,
// it doesn't include duplicate values.
export function mergeSchemas(obj1: any, obj2: any) {
  const acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
          right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeSchemas(left, right);
    } else if (
      obj1 &&
      obj2 &&
      (getSchemaType(obj1) === 'object' || getSchemaType(obj2) === 'object') &&
      key === 'required' &&
      Array.isArray(left) &&
      Array.isArray(right)
    ) {
      // Don't include duplicate values when merging
      // "required" fields.
      acc[key] = union(left, right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}

function isArguments(object: any) {
  return Object.prototype.toString.call(object) === '[object Arguments]';
}

export function deepEquals(a: any, b: any): any {
  if (a === b) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return (
      a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.lastIndex === b.lastIndex && a.ignoreCase === b.ignoreCase
    );
  }
  if (typeof a !== 'object' && typeof b !== 'object') {
    return a == b; // eslint-disable-line eqeqeq
  }
  if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b))) {
      return false;
    }
    const slice = Array.prototype.slice;
    return deepEquals(slice.call(a), slice.call(b));
  }
  // eslint-disable-next-line max-len
  if (
    a === null ||
    b === null ||
    Object.prototype.toString.call(a) !== '[object Object]' ||
    Object.prototype.toString.call(b) !== '[object Object]'
  ) {
    return false;
  }
  const keys = Object.keys(a);
  if (Object.keys(b).length !== keys.length) {
    return false;
  }
  for (let i = 0; i < keys.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
      return false;
    }
    if (!deepEquals(a[keys[i]], b[keys[i]])) {
      return false;
    }
  }
  return true;
}

export const getFieldNames = (pathSchema: IPathSchema, formData: any) => {
  const getAllPaths = (_obj: any, acc: any[] = [], paths = ['']) => {
    Object.keys(_obj).forEach((key) => {
      if (typeof _obj[key] === 'object') {
        const newPaths = paths.map((path) => `${path}.${key}`);
        // If an object is marked with additionalProperties, all its keys are valid
        if (_obj[key].__rjsf_additionalProperties && _obj[key].$name !== '') {
          acc.push(_obj[key].$name);
        } else {
          getAllPaths(_obj[key], acc, newPaths);
        }
      } else if (key === '$name' && _obj[key] !== '') {
        paths.forEach((path) => {
          path = path.replace(/^\./, '');
          const formValue = _get(formData, path);
          // adds path to fieldNames if it points to a value
          // or an empty object/array
          if (typeof formValue !== 'object' || _isEmpty(formValue)) {
            acc.push(path);
          }
        });
      }
    });
    return acc;
  };

  return getAllPaths(pathSchema);
};

export const toIdSchema = (schema: JSONSchema7, id: string | null, rootSchema: JSONSchema7, formData = {}, idPrefix = 'root'): any => {
  const idSchema = {
    $id: id || idPrefix,
  };
  if ('$ref' in schema || 'dependencies' in schema || 'allOf' in schema) {
    const _schema = retrieveSchema(schema, rootSchema, formData);
    return toIdSchema(_schema, id, rootSchema, formData, idPrefix);
  }
  if ('items' in schema && !(schema.items! as JSONSchema7).$ref) {
    return toIdSchema(schema.items as JSONSchema7, id, rootSchema, formData, idPrefix);
  }
  if (schema.type !== 'object') {
    return idSchema;
  }
  for (const name in schema.properties || {}) {
    const field = schema!.properties![name] as JSONSchema7;
    const fieldId = idSchema.$id + '_' + name;
    idSchema[name] = toIdSchema(
      isObject(field) ? field : {},
      fieldId,
      rootSchema,
      // It's possible that formData is not an object -- this can happen if an
      // array item has just been added, but not populated with data yet
      (formData || {})[name],
      idPrefix,
    );
  }
  return idSchema;
};

// export function toIdSchema<T = any>(
//   schema: JSONSchema7Definition,
//   id: string,
//   definitions: Registry['definitions'],
//   formData?: T,
//   idPredix?: string,
// ): IdSchema | IdSchema[];

export function toPathSchema<T>(
  schema: JSONSchema7,
  name: string | undefined = '',
  rootSchema: IRegistry['definitions'],
  formData: T,
): IPathSchema<T> {
  const pathSchema = {
    $name: name.replace(/^\./, ''),
  };
  if ('$ref' in schema || 'dependencies' in schema || 'allOf' in schema) {
    const _schema = retrieveSchema(schema, rootSchema, formData as any);
    return toPathSchema(_schema, name, rootSchema, formData);
  }

  if (schema.hasOwnProperty('additionalProperties')) {
    (pathSchema as any).__rjsf_additionalProperties = true;
  }

  if (schema.hasOwnProperty('items') && Array.isArray(formData)) {
    formData.forEach((element, i) => {
      pathSchema[i] = toPathSchema(schema.items as JSONSchema7, `${name}.${i}`, rootSchema, element);
    });
  } else if (schema.hasOwnProperty('properties')) {
    for (const property in schema.properties) {
      pathSchema[property] = toPathSchema(
        schema.properties[property] as JSONSchema7,
        `${name}.${property}`,
        rootSchema,
        // It's possible that formData is not an object -- this can happen if an
        // array item has just been added, but not populated with data yet
        (formData || {})[property],
      );
    }
  }
  return pathSchema as any;
}

// export function parseDateString(dateString, includeTime = true) {
//   if (!dateString) {
//     return {
//       year: -1,
//       month: -1,
//       day: -1,
//       hour: includeTime ? -1 : 0,
//       minute: includeTime ? -1 : 0,
//       second: includeTime ? -1 : 0,
//     };
//   }
//   const date = new Date(dateString);
//   if (Number.isNaN(date.getTime())) {
//     throw new Error("Unable to parse date " + dateString);
//   }
//   return {
//     year: date.getUTCFullYear(),
//     month: date.getUTCMonth() + 1, // oh you, javascript.
//     day: date.getUTCDate(),
//     hour: includeTime ? date.getUTCHours() : 0,
//     minute: includeTime ? date.getUTCMinutes() : 0,
//     second: includeTime ? date.getUTCSeconds() : 0,
//   };
// }

// export function toDateString(
//   { year, month, day, hour = 0, minute = 0, second = 0 },
//   time = true
// ) {
//   const utcTime = Date.UTC(year, month - 1, day, hour, minute, second);
//   const datetime = new Date(utcTime).toJSON();
//   return time ? datetime : datetime.slice(0, 10);
// }

export function utcToLocal(jsonDate: string): string {
  if (!jsonDate) {
    return '';
  }

  // required format of `"yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
  // https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type%3Ddatetime-local)
  // > should be a _valid local date and time string_ (not GMT)

  // Note - date constructor passed local ISO-8601 does not correctly
  // change time to UTC in node pre-8
  const date = new Date(jsonDate);

  const yyyy = pad(date.getFullYear(), 4);
  const MM = pad(date.getMonth() + 1, 2);
  const dd = pad(date.getDate(), 2);
  const hh = pad(date.getHours(), 2);
  const mm = pad(date.getMinutes(), 2);
  const ss = pad(date.getSeconds(), 2);
  const SSS = pad(date.getMilliseconds(), 3);

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${SSS}`;
}

export function localToUTC(dateString: string): string | undefined {
  if (dateString) {
    return new Date(dateString).toJSON();
  }
  return;
}

export function pad(num: number, size: number): string {
  let s = String(num);
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}

export function dataURItoBlob(dataURI: string): { name: string; blob: Blob } {
  // Split metadata from data
  const splitted = dataURI.split(',');
  // Split params
  const params = splitted[0].split(';');
  // Get mime-type from params
  const type = params[0].replace('data:', '');
  // Filter the name property from params
  const properties = params.filter((param) => {
    return param.split('=')[0] === 'name';
  });
  // Look for the name and use unknown if no name property.
  let name;
  if (properties.length !== 1) {
    name = 'unknown';
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split('=')[1];
  }

  // Built the Uint8Array Blob parameter from the base64 string.
  const binary = atob(splitted[1]);
  const array: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Create the blob object
  const blob = new window.Blob([new Uint8Array(array)], { type });

  return { blob, name };
}

export function rangeSpec(schema: JSONSchema7): IRangeSpec {
  const spec: IRangeSpec = {};
  if (schema.multipleOf) {
    spec.step = schema.multipleOf;
  }
  if (schema.minimum || schema.minimum === 0) {
    spec.min = schema.minimum;
  }
  if (schema.maximum || schema.maximum === 0) {
    spec.max = schema.maximum;
  }
  return spec;
}

export function getMatchingOption(formData: any, options: JSONSchema7[], rootSchema: IRegistry['definitions']): number {
  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    // If the schema describes an object then we need to add slightly more
    // strict matching to the schema, because unless the schema uses the
    // "requires" keyword, an object will match the schema as long as it
    // doesn't have matching keys with a conflicting type. To do this we use an
    // "anyOf" with an array of requires. This augmentation expresses that the
    // schema should match if any of the keys in the schema are present on the
    // object and pass validation.
    if (option.properties) {
      // Create an "anyOf" schema that requires at least one of the keys in the
      // "properties" object
      const requiresAnyOf = {
        anyOf: Object.keys(option.properties).map((key) => ({
          required: [key],
        })),
      };

      let augmentedSchema;

      // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"
      if (option.anyOf) {
        // Create a shallow clone of the option
        const { ...shallowClone } = option;

        if (!shallowClone.allOf) {
          shallowClone.allOf = [];
        } else {
          // If "allOf" already exists, shallow clone the array
          shallowClone.allOf = shallowClone.allOf.slice();
        }

        shallowClone.allOf.push(requiresAnyOf);

        augmentedSchema = shallowClone;
      } else {
        augmentedSchema = {
          ...option,
          ...requiresAnyOf,
        };
      }

      // Remove the "required" field as it's likely that not all fields have
      // been filled in yet, which will mean that the schema is not valid
      delete augmentedSchema.required;

      if (isValid(augmentedSchema, formData, rootSchema)) {
        return i;
      }
    } else if (isValid(option, formData, rootSchema)) {
      return i;
    }
  }
  return 0;
}

export const getStateFromProps = (props: IFormProps<any>, inputFormData: any, state: any = {}): any => {
  const { extraErrors, idPrefix, liveValidate, schema, uiSchema, customFormats, additionalMetaSchemas, noValidate } = props;
  const edit = typeof inputFormData !== 'undefined';
  const mustValidate = edit && !noValidate && liveValidate;
  const rootSchema = schema;
  const formData = getDefaultFormState(schema, inputFormData, rootSchema);
  const retrievedSchema = retrieveSchema(schema, rootSchema, formData);

  const getCurrentErrors = () => {
    if (noValidate) {
      return { errors: [], errorSchema: {} };
    } else if (!liveValidate) {
      return {
        errors: state.schemaValidationErrors || [],
        errorSchema: state.schemaValidationErrorSchema || {},
      };
    }
    return {
      errors: state.errors || [],
      errorSchema: state.errorSchema || {},
    };
  };

  const { validate: validateOrigin, transformErrors } = props;
  let errors, errorSchema, schemaValidationErrors, schemaValidationErrorSchema;
  if (mustValidate) {
    const schemaValidation = validate(formData, schema, validateOrigin, transformErrors as any, additionalMetaSchemas as any, customFormats as any);
    errors = schemaValidation.errors;
    errorSchema = schemaValidation.errorSchema;
    schemaValidationErrors = errors;
    schemaValidationErrorSchema = errorSchema;
  } else {
    const currentErrors = getCurrentErrors();
    errors = currentErrors.errors;
    errorSchema = currentErrors.errorSchema;
    schemaValidationErrors = state.schemaValidationErrors;
    schemaValidationErrorSchema = state.schemaValidationErrorSchema;
  }
  if (extraErrors) {
    errorSchema = mergeObjects(errorSchema, extraErrors, !!'concat arrays');
    errors = toErrorList(errorSchema);
  }
  const idSchema = toIdSchema(retrievedSchema, uiSchema?.['ui:rootFieldId'], rootSchema, formData, idPrefix);
  const nextState: any = {
    schema,
    uiSchema,
    idSchema,
    formData,
    edit,
    errors,
    errorSchema,
    additionalMetaSchemas,
  };
  if (schemaValidationErrors) {
    nextState.schemaValidationErrors = schemaValidationErrors;
    nextState.schemaValidationErrorSchema = schemaValidationErrorSchema;
  }
  return nextState;
};
