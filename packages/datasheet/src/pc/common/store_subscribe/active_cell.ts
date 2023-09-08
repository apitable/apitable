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

import { cloneDeep } from 'lodash';
import { Field, ICell, ICellValue, Selectors, StoreActions, WhyRecordMoveType } from '@apitable/core';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';

let activeCell: ICell | null | undefined;

store.subscribe(function activeCellChange() {
  const preActiveCell = activeCell;
  const state = store.getState();
  const { viewId, datasheetId } = state.pageParams;
  if (!viewId || !datasheetId) return;
  const activeView = Selectors.getActiveViewId(state);
  if (!activeView) return;

  activeCell = Selectors.getActiveCell(state);
  // Click on the same cell.
  if (preActiveCell && activeCell && preActiveCell.recordId === activeCell.recordId && preActiveCell.fieldId === activeCell.fieldId) {
    return;
  }

  // gridView UI Add a flag to the cache when a record is found to have moved during rendering.
  // When activating a cell horizontally, the presence of a flag is not reported as an active row.
  // gridView UI The activation line change was found in the cache and the cache was deleted.
  if (preActiveCell && activeCell && preActiveCell.recordId === activeCell.recordId) {
    return;
  }
  if (activeCell) {
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    const visibleRowsIndexMap = Selectors.getVisibleRowsIndexMap(state);
    const { recordId, fieldId } = activeCell;
    const visibleRowIndex = visibleRowsIndexMap.get(recordId);
    if (visibleRowIndex == null) {
      return;
    }
    const positionInfo = {
      fieldId,
      recordId,
      visibleRowIndex,
      isInit: false,
    };
    const recordSnapshot = Selectors.getRecordSnapshot(state, datasheetId, recordId);
    if (!recordSnapshot) return;

    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const computeFieldData: { [fieldId: string]: ICellValue } = {};
    const _recordSnapshot = cloneDeep(recordSnapshot);
    Object.entries(fieldMap).forEach((item) => {
      const [fieldId, field] = item;
      // The active row is recorded and the value of the calculated field is stored in recordSnapshot for subsequent pre-sorting comparisons.
      if (Field.bindModel(field).isComputed) {
        computeFieldData[fieldId] = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      }
    });

    _recordSnapshot.recordMap[recordId]!.data = {
      ...recordSnapshot.recordMap[recordId]!.data,
      ...computeFieldData,
    };
    dispatch(
      StoreActions.setActiveRowInfo(datasheetId, {
        type: WhyRecordMoveType.UpdateRecord,
        positionInfo,
        recordSnapshot: _recordSnapshot,
      }),
    );
  }
});
