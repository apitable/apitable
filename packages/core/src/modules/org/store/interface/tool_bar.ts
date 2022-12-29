
import { SET_TOOLBAR_MENU_CARD_OPEN } from '../../../shared/store/action_constants';
import { ToolBarMenuCardOpenState } from '../../../shared/store/constants';

export interface IToolBar {
  menuCardState: ToolBarMenuCardOpenState;
}

export interface ISetToolBarMenuCardStateAction {
  type: typeof SET_TOOLBAR_MENU_CARD_OPEN;
  payload: ToolBarMenuCardOpenState;
}
