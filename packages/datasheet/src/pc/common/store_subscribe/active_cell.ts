import { Field, ICell, ICellValue, Selectors, StoreActions, WhyRecordMoveType } from '@apitable/core';
import { cloneDeep } from 'lodash';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';

let activeCell: ICell | null | undefined;

store.subscribe(function activeCellChange() {
  const preActiveCell = activeCell;
  const state = store.getState();
  const { viewId, datasheetId } = state.pageParams;
  if (!viewId || !datasheetId) return;
  const activeView = Selectors.getActiveView(state);
  if (!activeView) return;

  activeCell = Selectors.getActiveCell(state);
  // Click on the same cell.
  if (
    preActiveCell && activeCell
    && preActiveCell.recordId === activeCell.recordId
    && preActiveCell.fieldId === activeCell.fieldId
  ) {
    return;
  }

  // gridView UI Add a flag to the cache when a record is found to have moved during rendering.
  // When activating a cell horizontally, the presence of a flag is not reported as an active row.
  // gridView UI The activation line change was found in the cache and the cache was deleted.
  if (
    preActiveCell && activeCell &&
    preActiveCell.recordId === activeCell.recordId
  ) {
    return;
  }
  if (activeCell) {
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    const visibleRows = Selectors.getPureVisibleRows(state);
    const visibleRowsIndexMap = Selectors.getVisibleRowsIndexMapBase(visibleRows);
    const { recordId, fieldId } = activeCell;
    const visibleRowIndex = visibleRowsIndexMap.get(recordId);
    if (visibleRowIndex == null) {
      return ;
    }
    const positionInfo = {
      fieldId,
      recordId,
      visibleRowIndex,
      isInit: false,
    };
    const recordSnapshot = Selectors.getRecordSnapshot(state, recordId);
    if (!recordSnapshot) return;

    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const computeFieldData: { [fieldId: string]: ICellValue } = {};
    const _recordSnapshot = cloneDeep(recordSnapshot);
    Object.entries(fieldMap).forEach(item => {
      const [fieldId, field] = item;
      // The active row is recorded and the value of the calculated field is stored in recordSnapshot for subsequent pre-sorting comparisons.
      if (Field.bindModel(field).isComputed) {
        computeFieldData[fieldId] = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      }
    });

    _recordSnapshot.recordMap[recordId].data = {
      ...recordSnapshot.recordMap[recordId].data,
      ...computeFieldData,
    };
    dispatch(StoreActions.setActiveRowInfo(datasheetId, {
      type: WhyRecordMoveType.UpdateRecord,
      positionInfo, recordSnapshot: _recordSnapshot,
    }));
  }
});
