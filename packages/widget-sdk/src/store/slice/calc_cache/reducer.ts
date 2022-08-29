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
        Object.keys(state[datasheetId]).forEach(viewId => {
          if (!action.payload?.[datasheetId] || !action.payload[datasheetId].includes(viewId)) {
            calcCache[datasheetId] = { [viewId]: state[datasheetId][viewId] };
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
