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

import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IJOTAction, IObjectReplaceAction } from 'engine';
import { isEqual, omit } from 'lodash';
import { Field } from 'model/field';
import { handleEmptyCellValue } from 'model/utils';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ICellValue } from 'model/record';
import { IRecordAlarm } from '../../exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
import { AlarmUsersType } from 'modules/database/store/interfaces/resource/datasheet/datasheet';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getRangeRecords } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { getDateTimeCellAlarm,getRangeFields } from 'modules/database/store/selectors/resource/datasheet/calc';
import { IViewColumn, IViewRow } from '../../exports/store/interfaces';
import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { getRangeRows, getSelectRanges } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { getActualRowCount, getVisibleColumns } from 'modules/database/store/selectors/resource/datasheet/calc';
import { ResourceType } from 'types';
import { FieldType, IField, IStandardValue } from 'types/field_types';
import { getNewId, IDPrefix } from 'utils';
import { CollaCommandName } from '..';
import { addRecords } from './add_records';
import { ISetRecordOptions, setRecords } from './set_records';

export interface IPasteSetRecordsOptions {
  cmd: CollaCommandName.PasteSetRecords;
  row: number;
  column: number;
  viewId: string;
  fields: Omit<IField, 'id'>[];
  recordIds?: string[];
  stdValues: IStandardValue[][];
  cut?: {
    datasheetId: string;
    rows: IViewRow[];
    columns: IViewColumn[];
  };
  groupCellValues?: ICellValue[];
  notifyExistIncompatibleField?: () => void;
}

