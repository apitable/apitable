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

import { cloneDeep, findIndex, max, min } from 'lodash';
import { groupArray } from 'model/utils';
import { IReduxState } from 'exports/store/interfaces';
import { getVisibleRows, getPureVisibleRows, getPureVisibleRowsIndexMap } from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { getVisibleColumns } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getCellUIIndex,getCellIndex, getCellByIndex } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { getActiveCell } from 'modules/database/store/selectors/resource/datasheet/base';
/**
 * cell row / column UUID
 */
export interface ICell {
  /**
   * cell row UUID
   */
  recordId: string;
   /**
    * cell column UUID
    */
  fieldId: string;
}

export interface IRange {
  start: ICell;
  end: ICell;
}

export interface IIndexRange {
  record: {
    min: number;
    max: number;
  };
  field: {
    min: number;
    max: number;
  };
}

export type IRecordRanges = string[];

export type IFieldRanges = string[];

export enum FillDirection {
  Left = 'left',
  Right = 'right',
  Below = 'below',
  Top = 'top',
}

export enum RangeDirection {
  Up,
  Down,
  Left,
  Right,
  UpEdge,
  DownEdge,
  LeftEdge,
  RightEdge,
  All,
}

const EMPTY_CELL = { recordId: '', fieldId: '' };

const isNumberInRange = (n: number, range: readonly [number, number]) => {
  const [min, max] = range;
  if (n < min || n > max) return false;
  return true;
};

/**
 * select are range judgement
 */
export class Range {

  static instance = new Range(EMPTY_CELL, EMPTY_CELL);

  static bindModel(range?: IRange) {
    if (range) {
      this.instance.start = range.start;
      this.instance.end = range.end;
    }
    return this.instance;
  }

  constructor(public start: ICell, public end: ICell) {
  }

  toNumberBaseRange(state: IReduxState) {
    const rangeIndex = this.getIndexRange(state);
    if (!rangeIndex) return null;
    return {
      row: rangeIndex.record.min,
      rowCount: rangeIndex.record.max - rangeIndex.record.min + 1,
      column: rangeIndex.field.min,
      columnCount: rangeIndex.field.max - rangeIndex.field.min + 1,
    };
  }
  /**
   * data coordinate system vector => numeric coordinate system range
   * @param state
   */
  getIndexRange(state: IReduxState, range?: IRange): IIndexRange | null {
    const { start, end } = range || Range.instance;
    const startCellIndex = getCellIndex(state, start);
    const endCellIndex = getCellIndex(state, end);
    if (startCellIndex == null || endCellIndex == null) return null;

    return {
      record: {
        min: Math.min(startCellIndex.recordIndex, endCellIndex.recordIndex),
        max: Math.max(startCellIndex.recordIndex, endCellIndex.recordIndex),
      },
      field: {
        min: Math.min(startCellIndex.fieldIndex, endCellIndex.fieldIndex),
        max: Math.max(startCellIndex.fieldIndex, endCellIndex.fieldIndex),
      },
    };
  }

  /**
   * UI data coordinate system vector => UI digital coordinate system range
   * @param state
   * @param range
   */
  getUIIndexRange(state: IReduxState, range?: IRange): IIndexRange | null {
    const { start, end } = range || Range.instance;
    const startCellIndex = getCellUIIndex(state, start);
    const endCellIndex = getCellUIIndex(state, end);
    if (startCellIndex == null || endCellIndex == null) return null;

    return {
      record: {
        min: Math.min(startCellIndex.rowIndex, endCellIndex.rowIndex),
        max: Math.max(startCellIndex.rowIndex, endCellIndex.rowIndex),
      },
      field: {
        min: Math.min(startCellIndex.columnIndex, endCellIndex.columnIndex),
        max: Math.max(startCellIndex.columnIndex, endCellIndex.columnIndex),
      },
    };
  }

  getCellRange(state: IReduxState, indexRange: IIndexRange): IRange {
    const visibleRows = getVisibleRows(state);
    const visibleColumns = getVisibleColumns(state);
    return {
      start: {
        recordId: visibleRows[indexRange.record.min]!.recordId,
        fieldId: visibleColumns[indexRange.field.min]!.fieldId,
      },
      end: {
        recordId: visibleRows[indexRange.record.max]!.recordId,
        fieldId: visibleColumns[indexRange.field.max]!.fieldId,
      },
    };
  }
  /**
   * Determine whether the cell is in the selection area.
   * @param cell cell
   */
  contains(state: IReduxState, cell: ICell) {
    const currentCell = getCellIndex(state, cell);
    const indexRange = this.getIndexRange(state);
    if (currentCell == null || indexRange == null) return false;

    const recordIndexRange = [
      indexRange.record.min,
      indexRange.record.max,
    ] as const;
    const fieldIndexRange = [
      indexRange.field.min,
      indexRange.field.max,
    ] as const;

    return isNumberInRange(currentCell.recordIndex, recordIndexRange)
      && isNumberInRange(currentCell.fieldIndex, fieldIndexRange);
  }

