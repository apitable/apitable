import { ArrayFieldTemplate, ObjectFieldTemplate, FieldTemplate, ErrorList } from './template';
import { ThemeProps } from '@rjsf/core';
import { CheckboxWidget, SelectWidget, CheckboxesWidget, TextWidget, ColorWidget, ToggleButtonWidget } from './widget';
import { utils } from '@rjsf/core';
import { TitleField } from './field';

const { getDefaultRegistry } = utils;
const { fields, widgets } = getDefaultRegistry();

const vikaFields = {
  TitleField,
};

const vikaWidgets = {
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
  fields: { ...fields, ...vikaFields },
  widgets: { ...widgets, ...vikaWidgets },
  ErrorList,
};
