import * as actions from 'store/action_constants';
import {
  IClearSelection, IClearSelectionButKeepCheckedRecord, ISelection, ISetActiveCellAction, ISetFieldRanges,
  ISetFillHandleStatus, ISetRecordRange, ISetSelectionAction,
} from 'store/interface';

type ISelectionActions = ISetSelectionAction | ISetActiveCellAction |
  ISetRecordRange | IClearSelection | ISetFieldRanges | ISetFillHandleStatus | IClearSelectionButKeepCheckedRecord;

function setRecord(state: ISelection | null, { payload }: ISetRecordRange): ISelection | null {
  // 处理 初次进行勾选和多选
  if (!state || !state.recordRanges || payload.length > 1) {
    return {
      recordRanges: payload,
    };
  }
  // 1. 处理对单个record 的toogle处
  // 2. 处理 全不选的情况

  if ((state.recordRanges.length === 1 && payload[0] === state.recordRanges[0]) || payload.length === 0) {
    return null;
  }

  const result = state.recordRanges.filter(item => item !== payload[0]);
  if (result.length === state.recordRanges.length) result.push(payload[0]);

  return {
    recordRanges: result,
  };
}

// 对列的处理不同于record，选择整列，默认会为该列第一个cell设置为激活状态，
// 因此activeCell 和 fieldRanges 是成对出现的
// 不再在这里判断是点击一列还是多选列，因为需要依据shift键判断，所以选择在mouseDown的时候判断并且处理数据
// 比方说：如果按下shift，在已选择的列头点击是保持原样，但是点击新的列会把原来多选的列和新的列连起来
// 没有按下shift键，点击已选列头不作操作，点击其他列就只是更新数据
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
