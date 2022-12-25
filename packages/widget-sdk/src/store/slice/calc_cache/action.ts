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