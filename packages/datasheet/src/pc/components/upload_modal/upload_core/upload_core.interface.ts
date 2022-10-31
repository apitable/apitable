import { IAttacheField, IAttachmentValue, RowHeightLevel } from '@apitable/core';
import { UploadStatus } from '../../../utils/upload_manager';

export interface IUploadFileItemProps {
  fileUrl: string; // Easy re-upload.
  recordId: string;
  field: IAttacheField;
  fileId: string;
  status: UploadStatus | undefined;
  file: File;
  datasheetId: string;
  rowHeightLevel?: RowHeightLevel;
  deleteUploadItem?(fileId: string): void;
  isCell?: boolean;
  cellHeight?: number;
  // onChange?: (params: IUploadParams) => void;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[];
}

export interface IUploadFile {
  fileId: string;
  status?: UploadStatus;
  file: File;
  fileUrl: string; // Easy re-upload.
  loadedData?: number;
}

export type IUploadFileList = IUploadFile[];

export interface IUploadResponse {
  token: string; // The file is uploaded to the back-end token and the final address is accessed through the front-end assembly.
  bucket: string; // Storage location, back-end return.
  size: number; // file size, the backend returns byte.
  width: number;
  height: number;
  mimeType: string;
  preview?: string;
}
