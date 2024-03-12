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

import { IUnitInfo } from '../../../../exports/store/interfaces';
import { IResetUnitInfoAction, IUpdateUnitMapAction, IUpdateUserMapAction } from 'modules/org/store/actions/unit_info';
import produce from 'immer';
import { RESET_UNIT_INFO, UPDATE_UNIT_MAP, UPDATE_USER_MAP } from '../../../shared/store/action_constants';

const defaultState: IUnitInfo = {
  unitMap: null,
  userMap: null,
};

type IUnitInfoAction = IUpdateUnitMapAction | IUpdateUserMapAction | IResetUnitInfoAction;

const updateUnitMap = (oldUnitMap: any, newUnitMap: any) => {
  return {
    ...(oldUnitMap || {}),
    ...newUnitMap,
  };
};

const updateUserMap = (oldUserMap: any, newUserMap: any) => {
  if (!oldUserMap) {
    oldUserMap = {};
  }
  const _unitMap = {};
  for (const k in newUserMap) {
    const value = newUserMap[k];
    if (value.unitId) {
      oldUserMap[k] = value.unitId;
      _unitMap[value.unitId] = value;
      continue;
    }
    oldUserMap[k] = value;
  }
  return { oldUserMap, _unitMap };
};

export const unitInfo = produce(
  (state = defaultState, action: IUnitInfoAction) => {
    switch (action.type) {
      case UPDATE_UNIT_MAP: {
        state.unitMap = updateUnitMap(state.unitMap, action.payload);
        break;
      }
      case UPDATE_USER_MAP: {
        const { oldUserMap: userMap, _unitMap } = updateUserMap(state.userMap, action.payload);
        const unitMap = updateUnitMap(state.unitMap, _unitMap);
        state.userMap = userMap;
        state.unitMap = unitMap;
        break;
      }
      case RESET_UNIT_INFO: {
        return defaultState;
      }
    }
    return state;
  }
);
