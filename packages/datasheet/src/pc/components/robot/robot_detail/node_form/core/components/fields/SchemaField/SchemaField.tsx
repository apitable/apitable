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
import { Fragment, memo } from 'react';
import { mergeObjects } from '../../../func';
import { ISchemaFieldProps } from '../../../interface';
import { getDefaultRegistry, getDisplayLabel, isSelect, retrieveSchema, toIdSchema } from '../../../utils';
import { DefaultTemplate } from './DefaultTemplate';
import { ErrorList } from './ErrorList';
import { Help } from './Help';
import { getFieldComponent } from './helper';

function SchemaField1(props: ISchemaFieldProps) {
  const {
    uiSchema = {},
    formData,
    errorSchema = {},
    idPrefix,
    name,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    registry = getDefaultRegistry(),
    wasPropertyKeyModified = false,
  } = props;
  const { rootSchema, fields, formContext } = registry;
  const FieldTemplate = uiSchema['ui:FieldTemplate'] || (registry as any).FieldTemplate || DefaultTemplate;
  let idSchema: any = props.idSchema || {};
  const schema = retrieveSchema(props.schema, rootSchema, formData);
  idSchema = mergeObjects(toIdSchema(schema, null, rootSchema, formData, idPrefix), idSchema);
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const DescriptionField = fields.DescriptionField as any;
  const disabled = Boolean(props.disabled || uiSchema['ui:disabled']);
  const readonly = Boolean(
    props.readonly ||
      uiSchema['ui:readonly'] ||
      // props.schema.readOnly ||
      schema.readOnly,
  );
  const autofocus = Boolean(props.autofocus || uiSchema['ui:autofocus']);
  if (Object.keys(schema).length === 0) {
    return null;
  }

  const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __errors, ...fieldErrorSchema } = errorSchema as any;
  // See #439: uiSchema: Don't pass consumed class names to child components
  const field = (
    <FieldComponent
      {...props}
      idSchema={idSchema}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
      rawErrors={__errors}
    />
  );

  const id = idSchema.$id;

  // If this schema has a title defined, but the user has set a new key/label, retain their input.
  let label;
  if (wasPropertyKeyModified) {
    label = name;
  } else {
    label = uiSchema['ui:title'] || props.schema.title || schema.title || name;
  }

  const description = uiSchema['ui:description'] || props.schema.description || schema.description;
  const hideDesc = 'ui:options' in uiSchema && 'hideDesc' in uiSchema['ui:options']! ? Boolean(uiSchema['ui:options']!['hideDesc']) : false;

  const errors = __errors;
  const help = uiSchema['ui:help'];
  const hidden = uiSchema['ui:widget'] === 'hidden';
  const classNames = [
    'form-group',
    'field',
    `field-${schema.type}`,
    errors && (errors as any).length > 0 ? 'field-error has-error has-danger' : '',
    uiSchema.classNames,
  ]
    .join(' ')
    .trim();

  const fieldProps = {
    description: !hideDesc && <DescriptionField id={id + '__description'} description={description} formContext={formContext} />,
    rawDescription: description,
    help: <Help id={id + '__help'} help={help} />,
    rawHelp: typeof help === 'string' ? help : undefined,
    errors: <ErrorList errors={errors as any} />,
    rawErrors: errors,
    id,
    label,
    hidden,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    disabled,
    readonly,
    displayLabel,
    classNames,
    formContext,
    formData,
    fields,
    schema,
    uiSchema,
    registry,
  };

  const _AnyOfField = registry.fields.AnyOfField as any;
  const _OneOfField = registry.fields.OneOfField as any;

  return (
    <FieldTemplate {...fieldProps}>
      <Fragment>
        {field}

        {/*
         If the schema `anyOf` or 'oneOf' can be rendered as a select control, don't
         render the selection and let `StringField` component handle
         rendering
         */}
        {schema.anyOf && !isSelect(schema) && (
          <_AnyOfField
            disabled={disabled}
            errorSchema={errorSchema}
            formData={formData}
            idPrefix={idPrefix}
            idSchema={idSchema}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
            options={schema.anyOf.map((_schema: JSONSchema7) => retrieveSchema(_schema, rootSchema, formData))}
            baseType={schema.type}
            registry={registry as any}
            schema={schema}
            uiSchema={uiSchema}
          />
        )}

        {schema.oneOf && !isSelect(schema) && (
          <_OneOfField
            disabled={disabled}
            errorSchema={errorSchema}
            formData={formData}
            idPrefix={idPrefix}
            idSchema={idSchema}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
            options={schema.oneOf.map((_schema: JSONSchema7) => retrieveSchema(_schema, rootSchema, formData))}
            baseType={schema.type}
            registry={registry as any}
            schema={schema}
            uiSchema={uiSchema}
          />
        )}
      </Fragment>
    </FieldTemplate>
  );
}

const SchemaField = memo(SchemaField1);
export { SchemaField };
export default SchemaField;
