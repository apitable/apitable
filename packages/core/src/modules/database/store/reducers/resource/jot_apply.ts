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

import { IJOTAction, jot } from 'engine';
import { IJOTActionPayload } from '../../../../../exports/store/interfaces';

// TODO: delete here's any @kailang
export const JOTApply = <T extends { snapshot: any } = { snapshot: any }> (
  state: T,
  { payload }: IJOTActionPayload,
  filterCB?: (state: T, action: IJOTAction[]) => IJOTAction[]
): T => {
  const max = 10000;
  let pureJOTAction = payload.operations.reduce<IJOTAction[]>((pre, op) => {
    const length = op.actions.length;
    
    if (length > max) {
      for (let i = 0, divides = Math.ceil(length / max); i < divides; i++ ) {
        pre.push(...op.actions.slice(i * max , (i + 1)*max));
      }
    } else {
      pre.push(...op.actions);
    } 
    return pre;
  }, []);
  if (filterCB) {
    pureJOTAction = filterCB(state, pureJOTAction);
  }

  jot.apply(state.snapshot, pureJOTAction);
  return state;
};