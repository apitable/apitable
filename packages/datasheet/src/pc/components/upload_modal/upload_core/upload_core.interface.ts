/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
