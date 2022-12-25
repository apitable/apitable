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

import { IReduxState, IUnitMap } from '../../../../exports/store/interfaces';
import { createSelector } from 'reselect';

export const getUnitMap = (state: IReduxState): IUnitMap | null => {
  return state.unitInfo.unitMap;
};

const getUserMapBase = (state: IReduxState) => {
  return state.unitInfo.userMap;
};

export const getUserMap = createSelector(
  [getUnitMap, getUserMapBase], (unitMap, userMap) => {
    if (!userMap) {
      return null;
    }
    const _userMap = {};
    for (const userId in userMap) {
      const userValue = userMap[userId];
      if (userValue == null) {
        continue;
      }
      if (typeof userValue === 'string') {
        if (!unitMap) {
          continue;
        }
        const unit = unitMap[userValue];
        if (!unit) {
          continue;
        }
        _userMap[userId] = unit;
      } else {
        _userMap[userId] = userValue;
      }
    }
    return _userMap;
  }
);
