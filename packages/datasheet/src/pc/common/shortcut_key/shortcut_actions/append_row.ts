/**
 * https://www.notion.so/vikadata/9ac1f271807f4d99a30c1b5cae32437a
 */
import { CollaCommandName, ExecuteResult, Field, ICellValue, IReduxState, Selectors, StoreActions, ViewType } from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';

export enum Direction {
  Up = 'Up',
  Down = 'Down'
}

interface IAppendRowsOption {
  recordId?: string;
  direction?: Direction;
  isDuplicate?: boolean;
  recordData?: { [fieldId: string]: ICellValue } | null;
  count?: number;
}

export function appendRow(option: IAppendRowsOption = {}) {
  const state = store.getState();
  const activeCell = Selectors.getActiveCell(state)!;
  const { 
    recordId = activeCell?.recordId, 
    direction = Direction.Down, 
    isDuplicate, 
    recordData, 
    count = 1 
  } = option;
  const view = Selectors.getCurrentView(state)!;
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const rowsMap = Selectors.getVisibleRowsIndexMap(state);
  const baseRecordIndex = rowsMap.has(recordId) ? rowsMap.get(recordId)! : -1;
  const groupCellValues = getCellValuesForGroupRecord(recordId) as ICellValue[];
  const executeData = {};
  const isSideRecordOpen = state.space.isSideRecordOpen;
  if (isDuplicate) {
    const recordCellValue = getRecordCellValue(state, recordId);
    if (recordCellValue) {
      executeData['cellValues'] = [recordCellValue];
    }
  }
  if (groupCellValues.length) {
    executeData['groupCellValues'] = groupCellValues;
  }
  if (recordData != null) {
    const prevCellValues = executeData['cellValues'];
    executeData['cellValues'] = prevCellValues == null ? [recordData] : [{ ...prevCellValues[0], ...recordData }];
  }

  const collaCommandManager = resourceService.instance!.commandManager;
  let index = findRowsIndexById(recordId);
  if (direction === Direction.Down) {
    index++;
  }
  // 新记录期望的位置。
  const expectIndex = direction === Direction.Up ? baseRecordIndex : baseRecordIndex + 1;
  dispatch(StoreActions.setNewRecordExpectIndex(datasheetId, expectIndex));

  const result = collaCommandManager.execute({
    cmd: CollaCommandName.AddRecords,
    count,
    viewId: view.id,
    index,
    ...executeData,
  });
  dispatch(StoreActions.setNewRecordExpectIndex(datasheetId, null));
  if (
    result.result === ExecuteResult.Success
  ) {
    const newRecordId = result.data && result.data[0];
    if (newRecordId) {
      dispatch(
        StoreActions.setActiveCell(datasheetId, {
          recordId: newRecordId,
          fieldId: activeCell ? activeCell.fieldId : view.columns[0].fieldId,
        }),
      );
      if (isSideRecordOpen) {
        expandRecordIdNavigate(newRecordId);
      }
      // expandRecordRoute(newRecordId);
    } else {
      appendRowCallback(newRecordId);
    }
  }
  return result;
}

export const appendRowCallback = (newRecordId: string) => {
  const state = store.getState();
  const view = Selectors.getCurrentView(state)!;
  const activeCell = Selectors.getActiveCell(state)!;
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const isSideRecordOpen = state.space.isSideRecordOpen;

  // 用于处理快捷键添加行，自动将activeCell定位到新的record上面
  // 添加完后应当更新hoverRecordId，保证连续添加行的情况（使用快速添加行组件时）一直是添加在最新行的上方
  // 仅在 grid 视图下
  if (![ViewType.Grid, ViewType.Gantt].includes(view.type)) {
    return;
  }
  dispatch(StoreActions.setHoverRecordId(datasheetId, newRecordId));
  dispatch(
    StoreActions.setActiveCell(datasheetId, {
      recordId: newRecordId,
      fieldId: activeCell ? activeCell.fieldId : view.columns[0].fieldId,
    }),
  );
  if (isSideRecordOpen) {
    expandRecordIdNavigate(newRecordId);
  }
};

export const prependRow = () => {
  appendRow({ direction: Direction.Up });
};

export const getCellValuesForGroupRecord = (recordId?: string) => {
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state)!;
  const groupInfo = Selectors.getActiveViewGroupInfo(state)!;
  const withCellValue = Boolean(groupInfo.length);
  if (!recordId || !withCellValue) {
    return [];
  }

  return groupInfo.reduce<ICellValue[]>((result, groupField) => {
    const field = snapshot.meta.fieldMap[groupField.fieldId];
    if (!Field.bindModel(field).recordEditable()) {
      return result;
    }
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, groupField.fieldId);
    result.push(cellValue ? cellValue : null);
    return result;
  }, []);
};

// 快捷键添加record，根据 recordId 定位添加的位置
// 查找记录在当前视图的 rows 中的位置，而不是 visibleRows 中的位置。
export const findRowsIndexById = (recordId: string) => {
  const state = store.getState();
  const view = Selectors.getCurrentView(state)!;
  return view.rows.findIndex(item => item.recordId === recordId);
};

export const getRecordCellValue = (state: IReduxState, recordId: string) => {
  const recordSnapshot = Selectors.getRecordSnapshot(state, recordId);
  if (recordSnapshot) {
    return recordSnapshot.recordMap[recordId].data;
  }
  return null;
};
