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

import { IReduxState, Selectors } from 'exports/store';
import { IViewInfo } from '../logic';

export const mockGetViewInfo = (dstId: string, viewId: string) => (state: IReduxState): IViewInfo | null => {
  const snapshot = Selectors.getSnapshot(state, dstId)!;
  const view = snapshot.meta.views.find(view => view.id === viewId);
  if (view) {
    return {
      viewId,
      type: view.type,
      name: view.name,
      rows: view.rows,
      columns: view.columns,
      fieldMap: snapshot.meta.fieldMap,
    };
  }
  return null;
};
