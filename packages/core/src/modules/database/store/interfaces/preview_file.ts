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