  /**
   * Calculate the filling direction according to the hoverCell, and give priority to the vertical direction.
   * @param state
   * @param hoverCell
   */
  getDirection(state: IReduxState, hoverCell: ICell): FillDirection | null {
    const hoverCellIndex = getCellIndex(state, hoverCell)!;
    const indexRange = this.getIndexRange(state);

    if (hoverCellIndex == null || indexRange == null) return null;

    const [minRecordIndex, maxRecordIndex] = [
      indexRange.record.min,
      indexRange.record.max,
    ];
    const [minFieldIndex, maxFieldIndex] = [
      indexRange.field.min,
      indexRange.field.max,
    ];

    if (hoverCellIndex.recordIndex < minRecordIndex) return FillDirection.Top;
    if (hoverCellIndex.recordIndex > maxRecordIndex) return FillDirection.Below;
    if (hoverCellIndex.fieldIndex < minFieldIndex) return FillDirection.Left;
    if (hoverCellIndex.fieldIndex > maxFieldIndex) return FillDirection.Right;
    return null;
  }

  /**
   * Calculate the area to be filled according to the filling direction
   * @param state
   * @param direction
   */
  getFillRange(state: IReduxState, hoverCell: ICell, direction: FillDirection): IRange | null {
    const indexRange = this.getIndexRange(state);
    const visibleRows = getVisibleRows(state);
    const visibleColumns = getVisibleColumns(state);
    if (!indexRange) return null;
    const [minRecordIndex, maxRecordIndex] = [
      indexRange.record.min,
      indexRange.record.max,
    ];
    const [minFieldIndex, maxFieldIndex] = [
      indexRange.field.min,
      indexRange.field.max,
    ];

    switch (direction) {
      case FillDirection.Top:
        return {
          start: { recordId: visibleRows[minRecordIndex - 1]!.recordId, fieldId: visibleColumns[maxFieldIndex]!.fieldId },
          end: { recordId: hoverCell.recordId, fieldId: visibleColumns[minFieldIndex]!.fieldId },
        };
      case FillDirection.Below:
        return {
          start: { recordId: visibleRows[maxRecordIndex + 1]!.recordId, fieldId: visibleColumns[minFieldIndex]!.fieldId },
          end: { recordId: hoverCell.recordId, fieldId: visibleColumns[maxFieldIndex]!.fieldId },
        };
      case FillDirection.Right:
        return {
          start: { recordId: visibleRows[minRecordIndex]!.recordId, fieldId: visibleColumns[maxFieldIndex + 1]!.fieldId },
          end: { recordId: visibleRows[maxRecordIndex]!.recordId, fieldId: hoverCell.fieldId },
        };
      case FillDirection.Left:
        return {
          start: { recordId: visibleRows[maxRecordIndex]!.recordId, fieldId: visibleColumns[minFieldIndex - 1]!.fieldId },
          end: { recordId: visibleRows[minRecordIndex]!.recordId, fieldId: hoverCell.fieldId },
        };
    }
  }

  /**
   * Merge continuous selection
   *
   * FIXME: Determine whether it is continuous, currently only used in selection and fill area.
   *   It is known that the two are continuous, so there is no check here.
   *
   * @param state
   * @param ranges
   */
  combine(state: IReduxState, range: IRange) {
    const selfIndexRange = this.getIndexRange(state);
    const otherIndexRange = this.getIndexRange(state, range);
    if (selfIndexRange && !otherIndexRange) return Range.instance;
    if (!selfIndexRange && otherIndexRange) return range;
    if (!selfIndexRange && !otherIndexRange) return null;
    const visibleRows = getVisibleRows(state);
    const visibleColumns = getVisibleColumns(state);

    const res = {
      start: {
        recordId: visibleRows[Math.min(selfIndexRange!.record.min, otherIndexRange!.record.min)]!.recordId,
        fieldId: visibleColumns[Math.min(selfIndexRange!.field.min, otherIndexRange!.field.min)]!.fieldId,
      },
      end: {
        recordId: visibleRows[Math.max(selfIndexRange!.record.max, otherIndexRange!.record.max)]!.recordId,
        fieldId: visibleColumns[Math.max(selfIndexRange!.field.max, otherIndexRange!.field.max)]!.fieldId,
      },
    };
    return res;
  }

