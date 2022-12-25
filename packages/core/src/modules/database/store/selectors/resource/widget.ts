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

import { IReduxState } from '../../../../../exports/store/interfaces';

export const getWidget = (state: IReduxState, id: string) => {
  if (!state.widgetMap) return;
  return state.widgetMap[id]?.widget;
};

export const getWidgetStorageById = (state: IReduxState, id: string): undefined | { [key: string]: any } => {
  const widget = getWidget(state, id);
  if (!widget) { return; }
  return widget.snapshot.storage;
};

export const getWidgetSnapshot = (state: IReduxState, id: string) => { 
  const widget = getWidget(state, id);
  if(!widget) return; 
  return widget.snapshot;
};
