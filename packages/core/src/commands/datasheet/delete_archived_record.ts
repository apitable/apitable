
import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IJOTAction } from 'engine/ot';
import { ResourceType } from 'types';

export interface IDeleteArchivedRecordsOptions {
  cmd: CollaCommandName.DeleteArchivedRecords;
  data: any[];
  datasheetId?: string;
}

export const deleteArchivedRecords: ICollaCommandDef<IDeleteArchivedRecordsOptions> = {
  undoable: false,
  execute: (context, options) => {
    const { state: state } = context;
    const { data } = options;
    const datasheetId = options.datasheetId || getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const actions: IJOTAction[] = [];

    const unarchiveRecordsActions = DatasheetActions.deleteArchivedRecords2Action(snapshot, { recordsData: data });

    if(unarchiveRecordsActions) {
      unarchiveRecordsActions.forEach(action => {
        actions.push(action);
      });
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  }
};