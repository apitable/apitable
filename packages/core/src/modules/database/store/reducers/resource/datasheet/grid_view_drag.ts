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

import produce from 'immer';
import {
  IDragTargetAction, IGridViewDragState, IHoverRecordId, ISetHoverGroupPath, ISetHoverRowOfAddRecord,
} from '../../../../../../exports/store/interfaces';
import {
  SET_DRAG_TARGET, SET_HOVER_GROUP_PATH, SET_HOVER_RECORD_ID, SET_HOVER_ROW_OF_ADD_RECORD,
} from '../../../../../shared/store/action_constants';

export const gridViewDragStateDefault: IGridViewDragState = {
  dragTarget: {},
  hoverRecordId: null,
  hoverRowOfAddRecord: null,
};

type IRecordAction = IHoverRecordId | IDragTargetAction | ISetHoverGroupPath | ISetHoverRowOfAddRecord;

export const gridViewDragState = produce(
  (draft: IGridViewDragState = gridViewDragStateDefault, action: IRecordAction) => {
    switch (action.type) {
      case SET_DRAG_TARGET:
        draft.dragTarget = action.payload;
        return draft;
      case SET_HOVER_RECORD_ID:
        draft.hoverRecordId = action.payload;
        return draft;
      case SET_HOVER_GROUP_PATH:
        draft.hoverGroupHeadRecordId = action.payload;
        return draft;
      case SET_HOVER_ROW_OF_ADD_RECORD:
        draft.hoverRowOfAddRecord = action.payload;
        return draft;
      default:
        return draft;
    }
  }, gridViewDragStateDefault);
