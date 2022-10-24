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
  // 点击相同单元格。
  if (
    preActiveCell && activeCell
    && preActiveCell.recordId === activeCell.recordId
    && preActiveCell.fieldId === activeCell.fieldId
  ) {
    return;
  }

  // gridView UI 在渲染时发现记录移动了，向缓存中添加 flag。
  // 横向激活单元格时，发现存在 flag 则不再上报激活行信息。
  // gridView UI 中发现激活行变化，删除缓存。
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
      // 记录下激活行，计算字段的值存储在 recordSnapshot 中，用于后续预排序比较。
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
