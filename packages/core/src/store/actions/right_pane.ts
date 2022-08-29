import * as actions from '../action_constants';

export const setRightPaneWidth = (width: number | string) => {
  return dispatch => {
    dispatch({
      type: actions.SET_RIGHT_PANE_WIDTH,
      payload: width,
    });
  };
};
