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

import keyBy from 'lodash/keyBy';
import { RESET_UNIT_INFO, UPDATE_UNIT_MAP, UPDATE_USER_MAP } from '../../../shared/store/action_constants';
import { IUnitMap } from '../../../../exports/store/interfaces';
import { Api } from '../../../../exports/api';

export interface IUpdateUnitMapAction {
  type: typeof UPDATE_UNIT_MAP;
  payload: IUnitMap;
}

export interface IUpdateUserMapAction {
  type: typeof UPDATE_USER_MAP;
  payload: IUnitMap;
}

export interface IResetUnitInfoAction {
  type: typeof RESET_UNIT_INFO;
}

export const updateUnitMap = (unitMap: IUnitMap) => {
  return {
    type: UPDATE_UNIT_MAP,
    payload: unitMap,
  };
};

export const updateUserMap = (userMap: IUnitMap) => {
  return {
    type: UPDATE_USER_MAP,
    payload: userMap,
  };
};

export const resetUnitInfo = () => {
  return {
    type: RESET_UNIT_INFO,
  };
};

/**
 * load the missing unit information
 * @param names 
 * @param linkId 
 * @returns 
 */
export const loadLackUnitMap = (names: string, linkId?: string,) => {
  return async(dispatch: any) => {
    if (!names.length) {
      return;
    }
    const { data: { data: resData }} = await Api.searchUnitInfoVo(names, linkId);
    if (!resData.length) {
      return;
    }
    // FIXME: edit type
    return dispatch(updateUnitMap(keyBy(resData, 'unitId')));
  };
};
