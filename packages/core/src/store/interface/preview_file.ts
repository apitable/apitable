import { SET_PREVIEW_DEFAULT_ACTIVE, SET_PREVIEW_FILE, SET_PREVIEW_FILE_CELL_ACTIVE } from 'store/action_constants';
import { IAttachmentValue } from 'types';

// 来自：IExpandPreviewModalFuncProps
export interface IPreviewFile {
  datasheetId?: string; // 3 个 id 同时存在时，会从 redux 中读取附件列表，实现协同读取
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
