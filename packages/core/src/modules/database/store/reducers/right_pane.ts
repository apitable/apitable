import produce from 'immer';
import * as actions from '../../../shared/store/action_constants';
import { IRightPane, ISetRightPaneWidthAction } from '../interfaces/right_pane';

const defaultState: IRightPane = {
  width: 0,
};

export const rightPane = produce(
  (state: IRightPane = defaultState, action: ISetRightPaneWidthAction) => {
    switch (action.type) {
      case actions.SET_RIGHT_PANE_WIDTH:
        return { ...state, width: action.payload };
      default:
        return state;
    }
  }
);
