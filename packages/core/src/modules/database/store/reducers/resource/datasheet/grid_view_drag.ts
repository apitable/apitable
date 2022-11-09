import {
  IGridViewDragState, IHoverRecordId, IDragTargetAction, ISetHoverGroupPath, ISetHoverRowOfAddRecord,
} from '../../../../../../store/interfaces';
import {
  SET_DRAG_TARGET, SET_HOVER_RECORD_ID, SET_HOVER_GROUP_PATH, SET_HOVER_ROW_OF_ADD_RECORD,
} from '../../../../../shared/store/action_constants';
import produce from 'immer';

export const gridViewDragStateDefault: IGridViewDragState = {
  dragTarget: {},
  hoverRecordId: null,
  hoverRowOfAddRecord: null,
};

type IRecordAction = IHoverRecordId | IDragTargetAction | ISetHoverGroupPath | ISetHoverRowOfAddRecord;

export const gridViewDragState = produce(
  (draft: IGridViewDragState = gridViewDragStateDefault, action: IRecordAction) => {
    switch (action.type) {
      case SET_DRAG_TARGET:
        draft.dragTarget = action.payload;
        return draft;
      case SET_HOVER_RECORD_ID:
        draft.hoverRecordId = action.payload;
        return draft;
      case SET_HOVER_GROUP_PATH:
        draft.hoverGroupHeadRecordId = action.payload;
        return draft;
      case SET_HOVER_ROW_OF_ADD_RECORD:
        draft.hoverRowOfAddRecord = action.payload;
        return draft;
      default:
        return draft;
    }
  });
