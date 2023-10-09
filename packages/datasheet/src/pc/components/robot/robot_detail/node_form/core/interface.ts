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
import * as React from 'react';

type ErrorSchema = {
  [k: string]: ErrorSchema;
};

export type IUiSchema = {
  'ui:field'?: IField | string;
  'ui:widget'?: IWidget | string;
  'ui:options'?: { [key: string]: boolean | number | string | object | any[] | null };
  'ui:order'?: string[];
  'ui:FieldTemplate'?: React.ElementType<IFieldTemplateProps>;
  'ui:ArrayFieldTemplate'?: React.ElementType<IArrayFieldTemplateProps>;
  'ui:ObjectFieldTemplate'?: React.ElementType<IObjectFieldTemplateProps>;
  [name: string]: any;
};

export type FieldId = {
  $id: string;
};

export type IdSchema<T = any> = {
  [key in keyof T]: IdSchema<T[key]>;
} & FieldId;

export type IFieldPath = {
  $name: string;
};

export type IPathSchema<T = any> = IFieldPath & {
  [key in keyof T]: IPathSchema<T[key]>;
};

export interface IWidgetProps
  extends Pick<React.HTMLAttributes<HTMLElement>, Exclude<keyof React.HTMLAttributes<HTMLElement>, 'onBlur' | 'onFocus'>> {
  id: string;
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  value: any;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  autofocus: boolean;
  placeholder: string;
  onChange: (value: any) => void;
  options: NonNullable<IUiSchema['ui:options']>;
  formContext: any;
  onBlur: (id: string, value: any) => void;
  onFocus: (id: string, value: any) => void;
  label: string;
  multiple: boolean;
  rawErrors: string[];
  registry: IRegistry;
  [prop: string]: any; // Allow for other props
}

export type IWidget = React.ElementType<IWidgetProps> | React.ComponentClass<IWidgetProps>;

export interface IRangeSpec {
  min?: number;
  max?: number;
  step?: number;
}

export interface IRegistry {
  fields: { [name: string]: IField };
  widgets: { [name: string]: IWidget };
  definitions: { [name: string]: any };
  formContext: any;
  rootSchema: JSONSchema7;
  ArrayFieldTemplate?: React.ElementType<IArrayFieldTemplateProps>;
  ObjectFieldTemplate?: React.ElementType<IObjectFieldTemplateProps>;
  FieldTemplate?: React.ElementType<IFieldTemplateProps>;
}

export interface IFieldProps<T = any>
  extends Pick<React.HTMLAttributes<HTMLElement>, Exclude<keyof React.HTMLAttributes<HTMLElement>, 'onBlur' | 'onFocus'>> {
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  idSchema: IdSchema;
  formData: T;
  errorSchema: ErrorSchema;
  onChange: (e: IChangeEvent<T> | any, es?: ErrorSchema) => any;
  onBlur: (id: string, value: any) => void;
  onFocus: (id: string, value: any) => void;
  registry: IRegistry;
  formContext: any;
  autofocus: boolean;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  [prop: string]: any; // Allow for other props
}

export type IField = React.ElementType<IFieldProps> | React.ComponentClass<IFieldProps>;

export type IFieldTemplateProps<T = any> = {
  id: string;
  classNames: string;
  label: string;
  description: React.ReactElement;
  rawDescription: string;
  children: React.ReactElement;
  errors: React.ReactElement;
  rawErrors: string[];
  help: React.ReactElement;
  rawHelp: string;
  hidden: boolean;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  displayLabel: boolean;
  fields: IField[];
  schema: any;//JSONSchema7;
  uiSchema: IUiSchema;
  formContext: any;
  formData: T;
  onChange: (value: T) => void;
  onKeyChange: (value: string) => () => void;
  onDropPropertyClick: (value: string) => () => void;
  registry: IRegistry;
};

export type IArrayFieldTemplateProps<T = any> = {
  DescriptionField: React.ElementType<{ id: string; description: string | React.ReactElement }>;
  TitleField: React.ElementType<{ id: string; title: string; required: boolean }>;
  canAdd: boolean;
  className: string;
  disabled: boolean;
  idSchema: IdSchema;
  items: {
    children: React.ReactElement;
    className: string;
    disabled: boolean;
    hasMoveDown: boolean;
    hasMoveUp: boolean;
    hasRemove: boolean;
    hasToolbar: boolean;
    index: number;
    onAddIndexClick: (index: number) => (event?: any) => void;
    onDropIndexClick: (index: number) => (event?: any) => void;
    onReorderClick: (index: number, newIndex: number) => (event?: any) => void;
    readonly: boolean;
    key: string;
  }[];
  onAddClick: (event?: any) => void;
  readonly: boolean;
  required: boolean;
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  title: string;
  formContext: any;
  formData: T;
  registry: IRegistry;
};

