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

import { uniqBy, isEqual } from 'lodash';
import { IReduxState, ICollaboratorCursorMap } from '../../../../exports/store/interfaces';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { getDatasheetClient, getActiveDatasheetId } from './resource/datasheet/base';

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

export const collaboratorSocketSelector = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  return client && client.collaborators;
};
/**
 * display avatars on the status bar,
 * one user can use multiple client to connect to the same datasheet room.
 * But collaborator avatars are only displayed once.
 */
export const collaboratorSelector = createDeepEqualSelector(
  collaboratorSocketSelector,
  collaborators => {
    if (collaborators) {
      return uniqBy(collaborators, 'userId');
    }
    return [];
  },
);

export const collaboratorCursorSelector = createSelector(
  [collaboratorSocketSelector, getActiveDatasheetId],
  (collaborators, _activeDatasheetId): ICollaboratorCursorMap => {
    const collaboratorCursorMap: ICollaboratorCursorMap = {};
    collaborators!
      .filter(collaborator => collaborator.activeCell)
      .map(collaborator => {
        return {
          fieldId: collaborator.activeCell!.fieldId,
          recordId: collaborator.activeCell!.recordId,
          avatar: collaborator.avatar,
          socketId: collaborator.socketId,
          userId: collaborator.userId,
          userName: collaborator.userName,
          memberName: collaborator.memberName,
          touchTime: collaborator.activeCell!.time, // the time of active cell
        };
      }).forEach(r => {
        const key = `${r.fieldId}_${r.recordId}`;
        if (collaboratorCursorMap.hasOwnProperty(key)) {
          collaboratorCursorMap[key]!.push(r);
        } else {
          collaboratorCursorMap[key] = [r];
        }
      });
    return collaboratorCursorMap;
  },
);
