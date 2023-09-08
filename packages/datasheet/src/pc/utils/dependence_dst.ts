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

import { ComputeRefManager, getComputeRefManager, IReduxState, Selectors } from '@apitable/core';

/**
 * Get an array of dependent datasheetId's
 * @param state
 * @param datasheetId
 */
export const getDependenceDstIds = (state: IReduxState, datasheetId: string) => {
  const computeRefManager = getComputeRefManager(state);
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  if (!fieldMap) {
    return [];
  }
  return computeRefManager.getDependenceDstIds(datasheetId!, fieldMap);
};

/**
 * Check which tables a table depends on datasheetId set
 * @param state
 * @param datasheetId
 */
export const getDependenceByDstIds = (state: IReduxState, datasheetId: string) => {
  const computeRefManager = getComputeRefManager(state);
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  if (!fieldMap) {
    return [];
  }
  return computeRefManager.getDependenceByDstIds(datasheetId!, fieldMap);
};

/**
 * danger only use in browser
 * @param state
 * @param datasheetId
 */
export const getDependenceByDstIdsByGlobalResource = (state: IReduxState, datasheetId: string, computeRefManager: ComputeRefManager) => {
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  if (!fieldMap) {
    return [];
  }
  return computeRefManager.getDependenceByDstIds(datasheetId!, fieldMap);
};
