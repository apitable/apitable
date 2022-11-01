import * as actions from '../action_constants';

export const setRightPaneWidth = (width: number | string) => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_RIGHT_PANE_WIDTH,
      payload: width,
    });
  };
};
