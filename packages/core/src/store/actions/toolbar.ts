import * as actions from '../action_constants';
import { ToolBarMenuCardOpenState } from '../constants';

export const setToolbarMenuCardOpen = (type: ToolBarMenuCardOpenState) => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_TOOLBAR_MENU_CARD_OPEN,
      payload: type,
    });
  };
};
