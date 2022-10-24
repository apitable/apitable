import { ICell, IFieldRanges, IRange, IRecordRanges, Range } from 'model';
import { IReduxState, Selectors } from 'store';
import {
  CLEAR_SELECTION, CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD,
  SET_ACTIVE_CELL, SET_FIELD_RANGES, SET_FILL_HANDLE_STATUS, SET_RECORD_SELECTION, SET_SELECTION,
} from 'store/action_constants';
import { IFillHandleStatus } from 'store/interface';

/**
 * set the selection area
 * @param ranges 
 * @returns 
 */
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

/**
 * set the active cell
 * @param datasheetId 
 * @param cell 
 * @returns 
 */
export const setActiveCell = (datasheetId: string, cell: ICell) => {
  const payload = cell;
  return {
    type: SET_ACTIVE_CELL,
    datasheetId,
    payload: {
      // when activate cell, selection area equals the the vector of active cell itself
      ranges: [{ start: cell, end: cell }], 
      activeCell: payload,
    },
  };
};

/**
 * set the records being selected
 * 
 * @param datasheetId 
 * @param recordRange 
 * @returns 
 */
export const setRecordRange = (datasheetId: string, recordRange: IRecordRanges) => {
  return {
    type: SET_RECORD_SELECTION,
    datasheetId,
    payload: recordRange,
  };
};

/**
 * remain checked records, but clear active cell and continuous selection area data.
 * @param datasheetId 
 * @returns 
 */
export const clearSelectionButKeepCheckedRecord = (datasheetId: string) => {
  return {
    type: CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD,
    datasheetId,
  };
};

/**
 * clear the data in selection area
 * 
 * @param datasheetId 
 * @returns 
 */
export const clearSelection = (datasheetId: string) => {
  return {
    type: CLEAR_SELECTION,
    datasheetId,
  };
};

/**
 * set current selected columns
 * 
 * @param datasheetId 
 * @param payload 
 * @returns 
 */
export const setFieldRanges = (datasheetId: string, payload: IFieldRanges) => {
  return {
    type: SET_FIELD_RANGES,
    datasheetId,
    payload,
  };
};

type ISetFillHandleStatus = Omit<IFillHandleStatus, 'fillRange'> & { hoverCell?: ICell };

/**
 * set the Fill Handle active status
 * 
 * @param payload 
 * @returns 
 */
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

  // after click the fill handle, mouse can drag anywhere, hover on any cell
  // calculate the fill direction according to `hoverCell`, and then fix the selection area.
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
