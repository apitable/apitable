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
  ILoadFieldPermissionMapAction, IResetFieldPermissionMapAction, IUpdateFieldPermissionMapAction, IUpdateFieldPermissionSettingAction
} from 'modules/database/store/actions/resource';

import {
  LOAD_FIELD_PERMISSION_MAP, RESET_FIELD_PERMISSION_MAP, UPDATE_FIELD_PERMISSION_MAP, UPDATE_FIELD_PERMISSION_SETTING
} from '../../../../../shared/store/action_constants';
import produce from 'immer';
import { IFieldPermissionMap } from '../../../../../../exports/store/interfaces';

type IFieldPermissionAction = IUpdateFieldPermissionMapAction | IResetFieldPermissionMapAction | ILoadFieldPermissionMapAction
  | IUpdateFieldPermissionSettingAction;

export const fieldPermissionMap = (state = {}, action: IFieldPermissionAction) => {

  switch (action.type) {
    case UPDATE_FIELD_PERMISSION_MAP: {
      if (!state) {
        return action.payload;
      }
      return {
        ...state,
        ...action.payload
      };
    }
    case RESET_FIELD_PERMISSION_MAP: {
      return produce(state, draft => {
        if (draft[action.payload]) {
          delete draft[action.payload];
        }
        return draft;
      });
    }
    case LOAD_FIELD_PERMISSION_MAP: {
      return action.payload;
    }
    case UPDATE_FIELD_PERMISSION_SETTING: {
      return produce(state, (draft: IFieldPermissionMap) => {
        const { fieldId, setting } = action.payload;
        if (!draft || !draft[fieldId]) {
          return draft;
        }
        draft[fieldId]!.setting = setting;
        return draft;
      });
    }
    default: {
      return state;
    }
  }
};

