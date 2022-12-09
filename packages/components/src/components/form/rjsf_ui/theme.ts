import { ArrayFieldTemplate, ObjectFieldTemplate, FieldTemplate, ErrorList } from './template';
import { ThemeProps } from '@rjsf/core';
import { CheckboxWidget, SelectWidget, CheckboxesWidget, TextWidget, ColorWidget, ToggleButtonWidget } from './widget';
import { utils } from '@rjsf/core';
import { TitleField } from './field';

const { getDefaultRegistry } = utils;
const { fields, widgets } = getDefaultRegistry();

const _fields = {
  TitleField,
};

const _widgets = {
  TextWidget,
  CheckboxWidget,
  SelectWidget,
  CheckboxesWidget,
  ColorWidget,
  // The key of the custom component should start with lower case
  toggleButtonWidget: ToggleButtonWidget,
};

export const theme: ThemeProps = {
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  FieldTemplate,
  fields: { ...fields, ..._fields },
  widgets: { ...widgets, ..._widgets },
  ErrorList,
};
