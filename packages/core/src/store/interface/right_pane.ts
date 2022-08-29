import { SET_RIGHT_PANE_WIDTH } from 'store/action_constants';

export interface IRightPane {
  width: number | string;
}

export interface ISetRightPaneWidthAction {
  type: typeof SET_RIGHT_PANE_WIDTH;
  payload: number | string;
}
