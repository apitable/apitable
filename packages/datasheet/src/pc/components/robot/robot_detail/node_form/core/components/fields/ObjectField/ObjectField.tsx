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

import { useState } from 'react';
import { getObjectOperandProperty, isOperand, objectCombOperand } from '@apitable/core';
import { ADDITIONAL_PROPERTY_FLAG } from '../../../const';
import { IFieldProps, IRegistry } from '../../../interface';
import { getDefaultRegistry, orderProperties, retrieveSchema } from '../../../utils';
import { DefaultObjectFieldTemplate } from './DefaultObjectFieldTemplate';
import { getDefaultValue } from './helper';

const ObjectField = (props: IFieldProps) => {
  const [state, setState] = useState({
    wasPropertyKeyModified: false,
    additionalProperties: {},
  });

  const isRequired = (name: string) => {
    const schema = props.schema;
    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
  };

  const onPropertyChange = (name: string, addedByAdditionalProperties = false) => {
    return (value: any, errorSchema: any) => {
      if (value === undefined && addedByAdditionalProperties) {
        // Don't set value = undefined for fields added by
        // additionalProperties. Doing so removes them from the
        // formData, which causes them to completely disappear
        // (including the input field for the property name). Unlike
        // fields which are "mandated" by the schema, these fields can
        // be set to undefined by clicking a "delete field" button, so
        // set empty values to the empty string.
        value = '';
      }
      const emptyObject = {
        type: 'Expression',
        value: {
          operator: 'newObject',
          operands: [],
        },
      };
      // console.log('onPropertyChange.props.formData', props.formData, name, value);
      const transObject = isOperand(props.formData) ? props.formData : emptyObject;
      // const newFormData = { ...props.formData, [name]: value };
      const _newFormData = {
        type: 'Expression',
        value: {
          operator: 'newObject',
          operands: objectCombOperand([...transObject.value.operands, name, value]),
        },
      };
      // console.log('onPropertyChange', _newFormData);
      props.onChange(
        _newFormData,
        errorSchema &&
          props.errorSchema && {
          ...props.errorSchema,
          [name]: errorSchema,
        },
      );
    };
  };

  const onDropPropertyClick = (key: string) => {
    return (event: any) => {
      event.preventDefault();
      const { onChange, formData } = props;
      const copiedFormData = { ...formData };
      delete copiedFormData[key];
      onChange(copiedFormData);
    };
  };

  const getAvailableKey = (preferredKey: string, formData: any) => {
    let index = 0;
    let newKey = preferredKey;
    while (formData.hasOwnProperty(newKey)) {
      newKey = `${preferredKey}-${++index}`;
    }
    return newKey;
  };

  const onKeyChange = (oldValue: any) => {
    return (value: any, errorSchema: any) => {
      if (oldValue === value) {
        return;
      }
      value = getAvailableKey(value, props.formData);
      const newFormData = { ...props.formData };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map((key: any) => {
        const newKey = newKeys[key] || key;
        return { [newKey]: newFormData[key] };
      });
      const renamedObj = Object.assign({}, ...keyValues);

      setState({
        wasPropertyKeyModified: true,
        additionalProperties: state.additionalProperties,
      });

      props.onChange(
        renamedObj,
        errorSchema &&
          props.errorSchema && {
          ...props.errorSchema,
          [value]: errorSchema,
        },
      );
    };
  };

  const handleAddClick = (schema: any) => () => {
    let type = schema.additionalProperties.type;
    const newFormData = { ...props.formData };

    if (schema.additionalProperties.hasOwnProperty('$ref')) {
      const { registry = getDefaultRegistry() } = props;
      const refSchema = retrieveSchema({ $ref: schema.additionalProperties['$ref'] }, registry.rootSchema, props.formData);
      type = refSchema.type;
    }
    newFormData[getAvailableKey('newKey', newFormData)] = getDefaultValue(type);
    props.onChange(newFormData);
  };

  const {
    uiSchema,
    formData,
    errorSchema,
    idSchema,
    name,
    required,
    disabled,
    readonly,
    idPrefix,
    onBlur,
    onFocus,
    registry = getDefaultRegistry(),
  } = props;

  // console.log('ObjectField.props.formData', props.formData);
  const { rootSchema, fields, formContext } = registry;
  const { TitleField, DescriptionField } = fields;
  const SchemaField = fields.SchemaField as any;
  const schema = retrieveSchema(props.schema, rootSchema, formData);

  const title = schema.title === undefined ? name : schema.title;
  const description = uiSchema['ui:description'] || schema.description;
  let orderedProperties;
  try {
    const properties = Object.keys(schema.properties || {});
    orderedProperties = orderProperties(properties, uiSchema['ui:order']);
  } catch (err: any) {
    return (
      <div>
        <p className="config-error" style={{ color: 'red' }}>
          Invalid {name || 'root'} object field configuration:
          <em>{err.message}</em>.
        </p>
        <pre>{JSON.stringify(schema)}</pre>
      </div>
    );
  }

  const Template = (uiSchema['ui:ObjectFieldTemplate'] || (registry as IRegistry).ObjectFieldTemplate || DefaultObjectFieldTemplate) as any;

  const templateProps = {
    title: uiSchema['ui:title'] || title,
    description,
    TitleField,
    DescriptionField,
    properties: orderedProperties.map((name: string) => {
      const propertySchema = schema.properties[name];
      const addedByAdditionalProperties = propertySchema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
      const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name];
      const hidden = fieldUiSchema && fieldUiSchema['ui:widget'] === 'hidden';
      const propertyFormData = getObjectOperandProperty(formData || {}, name, propertySchema);
      // console.log('propertyFormData', name, propertyFormData);
      return {
        content: (
          <SchemaField
            key={name}
            name={name}
            required={isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={fieldUiSchema}
            errorSchema={errorSchema[name]}
            idSchema={idSchema[name]}
            idPrefix={idPrefix}
            formData={propertyFormData}
            wasPropertyKeyModified={state.wasPropertyKeyModified}
            onKeyChange={onKeyChange(name)}
            onChange={onPropertyChange(name, addedByAdditionalProperties)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={registry as any}
            disabled={disabled}
            readonly={readonly}
            onDropPropertyClick={onDropPropertyClick}
          />
        ),
        name,
        readonly,
        disabled,
        required,
        hidden,
      };
    }),
    readonly,
    disabled,
    required,
    idSchema,
    uiSchema,
    schema,
    formData,
    formContext,
    registry,
  };
  return <Template {...templateProps} onAddClick={handleAddClick} />;
};

export default ObjectField;
