import { IReduxState, ISnapshot, IStandardValueTable, IViewColumn, IViewRow } from 'exports/store/interfaces';
import { isObject } from 'lodash';
import { Field } from 'model/field';
import { ICell, IRange } from 'model/view';
import { Group } from 'model/view/group';
import { Range } from 'model/view/range';
import { CellType } from 'modules/shared/store/constants';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { IStandardValue } from 'types';
import { getDatasheet, getDatasheetClient } from './base';
import { getActiveViewGroupInfo, getCurrentView, getVisibleColumnCount, getVisibleColumns, getVisibleColumnsMap } from './calc';
import { getGroupBreakpoint, getLinearRowsIndexMap, getVisibleRows, getVisibleRowsIndexMap } from './rows_calc';
import { getCellValue } from './cell_calc';

/**
 *
 * Field class needs to depend on the root state to calculate,
 * we need to pass the root state to the selector,
 * but we don't want to break the selector cache.
 *
 * consider most cases, memorize the root state as a parameter is meaningless,
 * so we make an assumption here,
 * if the user passes the root state as a parameter,
 * then the memoize function never checks its change.
 */
const createSelectorIgnoreState = createSelectorCreator(defaultMemoize, (pre, next) => {
  // if compare to root state, always return true
  if (isObject(pre) && isObject(next) && 'isStateRoot' in pre && 'isStateRoot' in next) {
    return true;
  }
  // common reference comparison
  return pre === next;
});

// TODO: memory special attention
const getStdValueMatrixFromIds = (state: IReduxState, snapshot: ISnapshot, ids: { rows: IViewRow[]; columns: IViewColumn[] }): IStandardValue[][] => {
  const { rows, columns } = ids;
  return rows.map(row => {
    const recordId = row.recordId;
    return columns.map(column => {
      const fieldId = column.fieldId;
      const field = snapshot.meta.fieldMap[fieldId]!;
      const cellValue = getCellValue(state, snapshot, recordId, fieldId);
      return Field.bindContext(field, state).cellValueToStdValue(cellValue);
    });
  });
};

const getCellMatrix = (rows: IViewRow[], columns: IViewColumn[]): ICell[][] => {
  return rows.map(row => {
    const recordId = row.recordId;
    return columns.map(column => {
      const fieldId = column.fieldId;
      return { recordId, fieldId };
    });
  });
};

export const getRangeRecords = (state: IReduxState, range: IRange): IViewRow[] | null => {
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const rowSlice = [rangeIndex.record.min, rangeIndex.record.max + 1];
  const rows = getVisibleRows(state);
  return rows.slice(...rowSlice);
};

export const isCellVisible = (state: IReduxState, cell: ICell) => {
  const visibleRowIndexMap = getVisibleRowsIndexMap(state);
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  return visibleRowIndexMap.has(cell.recordId) && visibleColumnIndexMap.has(cell.fieldId);
};

export const getSelection = (state: IReduxState) => {
  const client = getDatasheetClient(state);
  const selection = client && client.selection;

  // whether activeCell move out
  if (selection && selection.activeCell && !isCellVisible(state, selection.activeCell)) {
    return null;
  }
  // the start of the selection area and the end of the selection area are removed
  if (selection && selection.ranges) {
    const { start, end } = selection.ranges[0]!;
    if (!isCellVisible(state, start) || !isCellVisible(state, end)) {
      return null;
    }
  }
  return selection;
};

export const getSelectRanges = createSelector([getSelection], selection => {
  if (!selection || !selection.ranges) {
    return [];
  }
  return selection.ranges;
});

export const getSelectionRecordRanges = createSelector([getSelection], selection => {
  return selection ? selection.recordRanges : undefined;
});

/**
 * from sequential or non-sequential selection area, get selected cells 2d array.
 * @param state
 */
export const getCellMatrixFromSelection = (state: IReduxState): ICell[][] | null => {
  const selectionRanges = getSelectRanges(state);
  const selectionRecordRanges = getSelectionRecordRanges(state);

  // non-sequence selection
  if (selectionRecordRanges) {
    const visibleColumns = getVisibleColumns(state);
    return selectionRecordRanges.map(recordId => {
      return visibleColumns.map(column => {
        return {
          recordId,
          fieldId: column.fieldId,
        };
      });
    });
  }
  // sequence selection
  if (!selectionRanges.length) {
    return null;
  }
  return getCellMatrixFromRange(state, selectionRanges[0]!);
};

export const getCellMatrixFromRange = (state: IReduxState, range: IRange): ICell[][] | null => {
  const datasheet = getDatasheet(state);
  const snapshot = datasheet && datasheet.snapshot;
  if (!snapshot) {
    return null;
  }
  const view = getCurrentView(state);
  if (!view) {
    return null;
  }
  const rangeIndex = Range.bindModel(range).getIndexRange(state);
  if (!rangeIndex) {
    return null;
  }
  const { record, field } = rangeIndex;
  const rowSlice = [record.min, record.max + 1];
  const columnSlice = [field.min, field.max + 1];
  const rows = getVisibleRows(state).slice(...rowSlice);
  const columns = getVisibleColumns(state).slice(...columnSlice);
  return getCellMatrix(rows, columns);
};