  /**
   * Get the diagonal cells of a cell in the selection area, symmetrical about the center of the selection area.
   * @param state
   * @param cell
   */
  getDiagonalCell(state: IReduxState, cell: ICell): ICell | null {
    const indexRange = this.getIndexRange(state);
    if (!indexRange) return null;
    const cellIndex = getCellIndex(state, cell);
    if (!cellIndex) return null;
    const diagonalCellIndex = {
      recordIndex: indexRange.record.max - (cellIndex.recordIndex - indexRange.record.min),
      fieldIndex: indexRange.field.max - (cellIndex.fieldIndex - indexRange.field.min),
    };
    return getCellByIndex(state, diagonalCellIndex);
  }
  /**
   * Selection movement.
   * @param state
   * @param direction
   */
  move(state: IReduxState, direction: RangeDirection, breakpoints: number[] = []): IRange | null {
    const activeCell = getActiveCell(state);
    if (!activeCell) return Range.instance;
    const activeCellIndex = getCellIndex(state, activeCell)!;
    const indexRange = this.getIndexRange(state);
    if (!indexRange) return Range.instance;
    const newIndexRange = cloneDeep(indexRange);
    const { fieldIndex, recordIndex } = activeCellIndex;
    const minRangeRowIndex = indexRange.record.min;
    const maxRangeRowIndex = indexRange.record.max;
    // (activeCell is at the border of the selection, moving direction) => expand/reduce the selection.
    const isActiveCellAtRangeRightEdge = fieldIndex === indexRange.field.max;
    const isActiveCellAtRangeUpEdge = recordIndex === minRangeRowIndex;
    const isActiveCellAtRangeDownEdge = recordIndex === maxRangeRowIndex;
    const isUpExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeUpEdge;
    const isDownExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeDownEdge;

    const visibleRows = getVisibleRows(state);
    const visibleColumns = getVisibleColumns(state);
    const visibleRowsCount = visibleRows.length;
    const maxFieldIndex = visibleColumns.length - 1;

    /**
     * No action is required for the following three situations:
      * 1. The current selection has covered the first row, and the selection is moved up
      * 2. The current selection has covered the last line, and the selection is moved down
      * 3. The current selection has been selected, and the current shortcut key is the selection of all selections
     */
    if (
      (direction === RangeDirection.All && (minRangeRowIndex === 0 && maxRangeRowIndex === visibleRowsCount - 1)) ||
      ([RangeDirection.Up, RangeDirection.UpEdge].includes(direction) && minRangeRowIndex === 0 && isUpExpand) ||
      ([RangeDirection.Down, RangeDirection.DownEdge].includes(direction) && maxRangeRowIndex === visibleRowsCount - 1 && isDownExpand)
    ) {
      return Range.instance;
    }

    let minRowIndex = 0;
    let maxRowIndex = visibleRowsCount - 1;
    let minRowIndexInAllRange = 0;
    let maxRowIndexInAllRange = visibleRowsCount - 1;

    // process the grouping
    if (breakpoints.length) {
      const nextBreakpointIndex = findIndex(breakpoints, bp => bp > (isDownExpand ? maxRangeRowIndex : minRangeRowIndex));
      if (nextBreakpointIndex > -1) {
        const nextBreakpoint = breakpoints[nextBreakpointIndex]!;
        const currentBreakpointIndex = nextBreakpointIndex - 1;
        const currentBreakpoint = breakpoints[currentBreakpointIndex]!;
        const isGroupRangeUpEdge = currentBreakpoint === minRangeRowIndex; // Whether the selection has covered the top edge of a group
        const isGroupRangeDownEdge = nextBreakpoint === maxRangeRowIndex + 1; // Whether the selection has covered the bottom edge of a group
        // Whether the selection range is smaller than the group where the active cell is located
        const isActiveCellInCurrentGroup = currentBreakpoint <= recordIndex && recordIndex < nextBreakpoint;
        /**
         * Expand the selection area up and drop directly to the starting position of the group
         * Narrow the selection up to the end of the group
         */
        const minRangeOffset = (isUpExpand || (isGroupRangeDownEdge && isActiveCellInCurrentGroup)) ? 0 : -1;
        /**
         * Extend the selection down, directly to the end of the group
         * Reduce the selection area down, then it falls to the starting position of the group
         */
        const maxRangeOffset = (isDownExpand || (isGroupRangeUpEdge && isActiveCellInCurrentGroup)) ? -1 : 0;

        minRowIndex = (isGroupRangeUpEdge ? breakpoints[currentBreakpointIndex - 1]! + minRangeOffset : currentBreakpoint + minRangeOffset) || 0;
        maxRowIndex = (isGroupRangeDownEdge ? breakpoints[nextBreakpointIndex + 1]! + maxRangeOffset : nextBreakpoint + maxRangeOffset) || maxRowIndex;
        minRowIndexInAllRange = (isGroupRangeUpEdge && isGroupRangeDownEdge) ? 0 : currentBreakpoint;
        maxRowIndexInAllRange = (isGroupRangeUpEdge && isGroupRangeDownEdge) ? visibleRowsCount - 1 : nextBreakpoint - 1;
      }
    }

    switch (direction) {
      case RangeDirection.Up:
        if (isActiveCellAtRangeDownEdge) {
          newIndexRange.record.min--;
          break;
        }
        newIndexRange.record.max--;
        break;
      case RangeDirection.UpEdge:
        newIndexRange.record.min = minRowIndex;
        if (!isActiveCellAtRangeDownEdge) {
          newIndexRange.record.max = recordIndex;
        }
        break;
      case RangeDirection.Down:
        if (isActiveCellAtRangeDownEdge) {
          newIndexRange.record.min++;
          break;
        }
        newIndexRange.record.max++;
        break;
      case RangeDirection.DownEdge:
        newIndexRange.record.max = maxRowIndex;
        if (isActiveCellAtRangeDownEdge) {
          newIndexRange.record.min = recordIndex;
        }
        break;
      case RangeDirection.Left:
        if (isActiveCellAtRangeRightEdge) {
          newIndexRange.field.min--;
          break;
        }
        newIndexRange.field.max--;
        break;
      case RangeDirection.LeftEdge:
        newIndexRange.field.min = 0;
        if (!isActiveCellAtRangeRightEdge) {
          newIndexRange.field.max = fieldIndex;
          break;
        }
        break;
      case RangeDirection.Right:
        if (isActiveCellAtRangeRightEdge) {
          newIndexRange.field.min++;
          break;
        }
        newIndexRange.field.max++;
        break;
      case RangeDirection.RightEdge:
        newIndexRange.field.max = maxFieldIndex;
        if (isActiveCellAtRangeRightEdge) {
          newIndexRange.field.min = fieldIndex;
        }
        break;
      case RangeDirection.All:
        newIndexRange.field.min = 0;
        newIndexRange.field.max = maxFieldIndex;
        newIndexRange.record.min = minRowIndexInAllRange;
        newIndexRange.record.max = maxRowIndexInAllRange;
        break;
    }
    // to fix
    newIndexRange.field.min = Math.max(newIndexRange.field.min, 0);
    newIndexRange.field.max = Math.min(newIndexRange.field.max, maxFieldIndex);
    newIndexRange.record.min = Math.max(newIndexRange.record.min, 0);
    newIndexRange.record.max = Math.min(newIndexRange.record.max, visibleRowsCount - 1);
    return this.getCellRange(state, newIndexRange);
  }

