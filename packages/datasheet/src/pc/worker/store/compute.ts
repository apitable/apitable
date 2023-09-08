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

import { Selectors, IReduxState } from '@apitable/core';

import { ComputeServices } from './constants';

export const computeServiceSet: { [key: string]: (state: IReduxState, resourceId?: string) => any } = {
  [ComputeServices.PureVisibleRows]: (state, resourceId) => Selectors.getPureVisibleRows(state, resourceId),
  [ComputeServices.VisibleColumns]: (state, resourceId) => Selectors.getVisibleColumns(state, resourceId),
  [ComputeServices.SearchResultArray]: (state) => Selectors.getSearchResult(state),
  [ComputeServices.LinearRows]: (state) => Selectors.getLinearRows(state),
  [ComputeServices.GroupBreakpoint]: (state) => Selectors.getGroupBreakpoint(state),
};

// Describe what information is to be returned by the calculation
export declare type TComputeDesc = ComputeServices[];

export const computeService = (state: IReduxState, computeDesc: TComputeDesc, id: number, resourceId?: string) => {
  const result = computeDesc.reduce((res, key: string) => {
    res[key] = computeServiceSet[key] ? computeServiceSet[key](state, resourceId) : undefined;
    return res;
  }, {} as any);

  return { data: result, computeId: id };
};
