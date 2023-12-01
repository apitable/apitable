
import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IJOTAction } from 'engine/ot';
import { FieldType, ResourceType } from 'types';

export interface IUnarchiveRecordsOptions {
  cmd: CollaCommandName.UnarchiveRecords;
  data: any[];
  datasheetId?: string;
}

export const unarchiveRecords: ICollaCommandDef<IUnarchiveRecordsOptions> = {
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

    const linkFieldIds: string[] = [];
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId]!;
      if (field.type === FieldType.Link) {
        linkFieldIds.push(fieldId);
      }
    }

    const unarchiveRecordsActions = DatasheetActions.unarchivedRecords2Action(snapshot, { recordsData: data, linkFields: linkFieldIds });

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
