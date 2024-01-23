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

import { DatasheetActions } from '../commands_actions/datasheet';
import { without } from 'lodash';
import { BasicValueType, FieldType, ILinkField } from 'types/field_types';
import { IReduxState } from '../exports/store/interfaces';
import { ISnapshot } from 'modules/database/store/interfaces/resource/datasheet/datasheet';
import { ILinkedActions } from 'command_manager';
import { handleEmptyCellValue } from './utils';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
enum ActionFlag {
  Add = '+',
  Del = '-',
}

/**
 * for remember relation fields change.
 * the Map below string,they are: datasheetId => brotherFieldId => linkedRecordId
 * two Set strings are recordId, means add or delete.
 *
 * During the process of selection area delete and batch paste,
 * it would happen affects different  datasheet's different brotherField's different linkedRecord
 * And also, add or delete recordId
 *
 */
type ILinkedChange = Map<string, Map<string, Map<string, { add: Set<string>, del: Set<string> }>>>;

/**
 * a common class that use to maintain relation fields' data consistency
 * when CRUD to record, if there's relation fields in record, need to update relation field's records at the same time.
 */
export class LinkedDataConformanceMaintainer {
  linkedChange: ILinkedChange = new Map();

  /**
   * compare value and oldValue, auto calculate the changelog of relation records, and mark them down.
   * during one command cycle, can call insert many times.
   */
  insert(
    state: IReduxState,
    linkedSnapshot: ISnapshot,
    recordId: string,
    field: ILinkField,
    value: string[] | null,
    oldValue: string[] | null,
  ) {
    const { brotherFieldId = field.id, foreignDatasheetId } = field.property!;

    if (!value && !oldValue) {
      return;
    }

    // in `value` , but not in `oldValue`, need to add
    const toAdd = without(value, ...(oldValue || []));
    // oldValue exists,  but value don't exist, need to delete
    const toDel = without(oldValue, ...(value || []));

    toAdd.forEach(linkedRecordId => {
      this.insertLinkedRecordChange(
        foreignDatasheetId,
        brotherFieldId!,
        linkedRecordId,
        recordId,
        ActionFlag.Add,
      );
    });
    toDel.forEach(linkedRecordId => {
      const cellValueInLinkedCell = getCellValue(
        state,
        linkedSnapshot,
        linkedRecordId,
        brotherFieldId!,
        undefined,
        undefined,
        true
      ) as string[] | null;

      if (!cellValueInLinkedCell) {
        console.error(`The content of the related-record is empty, this record: ${recordId}`);
        return;
      }

      if (!cellValueInLinkedCell.includes(recordId)) {
        console.error(`No records in this table were found in the related-records, this record: ${recordId} related-record ${cellValueInLinkedCell}`);
        return;
      }

      this.insertLinkedRecordChange(
        foreignDatasheetId,
        brotherFieldId!,
        linkedRecordId,
        recordId,
        ActionFlag.Del,
      );
    });
  }

  private insertLinkedRecordChange(
    datasheetId: string,
    brotherFieldId: string,
    linkedRecordId: string,
    recordId: string,
    actionFlag: ActionFlag,
  ) {
    let datasheet = this.linkedChange.get(datasheetId);
    if (!datasheet) {
      datasheet = new Map();
      this.linkedChange.set(datasheetId, datasheet);
    }

    let brotherField = datasheet.get(brotherFieldId);
    if (!brotherField) {
      brotherField = new Map();
      datasheet.set(brotherFieldId, brotherField);
    }

    let linkedRecord = brotherField.get(linkedRecordId);
    if (!linkedRecord) {
      linkedRecord = { add: new Set<string>(), del: new Set<string>() };
      brotherField.set(linkedRecordId, linkedRecord);
    }

    if (actionFlag === ActionFlag.Add) {
      linkedRecord.add.add(recordId);
    }

    if (actionFlag === ActionFlag.Del) {
      linkedRecord.del.add(recordId);
    }
  }

  /**
   * Batch convert value changes in the associated table into LinkedActions.
   * This method will clear the value change cache. In a command cycle, it can only be executed once.
   */
  flushLinkedActions(state: IReduxState) {
    const linkedActions: ILinkedActions[] = [];
    if (this.linkedChange.size > 0) {
      this.linkedChange.forEach((datasheet, datasheetId) => {
        const snapshot = getSnapshot(state, datasheetId)!;

        const linkedAction: ILinkedActions = { datasheetId, actions: [] };
        linkedActions.push(linkedAction);

        datasheet.forEach((field, fieldId) => {
          field.forEach((changeIds, recordId) => {
            if (!snapshot) {
              console.error(`${datasheetId} for snapshot is not exit`);
              return;
            }

            if (!snapshot.recordMap[recordId]) {
              console.error(`record: ${recordId} in datasheet: ${datasheetId} does not exist！`);
              return;
            }

            const fieldType = snapshot.meta.fieldMap[fieldId] && snapshot.meta.fieldMap[fieldId]!.type;
            // Make sure that the cell is populated only when the foreign key field is indeed the relation field type.
            const cellValueInLinkedCell = (fieldType === FieldType.Link || fieldType === FieldType.OneWayLink) ?
              getCellValue(state, snapshot, recordId, fieldId, undefined, undefined, true) as string[] || [] : [];
            let newLinkedCellValue: string[] | null = without(cellValueInLinkedCell, ...changeIds.del, ...changeIds.add);
            newLinkedCellValue.push(...changeIds.add);
            newLinkedCellValue = handleEmptyCellValue(newLinkedCellValue, BasicValueType.Array);
            const action = DatasheetActions.setRecord2Action(
              snapshot,
              { recordId, fieldId, value: newLinkedCellValue },
            );

            action && linkedAction.actions.push(action);
          });
        });
      });
    }
    this.linkedChange.clear();
    return linkedActions;
  }
}
