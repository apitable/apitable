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

import { IDeleteCalcCache, IExpireCalcCache, IRefreshCalcCache } from './action';
import { DELETE_CALC_CACHE, EXPIRE_CALC_CACHE, REFRESH_CALC_CACHE } from '../../constant';
import { ICalcCache } from 'interface';

export function calcCacheReducer(
  state: ICalcCache | undefined = undefined,
  action: IRefreshCalcCache | IExpireCalcCache | IDeleteCalcCache): ICalcCache {
  switch (action.type) {
    case REFRESH_CALC_CACHE: {
      const { datasheetId, viewId, cache } = action.payload;
      return {
        ...state,
        [datasheetId]: {
          ...state?.[datasheetId],
          [viewId]: {
            cache
          }
        }
      };
    }
    case EXPIRE_CALC_CACHE: {
      const { datasheetId, viewId, expire = true } = action.payload;
      const viewCache = state?.[datasheetId]?.[viewId];
      if (!viewCache) {
        return state || {};
      }
      return {
        ...state,
        [datasheetId]: {
          ...state?.[datasheetId],
          [viewId]: {
            ...viewCache,
            expire
          }
        }
      };
    }
    case DELETE_CALC_CACHE: {
      if (!state) {
        return state || {};
      }
      const calcCache = {};
      Object.keys(state).forEach(datasheetId => {
        Object.keys(state[datasheetId]!).forEach(viewId => {
          if (!action.payload?.[datasheetId] || !action.payload[datasheetId]!.includes(viewId)) {
            calcCache[datasheetId] = { [viewId]: state[datasheetId]![viewId] };
          }
        });
      });
      return calcCache;
    }
    default: {
      return state || {};
    }
  }
}
