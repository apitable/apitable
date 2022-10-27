import { cloneDeep, findIndex, max, min } from 'lodash';
import { groupArray } from 'model/utils';
import { IReduxState, Selectors } from '../../store';
import { getCellIndex, getVisibleColumns, getVisibleRows, getCellUIIndex } from '../../store/selector';

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

const isNumberInRange = (n: number, range: number[]) => {
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
   * 数据坐标系向量 => 数字坐标系范围
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
   * UI 数据坐标系向量 => UI 数字坐标系范围
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
    const visibleRows = Selectors.getVisibleRows(state);
    const visibleColumns = Selectors.getVisibleColumns(state);
    return {
      start: {
        recordId: visibleRows[indexRange.record.min].recordId,
        fieldId: visibleColumns[indexRange.field.min].fieldId,
      },
      end: {
        recordId: visibleRows[indexRange.record.max].recordId,
        fieldId: visibleColumns[indexRange.field.max].fieldId,
      },
    };
  }
  /**
   * 判断单元格是否在选区内。
   * @param cell 单元格
   */
  contains(state: IReduxState, cell: ICell) {
    const currentCell = getCellIndex(state, cell);
    const indexRange = this.getIndexRange(state);
    if (currentCell == null || indexRange == null) return false;

    const recordIndexRange = [
      indexRange.record.min,
      indexRange.record.max,
    ];
    const fieldIndexRange = [
      indexRange.field.min,
      indexRange.field.max,
    ];

    return isNumberInRange(currentCell.recordIndex, recordIndexRange)
      && isNumberInRange(currentCell.fieldIndex, fieldIndexRange);
  }

  /**
   * 根据 hoverCell 计算出填充方向，优先垂直方向。
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
   * 根据填充方向，计算将要填充的区域
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
          start: { recordId: visibleRows[minRecordIndex - 1].recordId, fieldId: visibleColumns[maxFieldIndex].fieldId },
          end: { recordId: hoverCell.recordId, fieldId: visibleColumns[minFieldIndex].fieldId },
        };
      case FillDirection.Below:
        return {
          start: { recordId: visibleRows[maxRecordIndex + 1].recordId, fieldId: visibleColumns[minFieldIndex].fieldId },
          end: { recordId: hoverCell.recordId, fieldId: visibleColumns[maxFieldIndex].fieldId },
        };
      case FillDirection.Right:
        return {
          start: { recordId: visibleRows[minRecordIndex].recordId, fieldId: visibleColumns[maxFieldIndex + 1].fieldId },
          end: { recordId: visibleRows[maxRecordIndex].recordId, fieldId: hoverCell.fieldId },
        };
      case FillDirection.Left:
        return {
          start: { recordId: visibleRows[maxRecordIndex].recordId, fieldId: visibleColumns[minFieldIndex - 1].fieldId },
          end: { recordId: visibleRows[minRecordIndex].recordId, fieldId: hoverCell.fieldId },
        };
    }
  }

  /**
   * 合并连续选区 // FIXME: 判断是否连续，目前只用在选区和填充区。已知二者连续，这里不做检查。
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
        recordId: visibleRows[Math.min(selfIndexRange!.record.min, otherIndexRange!.record.min)].recordId,
        fieldId: visibleColumns[Math.min(selfIndexRange!.field.min, otherIndexRange!.field.min)].fieldId,
      },
      end: {
        recordId: visibleRows[Math.max(selfIndexRange!.record.max, otherIndexRange!.record.max)].recordId,
        fieldId: visibleColumns[Math.max(selfIndexRange!.field.max, otherIndexRange!.field.max)].fieldId,
      },
    };
    return res;
  }

  /**
   * 获取选区内，某个单元格的对角单元格，关于选区中心中心对称。
   * @param state 
   * @param cell 
   */
  getDiagonalCell(state: IReduxState, cell: ICell): ICell | null {
    const indexRange = this.getIndexRange(state);
    if (!indexRange) return null;
    const cellIndex = Selectors.getCellIndex(state, cell);
    if (!cellIndex) return null;
    const diagonalCellIndex = {
      recordIndex: indexRange.record.max - (cellIndex.recordIndex - indexRange.record.min),
      fieldIndex: indexRange.field.max - (cellIndex.fieldIndex - indexRange.field.min),
    };
    return Selectors.getCellByIndex(state, diagonalCellIndex);
  }
  /**
   * 选区移动。
   * @param state 
   * @param direction 
   */
  move(state: IReduxState, direction: RangeDirection, breakpoints: number[] = []): IRange | null {
    const activeCell = Selectors.getActiveCell(state);
    if (!activeCell) return Range.instance;
    const activeCellIndex = Selectors.getCellIndex(state, activeCell)!;
    const indexRange = this.getIndexRange(state);
    if (!indexRange) return Range.instance;
    const newIndexRange = cloneDeep(indexRange);
    const { fieldIndex, recordIndex } = activeCellIndex;
    const minRangeRowIndex = indexRange.record.min;
    const maxRangeRowIndex = indexRange.record.max;
    // (activeCell 处于选区的那个边界, 移动方向) => 扩充/缩小选区。
    const isActiveCellAtRangeRightEdge = fieldIndex === indexRange.field.max;
    const isActiveCellAtRangeUpEdge = recordIndex === minRangeRowIndex;
    const isActiveCellAtRangeDownEdge = recordIndex === maxRangeRowIndex;
    const isUpExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeUpEdge;
    const isDownExpand = minRangeRowIndex === maxRangeRowIndex || !isActiveCellAtRangeDownEdge;

    const visibleRows = Selectors.getVisibleRows(state);
    const visibleColumns = Selectors.getVisibleColumns(state);
    const visibleRowsCount = visibleRows.length;
    const maxFieldIndex = visibleColumns.length - 1;

    /**
     * 针对以下三种情况，无需进行操作：
     * 1. 当前选区已经覆盖第一行，且为向上移动选区
     * 2. 当前选区已经覆盖最后一行，且为向下移动选区
     * 3. 当前选区已经全选，且当前快捷键为全选选区
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

    // 针对分组进行处理
    if (breakpoints.length) {
      const nextBreakpointIndex = findIndex(breakpoints, bp => bp > (isDownExpand ? maxRangeRowIndex : minRangeRowIndex));
      if (nextBreakpointIndex > -1) {
        const nextBreakpoint = breakpoints[nextBreakpointIndex];
        const currentBreakpointIndex = nextBreakpointIndex - 1;
        const currentBreakpoint = breakpoints[currentBreakpointIndex];
        const isGroupRangeUpEdge = currentBreakpoint === minRangeRowIndex; // 选区是否已经覆盖某个分组的上边缘
        const isGroupRangeDownEdge = nextBreakpoint === maxRangeRowIndex + 1; // 选区是否已经覆盖某个分组的下边缘
        // 选区范围是否小于激活单元格所在分组
        const isActiveCellInCurrentGroup = currentBreakpoint <= recordIndex && recordIndex < nextBreakpoint; 
        /**
         * 向上扩展选区，直接落到分组起始位置
         * 向上缩小选区，则落到分组结束位置
         */
        const minRangeOffset = (isUpExpand || (isGroupRangeDownEdge && isActiveCellInCurrentGroup)) ? 0 : -1;
        /**
         * 向下扩展选区，直接落到分组结束位置
         * 向下缩小选区，则落到分组起始位置
         */
        const maxRangeOffset = (isDownExpand || (isGroupRangeUpEdge && isActiveCellInCurrentGroup)) ? -1 : 0;

        minRowIndex = (isGroupRangeUpEdge ? breakpoints[currentBreakpointIndex - 1] + minRangeOffset : currentBreakpoint + minRangeOffset) || 0;
        maxRowIndex = (isGroupRangeDownEdge ? breakpoints[nextBreakpointIndex + 1] + maxRangeOffset : nextBreakpoint + maxRangeOffset) || maxRowIndex;
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
    const rowIndexMap = Selectors.getPureVisibleRowsIndexMap(state);
    const rows = Selectors.getPureVisibleRows(state);
    const columns = Selectors.getVisibleColumns(state);
    const firstFieldId = columns[0].fieldId;
    const lastFieldId = columns[columns.length - 1].fieldId;
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
          recordId: rows[minRowIndex!].recordId,
          fieldId: firstFieldId,
        },
        end: {
          recordId: rows[maxRowIndex!].recordId,
          fieldId: lastFieldId,
        },
      };
    });
    return res;
  }
}

