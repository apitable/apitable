import { IAttacheField, IAttachmentValue, RowHeightLevel } from '@apitable/core';
import { UploadStatus } from '../../../utils/upload_manager';

export interface IUploadFileItemProps {
  fileUrl: string; // 方便重新上传
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
  fileUrl: string; // 方便重新上传
  loadedData?: number;
}

export type IUploadFileList = IUploadFile[];

export interface IUploadResponse {
  token: string; // 文件上传到后端 token，最终地址通过前端组装来访问。
  bucket: string; // 存储位置，后端返回
  size: number; // 文件大小，后端返回 byte
  width: number;
  height: number;
  mimeType: string;
  preview?: string;
}
