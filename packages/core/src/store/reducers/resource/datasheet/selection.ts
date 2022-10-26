import * as actions from 'store/action_constants';
import {
  IClearSelection, IClearSelectionButKeepCheckedRecord, ISelection, ISetActiveCellAction, ISetFieldRanges,
  ISetFillHandleStatus, ISetRecordRange, ISetSelectionAction,
} from 'store/interface';

type ISelectionActions = ISetSelectionAction | ISetActiveCellAction |
  ISetRecordRange | IClearSelection | ISetFieldRanges | ISetFillHandleStatus | IClearSelectionButKeepCheckedRecord;

function setRecord(state: ISelection | null, { payload }: ISetRecordRange): ISelection | null {
  // handle first time select and multi select
  if (!state || !state.recordRanges || payload.length > 1) {
    return {
      recordRanges: payload,
    };
  }
  // 1. single record toggle
  // 2. don't select all condition

  if ((state.recordRanges.length === 1 && payload[0] === state.recordRanges[0]) || payload.length === 0) {
    return null;
  }

  const result = state.recordRanges.filter(item => item !== payload[0]);
  if (result.length === state.recordRanges.length) result.push(payload[0]);

  return {
    recordRanges: result,
  };
}

/**
 * it is different method for column from record , select whole column, will set the first cell of the column as active cell
 * so activeCell and fieldRanges will appear together
 * no longer judge whether it is a single column or multi column here, 
 * because it needs to be judged according to the shift key, so the choice is to handle the data when mouseDown
 * 
 * for example: if you press shift, click on the column header that has been selected will keep the original state,
 * without pressing the shift key, clicking on the selected column header will not operate.
 * @param state 
 * @param param1 
 * @returns 
 */
function setFieldRanges(state: ISelection | null, { payload }: ISetFieldRanges): ISelection {
  const init = {
    fieldRanges: payload,
  };
  return init;
}

export const selection = (state: ISelection | null = null, action: ISelectionActions): ISelection | null => {
  switch (action.type) {
    case actions.SET_SELECTION:
      return {
        ...state,
        ...action.payload,
      };
    case actions.SET_ACTIVE_CELL:
      return action.payload;
    case actions.SET_RECORD_SELECTION:
      return setRecord(state, action);
    case actions.CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD:
      return {
        recordRanges: state?.recordRanges,
      };
    case actions.CLEAR_SELECTION:
      return null;
    case actions.SET_FIELD_RANGES:
      return setFieldRanges(state, action);
    case actions.SET_FILL_HANDLE_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
