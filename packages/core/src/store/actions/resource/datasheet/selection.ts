import { ICell, IFieldRanges, IRange, IRecordRanges, Range } from 'model';
import { IReduxState, Selectors } from 'store';
import {
  CLEAR_SELECTION, CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD,
  SET_ACTIVE_CELL, SET_FIELD_RANGES, SET_FILL_HANDLE_STATUS, SET_RECORD_SELECTION, SET_SELECTION,
} from 'store/action_constants';
import { IFillHandleStatus } from 'store/interface';

// 设置选区

export const setSelection = (ranges: IRange | IRange[]): any => (dispatch, getState: () => IReduxState) => {
  const state = getState();
  const datasheetId = state.pageParams.datasheetId;
  const selectionState = Selectors.getDatasheetClient(state)!.selection;
  const payload = Array.isArray(ranges) ? ranges : [ranges];
  const range = payload[0];

  if (!selectionState || !selectionState.ranges || !selectionState.activeCell) {
    return dispatch({
      type: SET_SELECTION,
      datasheetId,
      payload: {
        activeCell: range.start,
        ranges: payload,
      },
    });
  }

  return dispatch({
    type: SET_SELECTION,
    datasheetId,
    payload: {
      ranges: payload,
    },
  });
};

// 设置活动单元格
export const setActiveCell = (datasheetId: string, cell: ICell) => {
  const payload = cell;
  return {
    type: SET_ACTIVE_CELL,
    datasheetId,
    payload: {
      ranges: [{ start: cell, end: cell }], // 激活单元格时，选区就是激活单元格自己到自己的向量。
      activeCell: payload,
    },
  };
};

// 记录当前选中的 record
export const setRecordRange = (datasheetId: string, recordRange: IRecordRanges) => {
  return {
    type: SET_RECORD_SELECTION,
    datasheetId,
    payload: recordRange,
  };
};

// 保留已经勾选的 record，但是清除激活单元格，连续选区等数据。
export const clearSelectionButKeepCheckedRecord = (datasheetId: string) => {
  return {
    type: CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD,
    datasheetId,
  };
};

// 清除选区数据
export const clearSelection = (datasheetId: string) => {
  return {
    type: CLEAR_SELECTION,
    datasheetId,
  };
};

// 设置当前选中的列
export const setFieldRanges = (datasheetId: string, payload: IFieldRanges) => {
  return {
    type: SET_FIELD_RANGES,
    datasheetId,
    payload,
  };
};

type ISetFillHandleStatus = Omit<IFillHandleStatus, 'fillRange'> & { hoverCell?: ICell };

// 设置填充把手激活状态
export const setFillHandleStatus = (payload: ISetFillHandleStatus): any => (dispatch: any, getState: () => IReduxState) => {
  const state = getState();
  const datasheetId = state.pageParams.datasheetId;
  const selection = Selectors.getSelection(state);
  const fillHandleStatus = Selectors.getFillHandleStatus(state);
  if (!selection) return;
  if (!selection.ranges) return;
  const selectionRange = selection.ranges[0];
  if (!payload.hoverCell) {
    return dispatch({
      type: SET_FILL_HANDLE_STATUS,
      datasheetId,
      payload: {
        fillHandleStatus: payload,
      },
    });
  }
  // 按下填充把手后，鼠标可以任意拖动，hover 在任意 cell 上，需要根据 hoverCell 计算出 填充的方向，然后修正选区。
  const direction = Range.bindModel(selectionRange).getDirection(state, payload.hoverCell);
  if (!direction) return;
  const isFillHandleActive = Boolean(fillHandleStatus && fillHandleStatus.isActive);
  const fillRange = Range.bindModel(selectionRange).getFillRange(state, payload.hoverCell, direction);
  if (!fillRange) return;
  if (!isFillHandleActive) return;
  return dispatch({
    type: SET_FILL_HANDLE_STATUS,
    datasheetId,
    payload: {
      fillHandleStatus: {
        ...payload,
        fillRange,
        direction,
      },
    },
  });
};
