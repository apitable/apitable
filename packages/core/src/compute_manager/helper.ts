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

import { IReduxState } from '../exports/store/interfaces';
import { isServer } from 'utils/env';
import { computeCache } from './compute_cache_manager';
import { ComputeRefManager } from './compute_reference_manager';

import {
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
export const COMPUTE_REF_MAP_CACHE_KEY = 'COMPUTE_REF_MAP_CACHE_KEY';
/**
 * Pass in the current `state`, and return the reference relationship management instance of the computed field in the current state.
 */
export const getComputeRefManager = (state: IReduxState) => {
  const refMapCache = computeCache.get(COMPUTE_REF_MAP_CACHE_KEY);
  // The server does not have a mechanism to update the refMap, so every time it gets the latest one. cannot be retrieved from the cache.
  if (refMapCache && !isServer()) {
    const computeRefManager = new ComputeRefManager(refMapCache.refMap, refMapCache.reRefMap);
    return computeRefManager;
  }
  const computeRefManager = new ComputeRefManager();
  Object.keys(state.datasheetMap).forEach(datasheetId => {
    const currSnapshot = getSnapshot(state, datasheetId);
    const fieldMap = currSnapshot?.meta.fieldMap;
    if (fieldMap) {

      computeRefManager.computeRefMap(fieldMap, datasheetId, state);
    }
  });
  return computeRefManager;
};
