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
