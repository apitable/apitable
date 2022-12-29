import { SET_PREVIEW_DEFAULT_ACTIVE, SET_PREVIEW_FILE, SET_PREVIEW_FILE_CELL_ACTIVE } from '../../../shared/store/action_constants';
import { IAttachmentValue } from 'types';

// From: IExpandPreviewModalFuncProps
export interface IPreviewFile {
  /**
   * when 3 id exists in the same time,
   * read attachments list from redux,
   * which implements collaboration reading
   */
  datasheetId?: string; 
  recordId?: string; 
  fieldId?: string;
  activeIndex: number;
  cellValue: IAttachmentValue[];
  editable: boolean;
  onChange: (cellValue: IAttachmentValue[]) => void;
  disabledDownload: boolean,
}

export interface ISetPreviewFileAction {
  type: typeof SET_PREVIEW_FILE;
  payload: IPreviewFile;
}

export interface ISetPreviewFileCellValueAction {
  type: typeof SET_PREVIEW_FILE_CELL_ACTIVE;
  payload: IAttachmentValue[];
}

export interface ISetPreviewDefaultAction {
  type: typeof SET_PREVIEW_DEFAULT_ACTIVE;
  payload: IAttachmentValue[];
}
