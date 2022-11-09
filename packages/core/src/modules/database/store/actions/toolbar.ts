import * as actions from '../../../shared/store/action_constants';
import { ToolBarMenuCardOpenState } from '../../../shared/store/constants';

export const setToolbarMenuCardOpen = (type: ToolBarMenuCardOpenState) => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_TOOLBAR_MENU_CARD_OPEN,
      payload: type,
    });
  };
};
