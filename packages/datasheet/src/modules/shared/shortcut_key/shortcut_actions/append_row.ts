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

/**
 * https://www.notion.so/9ac1f271807f4d99a30c1b5cae32437a
 */
import {
  CollaCommandName,
  ExecuteResult,
  Field,
  ICellValue,
  ICollaCommandExecuteResult,
  IRecordCellValue,
  IReduxState,
  Selectors,
  StoreActions,
  ViewType,
} from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record/utils';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';

export enum Direction {
  Up = 'Up',
  Down = 'Down',
}

interface IAppendRowsOption {
  recordId?: string;
  direction?: Direction;
  isDuplicate?: boolean;
  recordData?: { [fieldId: string]: ICellValue } | null;
  count?: number;
}

export function appendRow(option: IAppendRowsOption = {}): Promise<ICollaCommandExecuteResult<string[]>> {
  const state = store.getState();

  const activeCell = Selectors.getActiveCell(state)!;
  const { recordId = activeCell?.recordId, direction = Direction.Down, isDuplicate, recordData, count = 1 } = option;
  const view = Selectors.getCurrentView(state)!;
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const rowsMap = Selectors.getVisibleRowsIndexMap(state);
  const baseRecordIndex = rowsMap.has(recordId) ? rowsMap.get(recordId)! : -1;
  const groupCellValues = getCellValuesForGroupRecord(recordId);
  const executeData: { cellValues?: IRecordCellValue[]; groupCellValues?: ICellValue[] } = {};
  const isSideRecordOpen = state.space.isSideRecordOpen;
  if (isDuplicate) {
    const recordCellValue = getRecordCellValue(state, recordId);
    if (recordCellValue) {
      executeData.cellValues = [recordCellValue];
    }
  }
  if (groupCellValues.length) {
    executeData.groupCellValues = groupCellValues;
  }
  if (recordData != null) {
    const prevCellValues = executeData.cellValues;
    executeData.cellValues = prevCellValues == null ? [recordData] : [{ ...prevCellValues[0], ...recordData }];
  }

  let index = findRowsIndexById(recordId);
  if (direction === Direction.Down) {
    index++;
  }
  //  New record desired position.
  const expectIndex = direction === Direction.Up ? baseRecordIndex : baseRecordIndex + 1;
  dispatch(StoreActions.setNewRecordExpectIndex(datasheetId, expectIndex));

  const result = resourceService.instance!.commandManager.execute<string[]>({
    cmd: CollaCommandName.AddRecords,
    count,
    viewId: view.id,
    index,
    ...executeData,
  });
  dispatch(StoreActions.setNewRecordExpectIndex(datasheetId, null));
  if (result.result === ExecuteResult.Success) {
    const newRecordId = result.data && result.data[0];
    if (newRecordId) {
      dispatch(
        StoreActions.setActiveCell(datasheetId, {
          recordId: newRecordId,
          fieldId: activeCell ? activeCell.fieldId : view.columns[0]!.fieldId,
        }),
      );
      if (isSideRecordOpen) {
        expandRecordIdNavigate(newRecordId);
      }
      // expandRecordRoute(newRecordId);
    } else {
      appendRowCallback(newRecordId!);
    }
  }
  return Promise.resolve(result);
}

export const appendRowCallback = (newRecordId: string) => {
  const state = store.getState();
  const view = Selectors.getCurrentView(state)!;
  const activeCell = Selectors.getActiveCell(state)!;
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const isSideRecordOpen = state.space.isSideRecordOpen;

  // Used to handle shortcuts to add rows and automatically position the activeCell on top of the new record
  /**
   *   The hoverRecordId should be updated after adding to ensure that successive rows
   *   (when using the Quick Add Row component) are always added on top of the latest row
   */
  // Only in grid view
  if (![ViewType.Grid, ViewType.Gantt].includes(view.type)) {
    return;
  }
  dispatch(StoreActions.setHoverRecordId(datasheetId, newRecordId));
  dispatch(
    StoreActions.setActiveCell(datasheetId, {
      recordId: newRecordId,
      fieldId: activeCell ? activeCell.fieldId : view.columns[0]!.fieldId,
    }),
  );
  if (isSideRecordOpen) {
    expandRecordIdNavigate(newRecordId);
  }
};

export const prependRow = async (): Promise<ICollaCommandExecuteResult<string[]>> => {
  return await appendRow({ direction: Direction.Up });
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
    const field = snapshot.meta.fieldMap[groupField.fieldId]!;
    if (!Field.bindModel(field).recordEditable()) {
      return result;
    }
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, groupField.fieldId);
    result.push(cellValue ? cellValue : null);
    return result;
  }, []);
};

// Shortcut to add a record, locate where to add it based on recordId
// Finds the position of the record in the rows of the current view, not in the visibleRows.
export const findRowsIndexById = (recordId: string) => {
  const state = store.getState();
  const view = Selectors.getCurrentView(state)!;
  return view.rows.findIndex((item) => item.recordId === recordId);
};

export const getRecordCellValue = (state: IReduxState, recordId: string) => {
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const recordSnapshot = Selectors.getRecordSnapshot(state, datasheetId, recordId);
  if (recordSnapshot) {
    return recordSnapshot.recordMap[recordId]?.data;
  }
  return null;
};
