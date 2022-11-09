import * as actions from '../../../shared/store/action_constants';
import { IAttachmentValue } from 'types';
import { IPreviewFile } from '../../../../exports/store/interfaces';

export const setPreviewFile = (data: IPreviewFile) => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_PREVIEW_FILE,
      payload: data,
    });
  };
};

export const setPreviewFileCellActive = (list: IAttachmentValue[]) => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_PREVIEW_FILE_CELL_ACTIVE,
      payload: list,
    });
  };
};

export const setPreviewFileDefault = () => {
  return (dispatch: any) => {
    dispatch({
      type: actions.SET_PREVIEW_DEFAULT_ACTIVE,
    });
  };
};
