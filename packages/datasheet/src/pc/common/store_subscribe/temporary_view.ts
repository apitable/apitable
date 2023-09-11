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

import { difference, isEqual } from 'lodash';
import { IFieldMap, IViewColumn, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';

let mirrorId: string | undefined;
let fieldMap: IFieldMap | undefined;

store.subscribe(function TemplateChange() {
  const state = store.getState();
  const pageParams = state.pageParams;

  if (!pageParams.mirrorId) {
    // store The user does not have to care about changes to the cached data if they are not in the mirror
    return;
  }

  const previousMirrorId = mirrorId;
  mirrorId = pageParams.mirrorId;
  const mirror = Selectors.getMirror(state, mirrorId!)!;

  if ((!previousMirrorId && mirrorId) || (previousMirrorId && mirrorId && previousMirrorId !== mirrorId)) {
    return;
  }

  if (previousMirrorId && mirrorId && previousMirrorId === mirrorId) {
    if (!mirror || !mirror.temporaryView) {
      // No mirror means it's the first time you've entered the mirror, so keep the mirror and the original view in sync.
      // The logic is the same without the temporaryView
      return;
    }
    const previousFieldMap = fieldMap;
    fieldMap = Selectors.getFieldMap(state, mirror.sourceInfo.datasheetId)!;
    if (!previousFieldMap) {
      return;
    }

    if (isEqual(Object.keys(previousFieldMap), Object.keys(fieldMap))) {
      return;
    }

    fillColumns(fieldMap, mirror.temporaryView.columns!, mirrorId);
  }
});

function fillColumns(fieldMap: IFieldMap, columns: IViewColumn[], mirrorId: string) {
  const fieldMapKeys = Object.keys(fieldMap);
  const columnsIds = (columns as IViewColumn[]).map((column) => {
    return column.fieldId;
  });
  const deleteIds = difference(columnsIds, fieldMapKeys);
  const insertIds = difference(fieldMapKeys, columnsIds);
  let _columns = [...columns];

  if (deleteIds.length) {
    // Filtering deleted columns
    _columns = _columns.filter((column) => {
      return !deleteIds.includes(column.fieldId);
    });
  }

  if (insertIds.length) {
    // New column
    insertIds.map((id) => {
      _columns.push({
        fieldId: id,
      });
    });
  }
  store.dispatch(StoreActions.cacheTemporaryView({ columns: _columns }, mirrorId));
}
