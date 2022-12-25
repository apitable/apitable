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

import { IWidget, widget } from 'core';
import { IRefreshWidgetAction } from './action';
import { UPDATE_WIDGET } from '../../constant';

export function widgetReducer(
  state: IWidget | null = null,
  action: IRefreshWidgetAction): IWidget | null {
  switch (action.type) {
    case UPDATE_WIDGET: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state ? widget(state, action) : null;
    }
  }
}
