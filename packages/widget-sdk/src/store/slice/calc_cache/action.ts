import { IViewRow } from 'core';
import { DELETE_CALC_CACHE, EXPIRE_CALC_CACHE, REFRESH_CALC_CACHE } from '../../constant';

export interface IRefreshPayload {
  datasheetId: string,
  viewId: string,
  cache: IViewRow[]
}

export interface IRefreshCalcCache {
  type: typeof REFRESH_CALC_CACHE;
  payload: IRefreshPayload;
}

export const refreshCalcCache = (payload: IRefreshPayload): IRefreshCalcCache => ({
  type: REFRESH_CALC_CACHE,
  payload
});

export interface IExpireCalcCachePayload {
  datasheetId: string;
  viewId: string;
  expire?: boolean;
}
export interface IExpireCalcCache {
  type: typeof EXPIRE_CALC_CACHE,
  payload: IExpireCalcCachePayload
}

export const expireCalcCache = (payload: IExpireCalcCachePayload): IExpireCalcCache => ({
  type: EXPIRE_CALC_CACHE,
  payload
});

export interface IDeleteCalcCache {
  type: typeof DELETE_CALC_CACHE,
  payload: {[datasheetId: string]: string[]}
}

export const deleteCalcCache = (payload: {[datasheetId: string]: string[]}): IDeleteCalcCache => ({
  type: DELETE_CALC_CACHE,
  payload
});