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

import { utils } from '../core';
import { IThemeProps } from '../core/interface';
import { ArrayFieldTemplate, ErrorList, FieldTemplate, ObjectFieldTemplate } from './template';
import { SelectWidget, TextWidget } from './widget';

const { getDefaultRegistry } = utils;
const { fields, widgets } = getDefaultRegistry();

const vikaWidgets = {
  TextWidget,
  SelectWidget,
  // The key of the custom component should start with lowercase
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
