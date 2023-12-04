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

import { ResourceType } from 'types';
import { getRecord } from 'modules/database/store/selectors/resource/datasheet/base';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction } from 'engine';
import { IComments } from '../../exports/store/interfaces';
import { DatasheetActions } from 'commands_actions/datasheet';

export interface IUpdateComment {
  cmd: CollaCommandName.UpdateComment;
  datasheetId: string;
  recordId: string;
  comments: IComments;
  emojiAction?: boolean;
}

export const updateComment: ICollaCommandDef<IUpdateComment> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IUpdateComment) {
    const { state: state } = context;
    const { recordId, datasheetId, comments, emojiAction } = options;
    const actions: IJOTAction[] = [];
    const record = getRecord(state, recordId, datasheetId);
    if (!record) {
      return null;
    }

    const updateCommentAction = DatasheetActions.updateComment2Action({
      datasheetId,
      recordId,
      updateComments: [comments],
      emojiAction
    });

    if (!updateCommentAction) { return null; }

    actions.push(...updateCommentAction);
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

