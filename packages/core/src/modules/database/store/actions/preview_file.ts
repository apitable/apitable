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

import * as actions from 'modules/shared/store/action_constants';
import { IAttachmentValue } from 'types';
import { IPreviewFile } from 'exports/store/interfaces';

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
