import { produce } from 'immer';
import * as actions from '../../../shared/store/action_constants';
import { ISetToolBarMenuCardStateAction, IToolBar } from '../../../org/store/interface/tool_bar';
import { ToolBarMenuCardOpenState } from '../../../shared/store/constants';

const defaultState: IToolBar = {
  menuCardState: ToolBarMenuCardOpenState.None,
};

export const toolbar = produce(
  (state: IToolBar = defaultState, action: ISetToolBarMenuCardStateAction) => {
    switch (action.type) {
      case actions.SET_TOOLBAR_MENU_CARD_OPEN:
        return { ...state, menuCardState: action.payload };
      default:
        return state;
    }
  });
