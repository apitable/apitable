
import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands';
import { Selectors } from '../../exports/store';
import { DatasheetActions } from 'model';
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
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

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