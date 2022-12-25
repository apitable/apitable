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
import { SET_MIRROR_MAP, SET_MIRROR } from '../../constant';

export interface ISetMirrorMapAction {
  type: typeof SET_MIRROR_MAP;
  payload: IMirrorMap;
}

export const setMirrorMapAction = (payload: IMirrorMap): ISetMirrorMapAction => ({ type: SET_MIRROR_MAP, payload });

export interface ISetMirrorAction {
  type: typeof SET_MIRROR;
  payload: IMirrorMap;
}

export const setMirrorAction = (payload: IMirrorMap): ISetMirrorAction => ({ type: SET_MIRROR, payload });
