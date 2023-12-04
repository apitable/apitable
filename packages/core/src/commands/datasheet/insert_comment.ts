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

import { getNewIds, IDPrefix } from 'utils';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { IComments } from '../../exports/store/interfaces';
import {
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'commands_actions/datasheet';
export interface IInsertComment {
  cmd: CollaCommandName.InsertComment;
  datasheetId: string;
  recordId: string;
  comments: (Omit<IComments, 'commentId'| 'revision'> & { commentId?: string })[];
}

export const insertComment: ICollaCommandDef<IInsertComment> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IInsertComment) {
    const { state: state } = context;
    const { datasheetId, recordId, comments } = options;

    const snapshot = getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }
    const recordMap = snapshot.recordMap;

    if (!recordMap[recordId]) {
      return null;
    }

    const actions: IJOTAction[] = [];

    const recordComments = recordMap[recordId]!.comments;
    const commentIds = recordComments ? recordComments.map(item => item.commentId) : [];
    const action = comments.reduce<IJOTAction[]>((collection, comment) => {
      const commentId = getNewIds(IDPrefix.Comment, 1, commentIds)[0]!;
      commentIds.push(commentId);
      const insertAction = DatasheetActions.insertComment2Action(
        state,
        {
          datasheetId,
          recordId,
          insertComments: [{
            ...comment,
            commentId: commentId!,
          }],
        }
      );
      if (!insertAction) {
        return collection;
      }
      collection.push(...insertAction);
      return collection;
    }, []);

    if (!action) {
      return null;
    }
    actions.push(...action);
    if (!actions.length) { return null; }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      datasheetId,
    };
  },
};