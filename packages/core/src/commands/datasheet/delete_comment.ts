import { ResourceType } from 'types';
import { getRecord } from '../../exports/store/selectors';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { CollaCommandName } from 'commands';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'model';
import { IComments } from '../../exports/store';

export interface IDeleteComment {
  cmd: CollaCommandName.DeleteComment;
  datasheetId: string;
  recordId: string;
  comment: IComments;
}

export const deleteComment: ICollaCommandDef<IDeleteComment> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IDeleteComment) {
    const { model: state } = context;
    const { recordId, datasheetId, comment } = options;
    const actions: IJOTAction[] = [];
    const record = getRecord(state, recordId, datasheetId);
    if (!record) {
      return null;
    }

    const deleteCommentAction = DatasheetActions.deleteComment2Action({ datasheetId, recordId, comments: [comment] });

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
