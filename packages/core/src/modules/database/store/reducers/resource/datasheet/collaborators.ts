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

import {
  ICollaborator, IActiveDatasheetCollaboratorAction, IDeActiveDatasheetCollaborator,
  ICursorMove, IRoomInfoSync,
} from '../../../../../../exports/store/interfaces';
import * as actions from '../../../../../shared/store/action_constants';

export type ICollaboratorAction = IActiveDatasheetCollaboratorAction | IDeActiveDatasheetCollaborator |
  IRoomInfoSync | ICursorMove;

function activeCollaborator(state: ICollaborator[], { payload }: IActiveDatasheetCollaboratorAction): ICollaborator[] {
  if (state.find(user => user.socketId === payload.socketId)) {
    console.warn('! ' + 'warning user enter with same socketid');
    return state;
  }
  return [...state, payload];
}

function deactivateCollaborator(state: ICollaborator[], { payload }: IDeActiveDatasheetCollaborator): ICollaborator[] {
  return state.filter(user => user.socketId !== payload.socketId);
}

function userCursorMove(state: ICollaborator[], { payload }: ICursorMove): ICollaborator[] {
  const { socketId, ...rest } = payload;
  return state.map(user => {
    if (user.socketId === socketId) {
      return { ...user, activeCell: rest };
    }
    return user;
  });
}

export const collaborators = (state: ICollaborator[] = [], action: ICollaboratorAction) => {
  switch (action.type) {
    case actions.DATASHEET_ACTIVE_COLLABORATOR: {
      return activeCollaborator(state, action as IActiveDatasheetCollaboratorAction);
    }
    case actions.DATASHEET_DEACTIVATE_COLLABORATOR: {
      return deactivateCollaborator(state, action);
    }
    case actions.DATASHEET_ROOM_INFO_SYNC: {
      return action.payload;
    }
    case actions.CURSOR_MOVE: {
      return userCursorMove(state, action as ICursorMove);
    }
    default:
      return state;
  }
};
