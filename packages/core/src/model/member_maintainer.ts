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

import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'commands_actions/datasheet';
import { FieldType, IMemberField } from 'types';
import { IReduxState } from '../exports/store/interfaces';

/**
 *
 * In order to solve the problem that the current class uses setRecord and addRecord at the same time
 * to change the member information in pasteSetRecord,
 * multiple changes to the column header data are generated and overlap each other.
 * Referring to the idea of linkDataMaintainer,
 * the changes to the column header data are no longer directly generated in setRecord and addRecord,
 * but the data management is handed over to the failure of this class. Before the final data submission, unified generation
 * A changeset for headhunting data modification
 *
 *
 * TODO: At present, first solve the online problems, keep the old logic, and change the data of the entire column.
 * The subsequent iteration is the same number of checks as linkContainer. This step requires enough testing.
 */
export class MemberFieldMaintainer {
  /**
   * datasheetId -> fieldId -> unitIds
   * @type {Map<string, Map<string, string[]>>}
   * @private
   */
  private memberDataChanges: Map<string, Map<string, string[]>>;

  constructor() {
    this.memberDataChanges = new Map();
  }

  /**
   * insert current action modifications of member data
   * currently, use fieldId as key only
   * aggregate the data
   *
   * @param {string} fieldId
   * @param {string} datasheetId
   * @param {string[]} insertUnitIds
   */
  insert(fieldId: string, insertUnitIds: string[], datasheetId: string) {
    const memberFieldMap = this.memberDataChanges.get(datasheetId) || new Map();
    const unitIds = memberFieldMap.get(fieldId) || [];
    memberFieldMap.set(fieldId, [...new Set([...unitIds, ...insertUnitIds])]);
    this.memberDataChanges.set(datasheetId, memberFieldMap);

  }

  /**
   * check whether the cache data exists,
   * and at the end of other action, do a modification action to member field
   *
   * @param {IReduxState} state
   * @returns {any[] | IJOTAction[]}
   */
  flushMemberAction(state: IReduxState) {
    if (this.memberDataChanges.size === 0) {
      return [];
    }

    const actions: IJOTAction[] = [];

    /**
     * here, is the process to data, no consider whether old column data needs to remove duplications, filter
     * currently, the process handoff to the insert before, the data insert is the final complete data
     */
    this.memberDataChanges.forEach((memberFieldMap, datasheetId) => {
      const snapshot = getSnapshot(state, datasheetId)!;
      const fieldMap = snapshot.meta.fieldMap;

      memberFieldMap.forEach((cellValueForUnitIds, fieldId) => {
        const field = fieldMap[fieldId]!;

        // here, do a redundant check for field type, as a fallback behavior
        if (field.type !== FieldType.Member) {
          return;
        }

        const action = DatasheetActions.setFieldAttr2Action(snapshot, {
          field: {
            ...field,
            property: {
              ...field.property,
              unitIds: cellValueForUnitIds,
            },
          } as IMemberField,
        });

        if (!action) {
          return;
        }

        actions.push(action);
      });

    });

    this.memberDataChanges.clear();
    return actions;
  }
}