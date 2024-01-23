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

import { ICollaCommandDef } from 'command_manager/command';
import { ExecuteResult, ICollaCommandExecuteContext } from 'command_manager/types';
import { CollaCommandName } from 'commands/enum';
import { ConfigConstant } from 'config';
import { IJOTAction } from 'engine/ot';
import { isEmpty, isEqual, isNumber, isString } from 'lodash';
import { ICellValue } from 'model/record';
import { handleEmptyCellValue } from 'model/utils/index';
import { Field } from 'model/field';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IRecordAlarm } from '../../exports/store/interfaces';
import {
  getFieldRoleByFieldId,getFieldPermissionMap,getFieldMap, getDateTimeCellAlarm, getCellValue, getActiveDatasheetId, getSnapshot
} from 'modules/database/store/selectors/resource/datasheet';
import { ResourceType, SegmentType, WithOptional } from 'types';
import { FieldType, IField, IUnitIds } from 'types/field_types';
import { getNewId, IDPrefix, num2number, str2number } from 'utils';
import { IInternalFix } from '../common/field';

export interface ISetRecordOptions {
  recordId: string;
  fieldId: string;
  field?: IField; // Optional, pass in field information. Applicable to addRecords on fields that have not been applied to snapshot
  value: ICellValue;
}

export interface ISetRecordsOptions {
  cmd: CollaCommandName.SetRecords;
  datasheetId?: string;
  alarm?: WithOptional<IRecordAlarm, 'id'>;
  data: ISetRecordOptions[];
  mirrorId?: string;
  internalFix?: IInternalFix;
}

function collectMemberProperty(datasheetId: string, actions: IJOTAction[], context: ICollaCommandExecuteContext) {
  const { state: state, memberFieldMaintainer } = context;
  const fieldMap = getFieldMap(state, datasheetId)!;
  const isAddFieldAction = actions.map(item => item.p[3]!).some(fieldId => !fieldMap[fieldId]);
  if (isAddFieldAction) {
    return actions;
  }
  const memberFieldIds: string[] = [];
  const unitIdsMap: Map<string, IUnitIds> = new Map();

  // Check if there is a modification to the member field in the current OP, if so,
  // Collect OI (written) data into operateRecordIds, and also collect related fieldIds into memberFieldIds
  actions.forEach(item => {
    const fieldId = item.p[3] as string;
    const field = fieldMap[fieldId]!;

    if (field.type !== FieldType.Member) {
      return;
    }

    memberFieldIds.push(fieldId);

    // oi and od exist in op, if only od is to delete data, there is no need to collect
    if ('oi' in item) {
      const existValue = unitIdsMap.get(fieldId) || [];
      unitIdsMap.set(fieldId, [...new Set([...existValue, ...item['oi']])]);
    }
  });

  // Put the data collected according to fieldId into the property of the corresponding field
  memberFieldIds.forEach(fieldId => {
    const collectUnitIds = unitIdsMap.get(fieldId) || [];
    const field = fieldMap[fieldId]!;
    // The unitIds of members are dynamically calculated, which will cause the position of the kanban to change in the kanban.
    // Therefore, in the data collection, the unitIds stored in the property and all the data of the collected cells are merged,
    // and the duplicates are removed.
    // This can ensure that the order of the existing data in unitIds does not change,
    // and then perform "intersection" processing with the result and the collected data, and take out the same part
    // (i.e. that is, the data from the cell phone, but it is guaranteed the data order of the original unitIds)
    const unDuplicateArray = [...new Set([...field.property.unitIds, ...collectUnitIds])];
    const newProperty = unDuplicateArray.filter(item => item);
    memberFieldMaintainer.insert(fieldId, newProperty as string[], datasheetId);
  });
  return actions;
}

export const setRecords: ICollaCommandDef<ISetRecordsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state, ldcMaintainer, fieldMapSnapshot } = context;
    const { data: _data, internalFix, alarm } = options;
    const datasheetId = options.datasheetId || getActiveDatasheetId(state)!;
    const mirrorId = options.mirrorId;
    const snapshot = getSnapshot(state, datasheetId);
    const fieldPermissionMap = getFieldPermissionMap(state);

    if (!snapshot) {
      return null;
    }

    const data = _data.filter(item => {
      const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
      if (fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
        return false;
      }
      return true;
    });

    if (isEmpty(data)) {
      return null;
    }

    const fieldMap = snapshot.meta.fieldMap;
    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { recordId, fieldId, field: fieldProp } = recordOption;
      const field = fieldMap[fieldId] || fieldProp;
      let value = recordOption.value;

      // field does not exist, the data does not take effect
      if (!field || !Field.bindContext(field, state).recordEditable(datasheetId, mirrorId) && !internalFix?.anonymouFix) {
        return collected;
      }

      // Number/currency/percentage fields need special processing, string to number, number of significant digits, etc.
      if (field.type === FieldType.Number || field.type === FieldType.Currency || field.type === FieldType.Percent) {
        if (isString(value)) {
          value = str2number(value);
        } else if (isNumber(value)) {
          value = num2number(value);
        } else {
          value = null;
        }
      }

      if (field.type === FieldType.URL && Array.isArray(value)) {
        value = value?.map((v: any) => ({
          ...v,
          type: SegmentType.Url,
          text: v.link || v.text,
          title: v.title || v.text,
        })) as any;
      }

      // There will be some data problems on the line, and brotherFieldId will also exist in the case of self-table association,
      // resulting in the existence of redundant actions
      if (field.type === FieldType.Link && field.property.brotherFieldId && field.property.foreignDatasheetId !== datasheetId) {
        /**
         * Data consistency maintenance for associated field cells:
         * Guarantee the interrelated consistency of the cell data in brotherField in two different datasheets that are related to each other.
         * That is: when an associated record is added to the associated field cell of a datasheet.
         * In the related datasheet sibling fields, a corresponding association relationship should be created.
         * The same is true when deleting a record.
         */
        const oldValue = getCellValue(state, snapshot, recordId, fieldId) as string[] | null;
        const linkedSnapshot = getSnapshot(state, field.property.foreignDatasheetId)!;
        ldcMaintainer.insert(
          state,
          linkedSnapshot,
          recordId,
          field,
          value as string[] | null,
          oldValue,
        );
      }

      // if val.value is an empty array then it will be null
      value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);
      fieldMapSnapshot[field.id] = field;
      const action = DatasheetActions.setRecord2Action(snapshot, { recordId, fieldId, value });
      action && collected.push(action);

      if (field.type === FieldType.DateTime) {
        const cacheAlarm = getDateTimeCellAlarm(snapshot, recordId, field.id);
        /**
         * remove alarm
         * 1. Delete date cell data
         * 2. The date cell has data to remove the alarm clock directly
         */
        if ((value === null && cacheAlarm) || (Boolean(value) && cacheAlarm && !alarm)) {
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: null,
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        } else if (Boolean(value) && !cacheAlarm && Boolean(alarm)) { // new alarm
          const newAlarmId = getNewId(IDPrefix.DateTimeAlarm);
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: {
              ...alarm!,
              id: newAlarmId,
            },
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        } else if (Boolean(value) && !isEqual(cacheAlarm, alarm)) { // edit alarm
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: {
              ...cacheAlarm!,
              ...alarm!,
            },
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        }
      }

      return collected;
    }, []);

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: collectMemberProperty(datasheetId, actions, context),
      fieldMapSnapshot
    };
  },
};
