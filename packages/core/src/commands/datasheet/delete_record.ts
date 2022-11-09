import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { DatasheetActions } from 'model';
import { Selectors } from '../../exports/store';
import { FieldType, ILinkField, ResourceType } from 'types';
import { Player, Events } from '../../modules/shared/player';
import { CollaCommandName } from 'commands';

export interface IDeleteRecordOptions {
  cmd: CollaCommandName.DeleteRecords;
  data: string[];
  datasheetId?: string
}

export const deleteRecord: ICollaCommandDef<IDeleteRecordOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state, ldcMaintainer } = context;
    const { data } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const linkField: ILinkField[] = [];
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId];
      if (field.type === FieldType.Link) {
        linkField.push(field);
      }
    }

    const getFieldByFieldId = (fieldId: string) => {
      return Selectors.getField(state, fieldId, datasheetId);
    };

    const actions = DatasheetActions.deleteRecords(snapshot, {
      recordIds: data,
      getFieldByFieldId,
      state,
    });

    /**
     * According to the self-association field, generate a map, the key is recordId, 
     * and the value is the id array of those records associated with this recordId.
     * Multiple self-associated fields will have multiple such maps
     */
    const fieldRelinkMap: { [fieldId: string]: { [recordId: string]: string[] } } = {};
    linkField.filter(field => {
      // Filter out the associated field of the word table
      return !field.property.brotherFieldId;
    }).forEach(field => {
      const reLinkRecords: { [recordId: string]: string[] } = {};
      Object.values(snapshot.recordMap).forEach(v => {
        const linkRecords = v.data[field.id] as string[] | undefined;
        if (linkRecords) {
          linkRecords.forEach(id => {
            if (!reLinkRecords[id]) {
              reLinkRecords[id] = [];
            }
            reLinkRecords[id].push(v.id);
          });
        }
      });
      fieldRelinkMap[field.id] = reLinkRecords;
    });

    data.forEach(recordId => {
      const record = snapshot.recordMap[recordId];
      if (!record) {
        return;
      }
      linkField.forEach((field: ILinkField) => {
        let oldValue: string[] | null = null;
        // two tables are associated
        if (field.property.brotherFieldId) {
          oldValue = record.data[field.id] as string[] | null;
        } else {
          // self-association
          oldValue = fieldRelinkMap[field.id][record.id] || null;
          // LinkedActions are not generated when the self-table is associated and the associated record contains the deleted record itself
          oldValue = oldValue?.filter(item => !data.includes(item));
        }

        const linkedSnapshot = Selectors.getSnapshot(state, field.property.foreignDatasheetId)!;

        // When the associated field cell itself has no value, do nothing
        if (!oldValue?.length) {
          return;
        }
        if (!linkedSnapshot) {
          return Player.doTrigger(Events.app_error_logger, {
            error: new Error(`foreignDatasheet:${field.property.foreignDatasheetId} has been deleted`),
            metaData: { foreignDatasheetId: field.property.foreignDatasheetId },
          });
        }
        ldcMaintainer.insert(state, linkedSnapshot, record.id, field, null, oldValue);
      });
    }, []);

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddRecordsOptions & { cmd: 'AddRecords' }): ICollaCommandExecuteResult<IAddRecordsResult>;
 }
 }

 */
