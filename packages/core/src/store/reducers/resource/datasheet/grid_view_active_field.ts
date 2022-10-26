import {
  ISetFieldInfoAction, IGridViewActiveFieldState, ISetTempSelection, IClearFieldInfoAction,
} from 'store/interface';
import {
  SET_ACTIVE_FIELD_STATE, CLEAR_FIELD_INFO,
} from 'store/action_constants';

export const gridViewActiveFieldStateDefault: IGridViewActiveFieldState = {
  fieldId: '',
  fieldRectLeft: 0,
  fieldRectBottom: 0,
  clickLogOffsetX: 0,
  fieldIndex: -1,
  tempSelection: [],
  operate: null,
};

type IPayloadAction = ISetFieldInfoAction | ISetTempSelection | IClearFieldInfoAction;

export const gridViewActiveFieldState = (
  state: IGridViewActiveFieldState = gridViewActiveFieldStateDefault,
  action: IPayloadAction,
) => {
  switch (action.type) {
    case SET_ACTIVE_FIELD_STATE: {
      return { ...state, ...action.payload };
    }
    case CLEAR_FIELD_INFO: {
      return gridViewActiveFieldStateDefault;
    }
    // case SET_TEMP_SELECTION:
    // TODO: data compare logic 

    default:
      return state;
  }
};
