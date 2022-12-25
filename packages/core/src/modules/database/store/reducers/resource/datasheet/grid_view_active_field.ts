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

import {
  ISetFieldInfoAction, IGridViewActiveFieldState, ISetTempSelection, IClearFieldInfoAction,
} from '../../../../../../exports/store/interfaces';
import {
  SET_ACTIVE_FIELD_STATE, CLEAR_FIELD_INFO,
} from '../../../../../shared/store/action_constants';

export const gridViewActiveFieldStateDefault: IGridViewActiveFieldState = {
  fieldId: '',
  fieldRectLeft: 0,
  fieldRectBottom: 0,
  clickLogOffsetX: 0,
  fieldIndex: -1,
  tempSelection: [],
  operate: null,
};

type IPayloadAction = ISetFieldInfoAction | ISetTempSelection | IClearFieldInfoAction;

export const gridViewActiveFieldState = (
  state: IGridViewActiveFieldState = gridViewActiveFieldStateDefault,
  action: IPayloadAction,
) => {
  switch (action.type) {
    case SET_ACTIVE_FIELD_STATE: {
      return { ...state, ...action.payload };
    }
    case CLEAR_FIELD_INFO: {
      return gridViewActiveFieldStateDefault;
    }
    // case SET_TEMP_SELECTION:
    // TODO: data compare logic 

    default:
      return state;
  }
};
