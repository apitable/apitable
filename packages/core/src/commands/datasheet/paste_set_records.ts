import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IJOTAction, IObjectReplaceAction } from 'engine';
import { isEqual, omit } from 'lodash';
import { DatasheetActions, Field, handleEmptyCellValue, ICellValue } from 'model';
import { AlarmUsersType, IRecordAlarm, Selectors, ViewType } from 'store';
import { IViewColumn, IViewRow } from 'store/interface';
import { getActualRowCount, getRangeRows, getSelectRanges, getViewById, getVisibleColumns } from 'store/selector';
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
    const { model: state, fieldMapSnapshot } = context;
    const { recordIds, column, row, viewId, stdValues, cut, groupCellValues, notifyExistIncompatibleField } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const userInfo = state.user.info;
    if (!snapshot) {
      return null;
    }

    const view = getViewById(snapshot, viewId);
    // 目前只有 Grid 视图才有粘贴
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
    // 新增闹钟时补偿的 oi action
    const defaultAlarmActions: IObjectReplaceAction[] = [];
    // 新增闹钟实际生效的 oi action
    const realAlarmActions: IObjectReplaceAction[] = [];
    const linkedActions: ILinkedActions[] = [];
    const recordValues: ISetRecordOptions[] = [];
    // 先删掉需要剪切的部分
    if (cut) {
      const datasheetId = cut.datasheetId;
      if (datasheetId === state.pageParams.datasheetId) {
        const cutRows = cut.rows;
        const cutColumns = cut.columns;
        cutRows.forEach(row => {
          cutColumns.forEach(column => {
            const field = fieldMap[column.fieldId];
            if (field && field.type !== FieldType.NotSupport) {
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

    // 已有 record 粘贴赋值
    const columnCount = options.fields.length;
    const visibleColumns = getVisibleColumns(state);
    const columnsToPaste = visibleColumns.slice(column, column + columnCount);
    if (columnsToPaste.length === 0) {
      return null;
    }
    const recordIdsToPaste = getRangeRows(state, row, row + newRecordCount).map(r => r.recordId);

    function addAlarm(cv: ICellValue, field: IField, recordId: string, oldRecordId: string) {
      if (field.type === FieldType.DateTime && cv && snapshot) {
        const alarm = Selectors.getDateTimeCellAlarm(snapshot, oldRecordId, field.id);
        if (alarm) {
          const curAlarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId: field.id,
            alarm: {
              id: getNewId(IDPrefix.DateTimeAlarm),
              ...omit(alarm, 'id'),
              // 复制如果是其他成员会将他人设置的闹钟改为自己
              alarmUsers: userInfo && alarm.alarmUsers?.[0].type === AlarmUsersType.Member ? [{
                type: AlarmUsersType.Member,
                data: userInfo.unitId,
              }] : alarm.alarmUsers,
            } as IRecordAlarm,
          }) as IObjectReplaceAction[];
          if (curAlarmActions) {
            // 存在补偿的 OP
            if (curAlarmActions.length === 2) {
              /**
               * p 相同的合并（同行的合并成一个 oi action）
               * p 不相同的不合并（不同行单独为 oi action）
               */
              let isMerged = false;
              defaultAlarmActions.forEach((action, idx) => {
                if (isEqual(action.p, curAlarmActions[0].p)) {
                  defaultAlarmActions[idx].oi = {
                    ...curAlarmActions[0].oi,
                    ...action.oi,
                  };
                  isMerged = true;
                }
              });
              if (!isMerged) {
                defaultAlarmActions.push(curAlarmActions[0]);
              }
              realAlarmActions.push(curAlarmActions[1]);
            } else {
              realAlarmActions.push(...curAlarmActions);
            }
          }
        }
      }
    }

    function pushPasteValue(stdValue: IStandardValue, field: IField, recordId: string, oldRecordId?: string) {
      if (!field || field.type === FieldType.NotSupport) {
        return;
      }

      let value = Field.bindContext(field, state).stdValueToCellValue(stdValue);
      value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);

      if (value == null && stdValue.data.length && field.type !== stdValue.sourceType) {
        // 这里说明有不匹配的类型存在
        notifyExistIncompatibleField?.();
      }

      recordValues.push({
        fieldId: field.id,
        recordId,
        value,
      });

      // 粘贴单元格为日期类型、有值且有闹钟
      oldRecordId && addAlarm(value, field, recordId, oldRecordId);

    }

    // 在只复制了一个单元格的情况下，要对选区进行覆盖式粘贴
    const singleCellPaste = stdValues.length === 1 && stdValues[0].length === 1;
    if (singleCellPaste) {
      const ranges = getSelectRanges(state)!;
      const range = ranges[0]!;
      const rows = Selectors.getRangeRecords(state, range);
      const fields = Selectors.getRangeFields(state, range, datasheetId);
      if (!rows || !fields) {
        return null;
      }
      for (const row of rows) {
        const recordId = row.recordId;
        for (const field of fields) {
          pushPasteValue(stdValues[0][0], field, recordId, recordIds?.[0]);
        }
      }
      // 复制了多个单元格的情况下，以负值区域为准，选区无关
    } else {
      for (let i = 0; stdValues[i] && recordIdsToPaste[i]; i++) {
        const recordId = recordIdsToPaste[i];
        const stdValuesRow = stdValues[i];
        for (let c = 0; stdValuesRow[c] && columnsToPaste[c]; c++) {
          const fieldId = columnsToPaste[c].fieldId;
          const stdValue = stdValuesRow[c];
          const field = fieldMap[fieldId];
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

    // 扩增行的新增行与粘贴赋值
    const newStdValues = stdValues.slice(recordIdsToPaste.length);
    if (newStdValues.length) {
      const recordValues: { [fieldId: string]: ICellValue }[] = [];
      const oldRecordIds: string[] = [];
      for (let row = 0; newStdValues[row]; row++) {
        const stdValuesRow = newStdValues[row];
        const cellValues: { [fieldId: string]: ICellValue } = {};
        // 将一行转为一个 record
        for (let column = 0; stdValuesRow[column] && columnsToPaste[column]; column++) {
          const fieldId = columnsToPaste[column].fieldId;
          const stdValue = stdValuesRow[column];
          const field = fieldMap[fieldId];
          if (!field || field.type === FieldType.NotSupport) {
            continue;
          }
          let value = Field.bindContext(field, state).stdValueToCellValue(stdValue);
          value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);
          cellValues[fieldId] = value;
        }
        recordValues.push(cellValues);
        recordIds && oldRecordIds.push(recordIds[recordIdsToPaste.length + row]);
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
            addAlarm(rv[fId], fieldMap[fId], newRecordIds[cvIndex], oldRecordIds[cvIndex]);
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
