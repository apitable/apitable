
import { ICollaCommandDef, ExecuteResult, ILinkedActions } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IJOTAction, OTActionName } from 'engine/ot';
import { FieldType, ResourceType } from 'types';
import { getCellValue } from '../../modules/database/store/selectors/resource';
import { isEqual } from 'lodash';

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
    const linkedActions: ILinkedActions[] = [];

    // when delete archive record, clear linked archived records
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId]!;
      const _linkedActions: IJOTAction[] = [];
      if (field.type === FieldType.Link && field.property.brotherFieldId && field.property.foreignDatasheetId !== datasheetId) {
        const linkedSnapshot = getSnapshot(state, field.property.foreignDatasheetId)!;
        data.forEach(record => {
          const recordId = record.id;
          const value = record.data[fieldId] as string[] | null;
          if (value) {
            value.forEach(id => {
              const oldValue = getCellValue(state, linkedSnapshot, id, field.property.brotherFieldId!) as string[] | null;
              const value = oldValue ? oldValue.filter(v => v !== recordId) : null;
              if (isEqual(value, oldValue)) {
                return;
              }
              const path = ['recordMap', id, 'data', field.property.brotherFieldId!];
              const samePathIndex = _linkedActions.findIndex(action => isEqual(action.p, path));
              if (samePathIndex > -1) {
                // @ts-ignore
                _linkedActions[samePathIndex].oi = _linkedActions[samePathIndex].oi.filter(v => v !== recordId);
              } else {
                _linkedActions.push({
                  n: OTActionName.ObjectReplace,
                  p: path,
                  oi: value,
                  od: oldValue,
                });
              }
            });
          }
        });
        linkedActions.push({
          datasheetId: field.property.foreignDatasheetId,
          actions: _linkedActions,
        });
      }
    }

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
      linkedActions,
    };
  }
};