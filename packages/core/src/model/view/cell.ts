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

import { IReduxState } from '../../exports/store/interfaces';
import { getCellIndex, getCellUIIndex, getCellByIndex } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { getVisibleRows } from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { getVisibleColumns } from 'modules/database/store/selectors/resource/datasheet/calc';
import { ICell } from './range';

export enum CellDirection {
  Up, Down, Left, Right, UpEdge, DownEdge, LeftEdge, RightEdge,
}

export class Cell {

  static instance = new Cell('', '');

  static bindModel(cell: ICell) {
    this.instance.recordId = cell.recordId;
    this.instance.fieldId = cell.fieldId;
    return this.instance;
  }

  constructor(public recordId: string, public fieldId: string) {

  }

  getIndex(state: IReduxState, cell?: ICell) {
    return getCellIndex(state, cell || Cell.instance);
  }

  getUIIndex(state: IReduxState, cell?: ICell) {
    return getCellUIIndex(state, cell || Cell.instance);
  }

  move(state: IReduxState, direction: CellDirection, breakpoints: number[] = []) {
    const columns = getVisibleColumns(state)!;
    const rows = getVisibleRows(state);
    const rowCount = rows.length;
    const maxColumnIndex = columns.length - 1;
    let minRowIndex = 0;
    let maxRowIndex = rowCount - 1;
    let { recordIndex, fieldIndex }: { recordIndex: number, fieldIndex: number } = getCellIndex(state, Cell.instance)!;

    /**
     * No action is required for the following two cases:
     * 1. The active cell is in the first row and needs to be moved up
     * 2. The active cell is in the last row and needs to be moved down
     */
    if (
      ([CellDirection.Up, CellDirection.UpEdge].includes(direction) && recordIndex === 0) ||
      ([CellDirection.Down, CellDirection.DownEdge].includes(direction) && recordIndex === rowCount - 1)
    ) {
      return Cell.instance;
    }

    // process the grouping
    if (breakpoints.length) {
      const nextBreakpointIndex = breakpoints.findIndex(bp => bp > recordIndex);
      if (nextBreakpointIndex > -1) {
        const nextBreakpoint = breakpoints[nextBreakpointIndex]!;
        const currentBreakpoint = breakpoints[nextBreakpointIndex - 1]!;
        minRowIndex = (currentBreakpoint === recordIndex ? breakpoints[nextBreakpointIndex - 2] : currentBreakpoint) || 0;
        maxRowIndex = (nextBreakpoint === recordIndex + 1 ? breakpoints[nextBreakpointIndex + 1]! - 1 : nextBreakpoint - 1) || maxRowIndex;
      }
    }

    switch (direction) {
      case CellDirection.Left:
        fieldIndex--;
        break;
      case CellDirection.Right:
        fieldIndex++;
        break;
      case CellDirection.Up: {
        recordIndex--;
        break;
      }
      case CellDirection.Down: {
        recordIndex++;
        break;
      }
      case CellDirection.LeftEdge:
        fieldIndex = 0;
        break;
      case CellDirection.RightEdge:
        fieldIndex = maxColumnIndex;
        break;
      case CellDirection.UpEdge:
        recordIndex = minRowIndex;
        break;
      case CellDirection.DownEdge:
        recordIndex = maxRowIndex;
        break;
      default: {
        return;
      }
    }
    // If the correction exceeds the boundary, it stays at the boundary.
    if (recordIndex < 0) recordIndex = 0;
    if (recordIndex > rowCount - 1) recordIndex = rowCount - 1;
    if (fieldIndex < 0) fieldIndex = 0;
    if (fieldIndex > maxColumnIndex) fieldIndex = maxColumnIndex;
    return getCellByIndex(state, { recordIndex, fieldIndex });
  }
}