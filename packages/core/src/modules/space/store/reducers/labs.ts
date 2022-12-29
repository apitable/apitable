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

import produce from 'immer';
import { ILabs, ILabsAction } from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

const defaultLabs: ILabs = [];

export const labs = produce((labs: ILabs = defaultLabs, action: ILabsAction) => {
  switch (action.type) {
    case actions.SET_LABS: {
      labs = action.payload;
      return labs;
    }
    default:
      return labs;
  }
}, defaultLabs);
