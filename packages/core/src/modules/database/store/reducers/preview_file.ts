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

import { produce } from 'immer';
import { IPreviewFile, ISetPreviewDefaultAction, ISetPreviewFileAction, ISetPreviewFileCellValueAction } from '../../../../exports/store/interfaces';
import { SET_PREVIEW_DEFAULT_ACTIVE, SET_PREVIEW_FILE, SET_PREVIEW_FILE_CELL_ACTIVE } from '../../../shared/store/action_constants';

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
  }, defaultState
);
