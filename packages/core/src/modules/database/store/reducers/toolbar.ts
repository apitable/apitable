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

import { produce } from 'immer';
import { ISetToolBarMenuCardStateAction, IToolBar } from '../../../org/store/interface/tool_bar';
import * as actions from '../../../shared/store/action_constants';
import { ToolBarMenuCardOpenState } from '../../../shared/store/constants';

const defaultState: IToolBar = {
  menuCardState: ToolBarMenuCardOpenState.None,
};

export const toolbar = produce(
  (state: IToolBar = defaultState, action: ISetToolBarMenuCardStateAction) => {
    switch (action.type) {
      case actions.SET_TOOLBAR_MENU_CARD_OPEN:
        return { ...state, menuCardState: action.payload };
      default:
        return state;
    }
  }, defaultState);