export const pasteSetRecords: ICollaCommandDef<IPasteSetRecordsOptions> = {
  undoable: true,
  execute: (context, options) => {
    const { state: state, fieldMapSnapshot } = context;
    const { recordIds, column, row, viewId, stdValues, cut, groupCellValues, notifyExistIncompatibleField } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    const userInfo = state.user.info;
    if (!snapshot) {
      return null;
    }

    const view = getViewById(snapshot, viewId);
    // Currently only the Grid view has paste
    if (!view || ![ViewType.Grid, ViewType.Gantt].includes(view.type)) {
      return null;
    }

    if (isNaN(column) || column < 0) {
      return null;
    }

    if (isNaN(row) || row < 0) {
      return null;
    }

    const fieldMap = snapshot.meta.fieldMap;
    const newRecordCount = stdValues.length;
    if (newRecordCount === 0) {
      return null;
    }

    const actions: IJOTAction[] = [];
    // oi action for compensation when adding an alarm
    const defaultAlarmActions: IObjectReplaceAction[] = [];
    // Add the oi action that the alarm clock actually takes effect
    const realAlarmActions: IObjectReplaceAction[] = [];
    const linkedActions: ILinkedActions[] = [];
    const recordValues: ISetRecordOptions[] = [];
    // first delete the part that needs to be cut
    if (cut) {
      const datasheetId = cut.datasheetId;
      if (datasheetId === state.pageParams.datasheetId) {
        const cutRows = cut.rows;
        const cutColumns = cut.columns;
        cutRows.forEach(row => {
          cutColumns.forEach(column => {
            const field = fieldMap[column.fieldId];
            if (field && field.type !== FieldType.NotSupport && field.type !== FieldType.WorkDoc) {
              recordValues.push({
                recordId: row.recordId,
                fieldId: column.fieldId,
                value: null,
              });
            }
          });
        });
      }
    }

    // There is already record paste assignment
    const columnCount = options.fields.length;
    const visibleColumns = getVisibleColumns(state)!;
    const columnsToPaste = visibleColumns.slice(column, column + columnCount);
    if (columnsToPaste.length === 0) {
      return null;
    }
    const recordIdsToPaste = getRangeRows(state, row, row + newRecordCount).map(r => r.recordId);

    function addAlarm(cv: ICellValue, field: IField, recordId: string, oldRecordId: string) {
      if (field.type === FieldType.DateTime && cv && snapshot) {
        const alarm = getDateTimeCellAlarm(snapshot, oldRecordId, field.id);
        if (alarm) {
          const curAlarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId: field.id,
            alarm: {
              id: getNewId(IDPrefix.DateTimeAlarm),
              ...omit(alarm, 'id'),
              // If the copy is another member, the alarm set by others will be changed to himself
              alarmUsers: userInfo && alarm.alarmUsers?.[0]!.type === AlarmUsersType.Member ? [{
                type: AlarmUsersType.Member,
                data: userInfo.unitId,
              }] : alarm.alarmUsers,
            } as IRecordAlarm,
          }) as IObjectReplaceAction[];
          if (curAlarmActions) {
            // there is a compensated OP
            if (curAlarmActions.length === 2) {
              /**
               * p same merge (merge of peers into one oi action)
               * p is not the same, not merged (different lines are oi action alone)
               */
              let isMerged = false;
              defaultAlarmActions.forEach((action, idx) => {
                if (isEqual(action.p, curAlarmActions[0]!.p)) {
                  defaultAlarmActions[idx]!.oi = {
                    ...curAlarmActions[0]!.oi,
                    ...action.oi,
                  };
                  isMerged = true;
                }
              });
              if (!isMerged) {
                defaultAlarmActions.push(curAlarmActions[0]!);
              }
              realAlarmActions.push(curAlarmActions[1]!);
            } else {
              realAlarmActions.push(...curAlarmActions);
            }
          }
        }
      }
    }

    function pushPasteValue(stdValue: IStandardValue, field: IField, recordId: string, oldRecordId?: string) {
      if (!field || field.type === FieldType.NotSupport || field.type === FieldType.WorkDoc) {
        return;
      }

      let value = Field.bindContext(field, state).stdValueToCellValue(stdValue);
      value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);

      if (value == null && stdValue.data.length && field.type !== stdValue.sourceType) {
        // This indicates that there is a mismatched type
        notifyExistIncompatibleField?.();
      }

      recordValues.push({
        fieldId: field.id,
        recordId,
        value,
      });

      // Paste the cell as a date type, with a value and with an alarm
      oldRecordId && addAlarm(value, field, recordId, oldRecordId);

    }

    // In the case where only one cell is copied, paste over the selection
    const singleCellPaste = stdValues.length === 1 && stdValues[0]!.length === 1;
    if (singleCellPaste) {
      const ranges = getSelectRanges(state)!;
      const range = ranges[0]!;
      const rows = getRangeRecords(state, range);
      const fields = getRangeFields(state, range, datasheetId);
      if (!rows || !fields) {
        return null;
      }
      for (const row of rows) {
        const recordId = row.recordId;
        for (const field of fields) {
          pushPasteValue(stdValues[0]![0]!, field, recordId, recordIds?.[0]);
        }
      }
      // When multiple cells are copied, the negative value area shall prevail, the selection area is irrelevant
    } else {
      for (let i = 0; stdValues[i] && recordIdsToPaste[i]; i++) {
        const recordId = recordIdsToPaste[i]!;
        const stdValuesRow = stdValues[i]!;
        for (let c = 0; stdValuesRow[c] && columnsToPaste[c]; c++) {
          const fieldId = columnsToPaste[c]!.fieldId;
          const stdValue = stdValuesRow[c]!;
          const field = fieldMap[fieldId]!;
          pushPasteValue(stdValue, field, recordId, recordIds?.[i]);
        }
      }
    }

    const rst = setRecords.execute(context, { cmd: CollaCommandName.SetRecords, data: recordValues });
    if (rst) {
      if (rst.result === ExecuteResult.Fail) {
        return rst;
      }
      Object.assign(fieldMapSnapshot, rst.fieldMapSnapshot || {});
      actions.push(...rst.actions);
    }

    // Add new line and paste assignment for augmented line
    const newStdValues = stdValues.slice(recordIdsToPaste.length);
    if (newStdValues.length) {
      const recordValues: { [fieldId: string]: ICellValue }[] = [];
      const oldRecordIds: string[] = [];
      for (let row = 0; newStdValues[row]; row++) {
        const stdValuesRow = newStdValues[row]!;
        const cellValues: { [fieldId: string]: ICellValue } = {};
        // Convert a line to a record
        for (let column = 0; stdValuesRow[column] && columnsToPaste[column]; column++) {
          const fieldId = columnsToPaste[column]!.fieldId;
          const stdValue = stdValuesRow[column]!;
          const field = fieldMap[fieldId];
          if (!field || field.type === FieldType.NotSupport || field.type === FieldType.WorkDoc) {
            continue;
          }
          let value = Field.bindContext(field, state).stdValueToCellValue(stdValue);
          value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);
          cellValues[fieldId] = value;
        }
        recordValues.push(cellValues);
        recordIds && oldRecordIds.push(recordIds[recordIdsToPaste.length + row]!);
      }
      const rst = addRecords.execute(context, {
        cmd: CollaCommandName.AddRecords,
        viewId,
        index: getActualRowCount(state)!,
        count: newStdValues.length,
        groupCellValues,
        cellValues: recordValues,
      });
      if (rst) {
        if (rst.result === ExecuteResult.Fail) {
          return rst;
        }
        Object.assign(fieldMapSnapshot, rst.fieldMapSnapshot || {});
        actions.push(...rst.actions);

        const newRecordIds = rst.data as string[];
        recordValues.forEach((rv, cvIndex) => {
          Object.keys(rv).forEach(fId => {
            addAlarm(rv[fId]!, fieldMap[fId]!, newRecordIds[cvIndex]!, oldRecordIds[cvIndex]!);
          });
        });
      }
    }

    if (realAlarmActions.length > 0) {
      actions.push(...defaultAlarmActions);
      actions.push(...realAlarmActions);
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
      fieldMapSnapshot
    };
  },
};