  /**
   * selected records is non-sequence area, convert it to sequence area with multi IRange format
   *
   * @param state
   * @param recordIds
   */
  static selectRecord2Ranges(state: IReduxState, recordIds: string[]): IRange[] {
    const rowIndexMap = getPureVisibleRowsIndexMap(state);
    const rows = getPureVisibleRows(state);
    const columns = getVisibleColumns(state);
    const firstFieldId = columns[0]!.fieldId;
    const lastFieldId = columns[columns.length - 1]!.fieldId;
    const sortedRowIndexList = recordIds
      .reduce((acc, recordId) => {
        if (rowIndexMap.has(recordId)) {
          acc.push(rowIndexMap.get(recordId)!);
        }
        return acc;
      }, [] as number[])
      .sort((a, b) => {
        return a - b;
      });
    const rowIndexRanges = groupArray(sortedRowIndexList);
    const res = rowIndexRanges.map(rowIndexRange => {
      const minRowIndex = min(rowIndexRange);
      const maxRowIndex = max(rowIndexRange);
      return {
        start: {
          recordId: rows[minRowIndex!]!.recordId,
          fieldId: firstFieldId,
        },
        end: {
          recordId: rows[maxRowIndex!]!.recordId,
          fieldId: lastFieldId,
        },
      };
    });
    return res;
  }
}

