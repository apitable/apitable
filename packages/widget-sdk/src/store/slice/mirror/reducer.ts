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

import { IMirrorMap } from 'core';
import { SET_MIRROR_MAP, SET_MIRROR } from 'store/constant';
import { ISetMirrorAction, ISetMirrorMapAction } from './action';

export function mirrorMapReducer(state: IMirrorMap | undefined, action: ISetMirrorAction | ISetMirrorMapAction): IMirrorMap {
  switch (action.type) {
    case SET_MIRROR_MAP: {
      state = action.payload;
      return state || {};
    }
    case SET_MIRROR: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state || {};
  }
}