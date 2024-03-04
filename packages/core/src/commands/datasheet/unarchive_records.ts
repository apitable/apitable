
import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IJOTAction } from 'engine/ot';
import { FieldType, ResourceType } from 'types';
import { getCellValue } from 'modules/database/store/selectors/resource';
import { IDPrefix } from 'utils';

export interface IUnarchiveRecordsOptions {
  cmd: CollaCommandName.UnarchiveRecords;
  data: any[];
  datasheetId?: string;
}

export const unarchiveRecords: ICollaCommandDef<IUnarchiveRecordsOptions> = {
  undoable: false,
  execute: (context, options) => {
    const { state: state, ldcMaintainer } = context;
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
      if (field.type === FieldType.Link && field.property.brotherFieldId && field.property.foreignDatasheetId !== datasheetId) {
        data.forEach(record => {
          const recordId = record.id;
          const value = record.data[fieldId];
          const oldValue = getCellValue(state, snapshot, recordId, fieldId) as string[] | null;
          const linkedSnapshot = getSnapshot(state, field.property.foreignDatasheetId)!;
          const isValueValid = value ? Array.isArray(value) && value.every(v => v.startsWith(IDPrefix.Record)) : true;
          const isOldValueValid = oldValue ? Array.isArray(oldValue) && oldValue.every(v => v.startsWith(IDPrefix.Record)) : true;
          if (isValueValid && isOldValueValid) {
            ldcMaintainer.insert(
              state,
              linkedSnapshot,
              recordId,
              field,
              value as string[] | null,
              oldValue,
            );
          }
        });
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
