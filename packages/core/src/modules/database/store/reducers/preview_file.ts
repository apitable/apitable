import { produce } from 'immer';
import { SET_PREVIEW_FILE, SET_PREVIEW_FILE_CELL_ACTIVE, SET_PREVIEW_DEFAULT_ACTIVE } from '../../../shared/store/action_constants';
import { IPreviewFile, ISetPreviewDefaultAction, ISetPreviewFileAction, ISetPreviewFileCellValueAction } from '../../../../exports/store/interfaces';

const defaultState: IPreviewFile = {
  datasheetId: undefined,
  recordId: undefined,
  fieldId: undefined,
  activeIndex: -1,
  cellValue: [],
  editable: true,
  onChange: () => {},
  disabledDownload: false,
};

type IPreviewFileActions = ISetPreviewFileAction | ISetPreviewFileCellValueAction | ISetPreviewDefaultAction;

export const previewFile = produce(
  (state: IPreviewFile = defaultState, action: IPreviewFileActions) => {
    switch (action.type) {
      case SET_PREVIEW_FILE:
        return { ...action.payload };
      case SET_PREVIEW_FILE_CELL_ACTIVE:
        state.cellValue = action.payload;      
        return state;
      case SET_PREVIEW_DEFAULT_ACTIVE:
        return defaultState;
      default:
        return state;
    }
  }
);
