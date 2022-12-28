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
import * as actions from '../../../shared/store/action_constants';
import { IRightPane, ISetRightPaneWidthAction } from '../interfaces/right_pane';

const defaultState: IRightPane = {
  width: 0,
};

export const rightPane = produce(
  (state: IRightPane = defaultState, action: ISetRightPaneWidthAction) => {
    switch (action.type) {
      case actions.SET_RIGHT_PANE_WIDTH:
        return { ...state, width: action.payload };
      default:
        return state;
    }
  }, defaultState
);