export const getStdValueTableFromRange = (state: IReduxState, range: IRange): IStandardValueTable | null => {
  const datasheet = getDatasheet(state);
  const snapshot = datasheet && datasheet.snapshot;
  if (!snapshot) {
    return null;
  }
  const view = getCurrentView(state);
  if (!view) {
    return null;
  }
  const indexRange = Range.bindModel(range).getIndexRange(state);
  if (!indexRange) {
    return null;
  }
  const { record, field } = indexRange;
  const rowSlice = [record.min, record.max + 1];
  const columnSlice = [field.min, field.max + 1];
  const rows = getVisibleRows(state).slice(...rowSlice);
  const columns = getVisibleColumns(state).slice(...columnSlice);
  const stdValueMatrix = getStdValueMatrixFromIds(state, snapshot, { rows, columns });
  const fieldDataArr = columns.map(column => snapshot.meta.fieldMap[column.fieldId]!);
  return {
    datasheetId: state.pageParams.datasheetId,
    viewId: view.id,
    header: fieldDataArr,
    body: stdValueMatrix,
    recordIds: rows.map(row => row.recordId),
  };
};

export const getRangeRows = (state: IReduxState, start: number, end: number) => {
  const view = getCurrentView(state);
  if (!view) {
    return [];
  }
  const rows = getVisibleRows(state);
  const groupInfo = getActiveViewGroupInfo(state);
  if (groupInfo.length) {
    const groupSketch = new Group(groupInfo, getGroupBreakpoint(state));
    const depthBreakpoints = groupSketch.getDepthGroupBreakPoints();
    const curBreakpoint = depthBreakpoints.find(bp => bp > start);
    return rows.slice(start, curBreakpoint ? Math.min(curBreakpoint, end) : end);
  }
  return rows.slice(start, end);
};

export const isRowSpaceEnough = (state: IReduxState, length: number, startRowIndex: number) => {
  // consider the grouping situation, we need to know whether the current grouping has enough space to paste data
  const rowLength = getVisibleRows(state).length;
  if (rowLength <= 0) {
    return false;
  }
  return length <= getRangeRows(state, startRowIndex, rowLength).length;
};

export const isColumnSpaceEnough = (state: IReduxState, length: number, activeCol: number) => {
  const columnLength = getVisibleColumnCount(state);
  return length <= columnLength - activeCol;
};

/**
 * get selected records collection, no matter by checkbox or range selection
 * @param state
 */
export const getSelectRecordIds = createSelectorIgnoreState(
  [state => state, getSelectRanges, getSelectionRecordRanges],
  (state, ranges, checkedRecordIds) => {
    const range = ranges[0];
    // if selection area exists, return the selected records in the area
    if (range) {
      const rangeRecords = getRangeRecords(state, range);
      return rangeRecords ? rangeRecords.map(row => row.recordId) : [];
    }
    // otherwise return the checked records
    return checkedRecordIds || [];
  },
);

export const isCellInSelection = (state: IReduxState, cell: ICell): boolean => {
  const selection = getSelection(state);
  if (!selection) {
    return false;
  }
  if (!selection.ranges) {
    const selectedRecordIds = getSelectRecordIds(state);
    const inSelectRecords = new Set(selectedRecordIds).has(cell.recordId);
    return inSelectRecords;
  }
  return selection.ranges.some(range => {
    return Range.bindModel(range).contains(state, cell);
  });
};

export const getCellIndex = (state: IReduxState, cell: ICell): { recordIndex: number; fieldIndex: number } | null => {
  const visibleRowIndexMap = getVisibleRowsIndexMap(state);
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  if (isCellVisible(state, cell)) {
    return {
      recordIndex: visibleRowIndexMap.get(cell.recordId)!,
      fieldIndex: visibleColumnIndexMap.get(cell.fieldId)!,
    };
  }
  return null;
};

export const getCellByIndex = (
  state: IReduxState,
  cellIndex: {
    recordIndex: number;
    fieldIndex: number;
  },
) => {
  const { recordIndex, fieldIndex } = cellIndex;
  const visibleRows = getVisibleRows(state);
  const visibleColumns = getVisibleColumns(state);
  const cell = {
    recordId: visibleRows[recordIndex]!.recordId,
    fieldId: visibleColumns[fieldIndex]!.fieldId,
  };
  if (isCellVisible(state, cell)) {
    return cell;
  }
  return null;
};

export const getCellUIIndex = (state: IReduxState, cell: ICell): { rowIndex: number; columnIndex: number } | null => {
  const visibleColumnIndexMap = getVisibleColumnsMap(state);
  const linearRowIndexMap = getLinearRowsIndexMap(state);
  if (isCellVisible(state, cell)) {
    return {
      rowIndex: linearRowIndexMap!.get(`${CellType.Record}_${cell.recordId}`)!,
      columnIndex: visibleColumnIndexMap.get(cell.fieldId)!,
    };
  }
  return null;
};

export const getSelectedField = (state: IReduxState) => {
  const selection = getSelection(state);
  const datasheet = getDatasheet(state);
  if (!selection || !datasheet || !selection.activeCell) {
    return;
  }
  const fieldId = selection.activeCell.fieldId;
  return datasheet.snapshot.meta.fieldMap[fieldId];
};

export const getSelectedRecord = (state: IReduxState) => {
  const selection = getSelection(state);
  const datasheet = getDatasheet(state);
  if (!selection || !datasheet || !selection.activeCell) {
    return;
  }
  const recordId = selection.activeCell.recordId;
  return datasheet.snapshot.recordMap[recordId];
};

export const getFillHandleStatus = (state: IReduxState) => {
  const selection = getSelection(state);
  return selection?.fillHandleStatus;
};

export const getFieldRanges = (state: IReduxState) => {
  return getSelection(state)?.fieldRanges;
};