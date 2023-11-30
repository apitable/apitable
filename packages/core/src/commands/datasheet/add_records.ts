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

import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { ICellValue } from 'model/record';
import { DatasheetActions } from 'commands_actions/datasheet';
import { getDatasheetLoading } from 'modules/database/store/selectors/resource/datasheet/base';
import { getNewIds, IDPrefix } from 'utils';
import { IJOTAction } from 'engine';
import { getActiveDatasheetId,getSnapshot, getFieldPermissionMap,getFieldRoleByFieldId } from 'modules/database/store/selectors/resource/datasheet/base';
import { FieldType, IField, ILinkField, ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import { CollaCommandName } from 'commands/enum';
import { ConfigConstant } from 'config';

export interface IAddRecordsOptions {
  cmd: CollaCommandName.AddRecords;
  datasheetId?: string;
  viewId: string;
  index: number;
  count: number;
  groupCellValues?: ICellValue[];

  // Fill in the new value added to the cell, cellValues.length must be equal to count;
  cellValues?: { [fieldId: string]: ICellValue }[];
  ignoreFieldPermission?: boolean;
  ignoreFieldLimit?: boolean;
}

export type IAddRecordsResult = string[];
const MAX_RECORD_NUM = 50000;

export const addRecords: ICollaCommandDef<IAddRecordsOptions, IAddRecordsResult> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state, ldcMaintainer, memberFieldMaintainer, fieldMapSnapshot } = context;
    const { viewId, index, count, groupCellValues, cellValues, ignoreFieldPermission, ignoreFieldLimit } = options;
    const datasheetId = options.datasheetId || getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
    const loading = getDatasheetLoading(state, datasheetId);

    if(loading){
      throw new Error(t(Strings.datasheet_is_loading));
    }

    if (!snapshot) {
      return null;
    }

    if (count <= 0 || isNaN(count)) {
      return null;
    }

    if (cellValues && cellValues.length !== count) {
      throw new Error(t(Strings.error_add_row_failed_wrong_length_of_value));
    }

    const recordIds = Object.keys(snapshot.recordMap);
    const newRecordIds = getNewIds(IDPrefix.Record, count, recordIds.length ? recordIds : snapshot.meta.views[0]!.rows.map(item => item.recordId));

    if ((recordIds.length + newRecordIds.length) > MAX_RECORD_NUM) {
      throw new Error(t(Strings.max_record_num_per_dst));
    }

    const linkFieldIds: IField[] = [];
    const specialActions: IJOTAction[] = [];
    const fieldMap = snapshot.meta.fieldMap;

    for (const fieldId in fieldMap) {
      const field = fieldMap[fieldId]!;
      if (field.type === FieldType.Link && field.property.brotherFieldId) {
        linkFieldIds.push(field);
      }
      if (field.type === FieldType.CreatedBy) {
        const uuids = field.property.uuids;
        const uuid = state.user.info && state.user.info['uuid'];
        if (uuid && !uuids.includes(uuid)) {
          const newField = {
            ...field,
            property: {
              ...field.property,
              uuids: [...uuids, uuid],
            },
          };
          const action = DatasheetActions.setFieldAttr2Action(snapshot, { field: newField });
          action && specialActions.push(action);
        }
      }
    }
    const memberFieldMap: { [key: string]: string[] } = {};

    /**
     * Add a new record, the record may be a blank record, or there may be some initialized data,
     * The data of the initialized data has three parts:
     * 1. Copy a record, the original data in the target record
     * 2. There is a filter item, if the filter value is a certain value, the filter item will be included
     * 3. There is a group item, adding a record in a group will bring the data of the group
     * Assuming that a record is added, and the above three parts have corresponding data,
     * the weights will decrease in turn, that is, for the same field,
     * the data from the next-level source will be overwritten by the data from the previous-level source.
     */
    const actions = newRecordIds.reduce<IJOTAction[]>((collected, recordId, i) => {
      const userInfo = state.user.info!;
      const newRecord = DatasheetActions.getDefaultNewRecord(state, snapshot, recordId, viewId, groupCellValues, userInfo);
      if (cellValues) {
        newRecord.data = Object.assign({}, newRecord.data, cellValues[i]);
      }

      /**
       * Add a new record, which may be substituted into the initial value due to filtering, grouping, and copying a row.
       * If permission is set for one of the columns, and the current user does not have editing permission,
       * the data of the corresponding column needs to be filtered out when setting the data.
       * Because all data will pass here after processing, unified filtering is performed here
       */
      if (fieldPermissionMap && !ignoreFieldPermission) {
        const _data = {};
        for (const fieldId in newRecord.data) {
          const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);
          if (!fieldRole || fieldRole === ConfigConstant.Role.Editor) {
            _data[fieldId] = newRecord.data[fieldId];
          }
        }
        newRecord.data = _data;
      }

      /**
       * If there is data in the member field in the added record, special processing is required.
       * In the current logic, the member field header will record the unitId of all members in the current column after deduplication,
       * Therefore, when a new record is added and there is initialization data,
       * and the content of the member field exists in the data,
       * it is necessary to check whether the newly added unitId exists in the header.
       * If it does not exist, the data of the member header needs to be updated synchronously
       */
      if (newRecord.data) {
        const _recordData = {};
        for (const [fieldId, cellValue] of Object.entries(newRecord.data)) {
          // ignore workdoc field cellValue
          if (!fieldMap[fieldId] || (fieldMap[fieldId]!.type === FieldType.WorkDoc && !ignoreFieldLimit)) {
            // Compatible processing for data exceptions, some tables in the template center have dirty data
            continue;
          }

          // There will be column data that does not exist in the row record. After the middle layer strengthens the verification,
          // this part of the data will cause an error, so only the column data that still exists in the fieldId is retained here.
          _recordData[fieldId] = cellValue;
          fieldMapSnapshot[fieldId] = fieldMap[fieldId]!;

          if (fieldMap[fieldId]!.type !== FieldType.Member) {
            continue;
          }

          const unitIds = Array.isArray(cellValue) ? cellValue as string[] : [];

          if (!memberFieldMap[fieldId]) {
            memberFieldMap[fieldId] = [...unitIds];
            continue;
          }

          memberFieldMap[fieldId]!.push(...unitIds);
        }
        newRecord.data = _recordData;
      }
      const action = DatasheetActions.addRecord2Action(snapshot, {
        viewId,
        record: newRecord,
        index: index + i,
        newRecordIndex: i,
      });

      if (!action) {
        return collected;
      }

      (linkFieldIds as ILinkField[]).forEach((field: ILinkField) => {
        const value = newRecord.data[field.id] as string[] | null;
        const linkedSnapshot = getSnapshot(state, field.property.foreignDatasheetId)!;

        // When the associated field cell itself has no value, do nothing
        if (!value) {
          return;
        }
        ldcMaintainer.insert(state, linkedSnapshot, newRecord.id, field, value, null);
      });
      collected.push(...action);

      return collected;
    }, []);
    for (const [fieldId, cellValueForUnitIds] of Object.entries(memberFieldMap)) {
      const field = fieldMap[fieldId]!;
      const unitIds = field.property.unitIds || [];
      const _unitIds = [...new Set([...unitIds, ...cellValueForUnitIds])];
      if (_unitIds.length === unitIds.length) {
        continue;
      }
      memberFieldMaintainer.insert(fieldId, _unitIds as string[], datasheetId);
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      data: newRecordIds,
      actions: [...actions, ...specialActions],
      fieldMapSnapshot,
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