export type IObjectFieldTemplateProps<T = any> = {
  DescriptionField: React.ElementType<{ id: string; description: string | React.ReactElement }>;
  TitleField: React.ElementType<{ id: string; title: string; required: boolean }>;
  title: string;
  description: string;
  disabled: boolean;
  properties: {
    content: React.ReactElement;
    name: string;
    disabled: boolean;
    readonly: boolean;
    hidden: boolean;
  }[];
  onAddClick: (schema: JSONSchema7) => () => void;
  readonly: boolean;
  required: boolean;
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  idSchema: IdSchema;
  formData: T;
  formContext: any;
  registry: IRegistry;
};

export type AjvError = {
  message: string;
  name: string;
  params: any;
  property: string;
  stack: string;
};

export type IErrorListProps = {
  errorSchema: FormValidation;
  errors: AjvError[];
  formContext: any;
  schema: JSONSchema7;
  uiSchema: IUiSchema;
};

export interface IChangeEvent<T = any> {
  edit: boolean;
  formData: T;
  errors: AjvError[];
  errorSchema: FormValidation;
  idSchema: IdSchema;
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  status?: string;
}

export type ISubmitEvent<T> = IChangeEvent<T>;

export type FieldError = string;

type FieldValidation = {
  __errors: FieldError[];
  addError: (message: string) => void;
};

export type FieldDetailValidation = Record<string, {
  __errors: FieldError[]
}>;
export type ValidationResult = FieldValidation | Partial<FieldDetailValidation>;

type FormValidation = FieldValidation & {
  [fieldName: string]: FieldValidation;
};

// type FormSubmit<T = any> = {
//   formData: T;
// };

export type IThemeProps<T = any> = Omit<IFormProps<T>, 'schema'>;

export interface INodeSchema {
  // Description of the node data type
  schema: JSONSchema7;
  // An extension to IJsonSchema. The ui of the control form, i.e. the uiSchema in the react json schema form,
  // is placed here in the schema of the described data.
  uiSchema?: object;
}

export interface IFormProps<T> {
  acceptcharset?: string;
  action?: string;
  additionalMetaSchemas?: ReadonlyArray<object>;
  ArrayFieldTemplate?: React.ElementType<IArrayFieldTemplateProps>;
  autoComplete?: string;
  autocomplete?: string; // deprecated
  children?: React.ReactNode;
  className?: string;
  customFormats?: { [k: string]: string | RegExp | ((data: string) => boolean) };
  disabled?: boolean;
  readonly?: boolean;
  enctype?: string;
  extraErrors?: any;
  ErrorList?: React.ElementType<IErrorListProps>;
  fields?: { [name: string]: IField };
  FieldTemplate?: React.ElementType<IFieldTemplateProps>;
  formContext?: any;
  formData?: T;
  id?: string;
  idPrefix?: string;
  liveOmit?: boolean;
  liveValidate?: boolean;
  method?: string;
  name?: string;
  validateOnMount?: boolean;
  noHtml5Validate?: boolean;
  noValidate?: boolean;
  ObjectFieldTemplate?: React.ElementType<IObjectFieldTemplateProps>;
  omitExtraData?: boolean;
  onBlur?: (id: string, value: any) => void;
  onChange?: (e: IChangeEvent<T>, es?: ErrorSchema) => any;
  onUpdate?: (e: IChangeEvent<T>) => any;
  onError?: (e: any) => any;
  onFocus?: (id: string, value: any) => void;
  onSubmit?: (e: ISubmitEvent<T>, nativeEvent: React.FormEvent<HTMLFormElement>) => any;
  schema: JSONSchema7;
  showErrorList?: boolean;
  tagName?: keyof JSX.IntrinsicElements | React.ComponentType<React.PropsWithChildren<unknown>>;
  target?: string;
  transformErrors?: (errors: AjvError[]) => AjvError[];
  uiSchema?: IUiSchema;
  validate?: (formData: T, errors: FormValidation) => ValidationResult ;
  widgets?: { [name: string]: IWidget };
  nodeOutputSchemaList?: INodeSchema[];
}

export interface ISchemaFieldProps {
  schema: JSONSchema7;
  uiSchema: IUiSchema;
  idSchema: IdSchema;
  formData: any;
  errorSchema: object;
  registry: IRegistry;
  idPrefix: string;
  name: string;
  onChange: (value: any) => void;
  onKeyChange: (value: any) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onDropPropertyClick: (property: string) => void;
  required: boolean;
  wasPropertyKeyModified: boolean;
  disabled?: boolean;
  readonly?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  autofocus?: boolean;
}
