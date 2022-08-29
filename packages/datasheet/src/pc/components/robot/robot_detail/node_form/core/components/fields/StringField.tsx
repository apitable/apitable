import { IFieldProps } from '../../interface';

import {
  getWidget,
  getUiOptions,
  isSelect,
  optionsList,
  getDefaultRegistry,
  hasWidget,
} from '../../utils';

export function StringField(props: IFieldProps) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    registry = getDefaultRegistry(),
    rawErrors,
  } = props;
  const { title, format } = schema;
  const { widgets, formContext } = registry;
  const enumOptions = isSelect(schema) && optionsList(schema);
  let defaultWidget = enumOptions ? 'select' : 'text';
  if (format && hasWidget(schema, format, widgets)) {
    defaultWidget = format;
  }
  const { widget = defaultWidget, placeholder = '', ...options } = getUiOptions(uiSchema)!;
  const Widget = getWidget(schema, widget as any, widgets as any) as any;
  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      uiSchema={uiSchema}
      id={idSchema && idSchema.$id}
      label={title === undefined ? name : title}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      placeholder={placeholder}
      rawErrors={rawErrors}
    />
  );
}

export default StringField;
