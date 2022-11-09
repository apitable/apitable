import { ResourceType } from 'types';
import { getRecord } from '../../exports/store/selectors';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { CollaCommandName } from 'commands';
import { IJOTAction } from 'engine';
import { IComments } from '../../exports/store';
import { DatasheetActions } from '../../model';

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
    const { model: state } = context;
    const { recordId, datasheetId, comments, emojiAction } = options;
    const actions: IJOTAction[] = [];
    const record = getRecord(state, recordId, datasheetId);
    if (!record) {
      return null;
    }

    const deleteCommentAction = DatasheetActions.updateComment2Action({
      datasheetId,
      recordId,
      updateComments: [comments],
      emojiAction
    });

    if (!deleteCommentAction) { return null; }

    actions.push(...deleteCommentAction);
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

