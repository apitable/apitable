import { utils } from '../core';
import { IThemeProps } from '../core/interface';
import { ArrayFieldTemplate, ErrorList, FieldTemplate, ObjectFieldTemplate } from './template';
import { SelectWidget, TextWidget } from './widget';

const { getDefaultRegistry } = utils;
const { fields, widgets } = getDefaultRegistry();

const vikaWidgets = {
  TextWidget,
  SelectWidget,
  // 自定义组件的 key 要以小写开头
  // toggleButtonWidget: ToggleButtonWidget,
};

export const theme: IThemeProps = {
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  FieldTemplate,
  fields,
  widgets: { ...widgets, ...vikaWidgets },
  ErrorList,
};
