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

import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { DatasheetActions } from 'commands_actions/datasheet';
import {
  getActiveDatasheetId,
  getSnapshot,
  getField,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { FieldType, ILinkField, ResourceType } from 'types';
import { Player, Events } from '../../modules/shared/player';
import { CollaCommandName } from 'commands/enum';

export interface IDeleteRecordOptions {
  cmd: CollaCommandName.DeleteRecords;
  data: string[];
  datasheetId?: string
}

export const deleteRecord: ICollaCommandDef<IDeleteRecordOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state, ldcMaintainer } = context;
    const { data } = options;
    const datasheetId = options.datasheetId || getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const linkField: ILinkField[] = [];
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId]!;
      if (field.type === FieldType.Link) {
        linkField.push(field);
      }
    }

    const getFieldByFieldId = (fieldId: string) => {
      return getField(state, fieldId, datasheetId);
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
            reLinkRecords[id]!.push(v.id);
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
        let oldValue: string[] | undefined;
        // two tables are associated
        if (field.property.brotherFieldId) {
          oldValue = record.data[field.id] as string[] | undefined;
        } else {
          // self-association
          oldValue = fieldRelinkMap[field.id]![record.id] || undefined;
          // LinkedActions are not generated when the self-table is associated and the associated record contains the deleted record itself
          oldValue = oldValue?.filter(item => !data.includes(item));
        }

        const linkedSnapshot = getSnapshot(state, field.property.foreignDatasheetId)!;

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
