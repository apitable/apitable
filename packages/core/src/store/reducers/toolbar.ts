import { produce } from 'immer';
import * as actions from '../action_constants';
import { ISetToolBarMenuCardStateAction, IToolBar } from '../interface/tool_bar';
import { ToolBarMenuCardOpenState } from '../constants';

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
