
import { SET_TOOLBAR_MENU_CARD_OPEN } from '../action_constants';
import { ToolBarMenuCardOpenState } from 'store/constants';

export interface IToolBar {
  menuCardState: ToolBarMenuCardOpenState;
}

export interface ISetToolBarMenuCardStateAction {
  type: typeof SET_TOOLBAR_MENU_CARD_OPEN;
  payload: ToolBarMenuCardOpenState;
}
