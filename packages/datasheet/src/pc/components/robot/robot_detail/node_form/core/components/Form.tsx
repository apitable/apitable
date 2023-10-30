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

import _pick from 'lodash/pick';
import { useEffect, useImperativeHandle, useState, useRef, memo } from 'react';
import * as React from 'react';
import { isObject, mergeObjects } from '../func';
import { IFormProps } from '../interface';
import { getFieldNames, getRegistry, getStateFromProps, retrieveSchema, toPathSchema } from '../utils';
import validateFormData, { toErrorList } from '../validate';
import { default as DefaultErrorList } from './common/DefaultErrorList';

const defaultProps = {
  uiSchema: {},
  noValidate: false,
  liveValidate: false,
  validateOnMount: false,
  disabled: false,
  readonly: false,
  noHtml5Validate: false,
  ErrorList: DefaultErrorList,
  omitExtraData: false,
};

const Form1 = React.forwardRef((_props: IFormProps<any>, ref) => {
  const props = { ...defaultProps, ..._props };
  const formElementRef = useRef<HTMLFormElement>(null);
  const [newErrorSchema, setNewErrorSchema] = useState<any>();
  const [state, setState] = useState<any>(getStateFromProps(props, props.formData));

  useEffect(() => {
    const newProps = { ...defaultProps, ..._props };
    setState(getStateFromProps(newProps, newProps.formData,));
    if(props.validateOnMount) {
      setNewErrorSchema(getStateFromProps(newProps, newProps.formData,).errorSchema);
    }
  }, [_props, props.validateOnMount]);

  const validate = (
    formData: any,
    schema = props.schema,
    additionalMetaSchemas = props.additionalMetaSchemas,
    customFormats = props.customFormats,
  ) => {
    const { validate, transformErrors } = props;
    const { rootSchema } = getRegistry(props);
    const resolvedSchema = retrieveSchema(schema, rootSchema, formData);
    return validateFormData(formData, resolvedSchema, validate, transformErrors as any, additionalMetaSchemas as any, customFormats);
  };

  const renderErrors = () => {
    const { errors, errorSchema, schema, uiSchema } = state;
    const { ErrorList, showErrorList, formContext } = props;
    if (showErrorList && errors.length) {
      return <ErrorList errors={errors} errorSchema={errorSchema} schema={schema} uiSchema={uiSchema} formContext={formContext} />;
    }
    return null;
  };

  const getUsedFormData = (formData: any, fields: any[]) => {
    //for the case of a single input form
    if (fields.length === 0 && typeof formData !== 'object') {
      return formData;
    }

    const data = _pick(formData, fields);
    if (Array.isArray(formData)) {
      return Object.keys(data).map((key) => data[key]);
    }

    return data;
  };

  const onChange = (formData: any, newErrorSchema: any) => {

    if (isObject(formData) || Array.isArray(formData)) {
      const newState = getStateFromProps(props, formData, state);
      formData = newState.formData;
    }
    const mustValidate = !props.noValidate && props.liveValidate;
    let nextState: any = { formData };
    let newFormData = formData;

    if (props.omitExtraData === true && props.liveOmit === true) {
      const retrievedSchema = retrieveSchema(state.schema, state.schema, formData);
      const pathSchema = toPathSchema(retrievedSchema, '', state.schema, formData);

      const fieldNames = getFieldNames(pathSchema, formData);

      newFormData = getUsedFormData(formData, fieldNames);
      nextState = {
        formData: newFormData,
      };
    }

    if (mustValidate) {
      const schemaValidation = validate(newFormData);
      let errors = schemaValidation.errors;
      // setHasError(errors.length > 0);
      let errorSchema = schemaValidation.errorSchema;
      const schemaValidationErrors = errors;
      const schemaValidationErrorSchema = errorSchema;
      if (props.extraErrors) {
        errorSchema = mergeObjects(errorSchema, props.extraErrors, !!'concat arrays');
        errors = toErrorList(errorSchema);
      }
      nextState = {
        formData: newFormData,
        errors,
        errorSchema,
        schemaValidationErrors,
        schemaValidationErrorSchema,
      };
    } else if (!props.noValidate && newErrorSchema) {
      const errorSchema = props.extraErrors ? mergeObjects(newErrorSchema, props.extraErrors, !!'concat arrays') : newErrorSchema;
      nextState = {
        formData: newFormData,
        errorSchema: errorSchema,
        errors: toErrorList(errorSchema),
      };
    }
    const newState = {
      ...state,
      ...nextState,
    };
    setState(newState);
    props?.onUpdate?.(newState);
    setNewErrorSchema(nextState.errorSchema || null);
  };

  const onBlur = (id: string, value: any) => {
    props.onBlur?.(id, value);
  };

  const onFocus = (id: string, value: any) => {
    props.onFocus?.(id, value);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    if (event.target !== event.currentTarget) {
      return;
    }

    let newFormData = state.formData;
    if (props.omitExtraData === true) {
      const retrievedSchema = retrieveSchema(state.schema, state.schema, newFormData);
      const pathSchema = toPathSchema(retrievedSchema, '', state.schema, newFormData);
      const fieldNames = getFieldNames(pathSchema, newFormData);
      newFormData = getUsedFormData(newFormData, fieldNames);
    }
    if (!props.noValidate) {
      const schemaValidation = validate(newFormData);
      let errors = schemaValidation.errors;
      let errorSchema = schemaValidation.errorSchema;
      const schemaValidationErrors = errors;
      const schemaValidationErrorSchema = errorSchema;
      if (Object.keys(errors).length > 0) {
        if (props.extraErrors) {
          errorSchema = mergeObjects(errorSchema, props.extraErrors, !!'concat arrays');
          errors = toErrorList(errorSchema);
        }
        setState({
          ...state,
          errors,
          errorSchema,
          schemaValidationErrors,
          schemaValidationErrorSchema,
        });
        setNewErrorSchema(errorSchema || null);
        if (props.onError) {
          props.onError(errors);
        } else {
          console.warn('! ' + 'Form validation failed', errors);
        }
        return;
      }
    }

    // There are no errors generated through schema validation.
    // Check for user provided errors and update state accordingly.
    let errorSchema;
    let errors;
    if (props.extraErrors) {
      errorSchema = props.extraErrors;
      errors = toErrorList(errorSchema);
    } else {
      errorSchema = {};
      errors = [];
    }

    setState({
      ...state,
      formData: newFormData,
      errors: errors,
      errorSchema: errorSchema,
      schemaValidationErrors: [],
      schemaValidationErrorSchema: {},
    });
    setNewErrorSchema(errorSchema);
    if (props.onSubmit) {
      console.warn(newFormData);
      props.onSubmit({ ...state, formData: newFormData, status: 'submitted' }, event);
    }
  };

  useEffect(() => {
    const form = formElementRef.current;
    form?.addEventListener('submit', onSubmit);
    return () => {
      form?.removeEventListener('submit', onSubmit);
    };
  });

  useImperativeHandle(ref, () => ({
    submit: () => {
      formElementRef.current?.dispatchEvent(
        new CustomEvent('submit', {
          cancelable: true,
        }),
      );
    },
  }));

  const {
    children,
    id,
    idPrefix,
    className,
    tagName,
    name,
    method,
    target,
    action,
    autocomplete: deprecatedAutocomplete,
    autoComplete: currentAutoComplete,
    enctype,
    acceptcharset,
    noHtml5Validate,
    disabled,
    readonly,
    formContext,
  } = props;

  const { schema, uiSchema, formData, idSchema } = state;
  const registry = getRegistry(props);
  const _SchemaField = registry.fields.SchemaField;
  const FormTag: any = tagName ? tagName : 'form';
  if (deprecatedAutocomplete) {
    console.warn('Using autocomplete property of Form is deprecated, use autoComplete instead.');
  }
  const autoComplete = currentAutoComplete ? currentAutoComplete : deprecatedAutocomplete;

  return (
    <FormTag
      className={className ? className : 'rjsf'}
      id={id}
      name={name}
      method={method}
      target={target}
      action={action}
      autoComplete={autoComplete}
      encType={enctype}
      acceptCharset={acceptcharset}
      noValidate={noHtml5Validate}
      ref={formElementRef}
    >
      {renderErrors()}
      <_SchemaField
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={newErrorSchema}
        idSchema={idSchema}
        idPrefix={idPrefix}
        formContext={formContext}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
        autofocus={false}
        required={false}
        name={props.name || ''}
      />
      {children ? (
        children
      ) : (
        <div>
          <button type="submit" className="btn btn-info">
            Submit
          </button>
        </div>
      )}
    </FormTag>
  );
});

const Form = memo(Form1);
export { Form };
