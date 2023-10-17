import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';
import { DatasheetActions } from 'model';
import { IJOTAction } from 'engine/ot';

export interface IArchiveRecordOptions {
  cmd: CollaCommandName.ArchiveRecords;
  data: string[];
  datasheetId?: string;
}

export const archiveRecord: ICollaCommandDef<IArchiveRecordOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }
    const getFieldByFieldId = (fieldId: string) => {
      return Selectors.getField(state, fieldId, datasheetId);
    };
    const actions: IJOTAction[] = [];

    const deleteRecordAction = DatasheetActions.deleteRecords(snapshot, {
      recordIds: data,
      getFieldByFieldId,
      state,
    });
    const addArchivedRecordIdsActions = DatasheetActions.addArchivedRecordIds2Action(snapshot, { recordIds: data });
    if(deleteRecordAction && addArchivedRecordIdsActions) {
      deleteRecordAction.forEach(action => { 
        actions.push(action);
      });
      addArchivedRecordIdsActions.forEach(action => { 
        actions.push(action);
       });
      
    } else {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};
