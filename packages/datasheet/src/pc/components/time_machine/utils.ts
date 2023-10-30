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

import dayjs from 'dayjs';
import { pick } from 'lodash';
import {
  IOperation,
  IJOTAction,
  IObjectDeleteAction,
  IObjectReplaceAction,
  IObjectInsertAction,
  CollaCommandName,
  Strings,
  OTActionName,
  RowHeightLevel,
  ViewType,
  FieldTypeDescriptionMap,
} from '@apitable/core';
import { ALL_ALARM_SUBTRACT } from 'pc/utils/constant';
import { commandTran, StringsCommandName } from './interface';

const DATEFORMAT='YYYY-MM-DD HH:mm';

export const getForeignDatasheetIdsByOp = (opList: IOperation[]) => {
  const actions = opList.reduce((acc, op) => {
    if (Array.isArray(op.actions)) {
      acc.push(...op.actions);
    }
    return acc;
  }, [] as IJOTAction[]);
  const ids = new Set<string>();
  actions.forEach((action) => {
    /**
     * oi Add reference columns, rollback corresponding to the need to od their own reference columns and reference columns of the associated table
     * od Delete reference columns, rollback requires oi own reference columns and reference columns of related tables
     * or operation as above od or oi
     */
    const op = (action as IObjectDeleteAction | IObjectReplaceAction).od || (action as IObjectInsertAction).oi;
    if (op && op.property && op.property.foreignDatasheetId) {
      ids.add(op.property.foreignDatasheetId);
    }
  });
  return [...ids];
};

export const getOperationInfo = (ops: IOperation[]) =>ops.map((op) => {
  const cmdStringKey: string = StringsCommandName[op.cmd] || op.cmd;
  const countMap = {};
  let actionCount = '';

  for (const item of op.actions) {
    if (item.n === OTActionName.ListMove) {
      countMap[item.n] = countMap[item.n] || [];
      countMap[item.n].push(item.lm + 1);
    } else if (item.n && item.n !== OTActionName.NumberAdd) {
      countMap[item.n] = (countMap[item.n] || 0) + 1;
    }
  }
  for (const nValue in countMap) {
    const count = nValue === OTActionName.ListMove ? countMap[nValue].join('、') : countMap[nValue];
    actionCount += commandTran(Strings[StringsCommandName[nValue]] as string, { count });
    if (nValue !== OTActionName.ListMove) {
      actionCount = countMap[nValue];
    }
  }

  //commandString
  switch (op.cmd) {
    case CollaCommandName.AddRecords:
      return commandTran(cmdStringKey, { count: actionCount });

    case CollaCommandName.DeleteRecords:
      const count = op.actions.filter((item) => item['od']?.recordMeta).length;
      return commandTran(cmdStringKey, { count });

    case CollaCommandName.UnarchiveRecords:
      const recordCount = op.actions.filter((item) => item['oi']?.recordMeta).length;
      return commandTran(cmdStringKey, { record_count: recordCount });

    case CollaCommandName.ArchiveRecords:
      const recordCounts = op.actions.filter((item) => item['od']?.recordMeta).length;
      return commandTran(cmdStringKey, { record_count: recordCounts });

    case CollaCommandName.DeleteArchivedRecords:
      const deleteCounts = op.actions.filter((item) => item['od']?.recordMeta).length;
      return commandTran(cmdStringKey, { record_count: deleteCounts });

    case CollaCommandName.AddFields:
      op.actions.find((item) => {
        if (item['oi'] instanceof Object && !Array.isArray(item['oi'])) {
          actionCount = item['oi'].type;
        }
      });
      return commandTran(cmdStringKey, { name: FieldTypeDescriptionMap[actionCount]?.title });

    case CollaCommandName.AddWidgetPanel:
      return commandTran(cmdStringKey, { name: op.actions[0]['li'].name });

    case CollaCommandName.AddViews:
      actionCount = StringsCommandName[ViewType[ViewType[op.actions[0]['li'].type]]];
      return commandTran(cmdStringKey, { name: commandTran(actionCount) });

    case CollaCommandName.DeleteViews:
      actionCount = StringsCommandName[ViewType[ViewType[op.actions[0]['ld'].type]]];
      return commandTran(cmdStringKey, { type: commandTran(actionCount) });

    case 'UNDO:SetDateTimeCellAlarm':
    case CollaCommandName.SetDateTimeCellAlarm:
      let status = 'cancel';
      op.actions.forEach((item) => {
        if(item.n){
          status=item.n===OTActionName.ObjectReplace?StringsCommandName.ModifyAlarm:(item['oi']?'open':'cancel');     
        }else{
          status=(item['oi']?'cancel':'open');
        }
        if((item['oi']||item['od']).time)return actionCount=(item['oi']||item['od']).time;
        if (item['od']?.alarmAt || item['oi']?.alarmAt){
          actionCount = dayjs.tz((item['oi']?.alarmAt || item['od']?.alarmAt)).format(DATEFORMAT);
        }
        if((item['oi']||item['od'])?.subtract){
          actionCount=(item['oi']||item['od'])?.subtract;
          actionCount=pick(ALL_ALARM_SUBTRACT, actionCount)[actionCount];
        }
      });
      return commandTran(cmdStringKey, { date_time: actionCount, status: commandTran(status) });

    case CollaCommandName.SetViewFrozenColumnCount:
      return commandTran(cmdStringKey, { count: op.actions[0]['oi'] });

    case 'UNDO:SetViewFrozenColumnCount':
      return commandTran(cmdStringKey, { count: op.actions[0]['od'] });

    case CollaCommandName.SetViewAutoSave:
      op.actions.find((item) => {
        if (item.p.includes('autoSave')) actionCount = item['oi'] ? 'open' : 'close';
      });
      return commandTran(cmdStringKey) + ':' + commandTran(actionCount);

    case CollaCommandName.SetAutoHeadHeight:
    case CollaCommandName.SetViewLockInfo:
      actionCount = op.actions[0]['oi'] ? 'open' : 'close';
      return commandTran(cmdStringKey) + ':' + commandTran(actionCount);

    case CollaCommandName.SetRowHeight:
      actionCount = StringsCommandName[RowHeightLevel[op.actions[0]['oi']]];
      return commandTran(cmdStringKey) + ': ' + commandTran(actionCount);

    case CollaCommandName.DeleteField:
      const newRecordCount = op.actions.filter((item) => item['od'] instanceof Object && !Array.isArray(item['od']));
      return commandTran(cmdStringKey, { record_count: newRecordCount.length });

    case CollaCommandName.AddWidgetToPanel:
    case CollaCommandName.DeleteWidget:
    case CollaCommandName.MoveViews:
    case CollaCommandName.MoveWidget:
    case CollaCommandName.ManualSaveView:
    case CollaCommandName.SetGalleryStyle:
      return commandTran(cmdStringKey);

    case CollaCommandName.ModifyWidgetPanelName:
      actionCount = op.actions[0]['oi'];
      return commandTran(cmdStringKey) + ': ' + actionCount;

    case CollaCommandName.DeleteWidgetPanel:
      actionCount = op.actions[0]['ld'].name;
      return commandTran(cmdStringKey) + ': ' + actionCount;

    default:
      let metaCount = 0;
      let extraRecord='';
      let extraRecordCount=0;
      for(const item of op.actions) {
        if (['recordMeta', 'alarm', 'meta'].some(str => item.p.includes(str))) metaCount++;
        if(item.p.length===2&&item.p.includes('recordMap')){
          metaCount++;
          extraRecordCount++;
          extraRecord=' , '+commandTran(StringsCommandName[CollaCommandName.AddRecords], { count: extraRecordCount });
        }
      }
      metaCount = (op.actions.length - metaCount) ? (op.actions.length - metaCount) : 1;
      return commandTran(cmdStringKey, { record_count: metaCount })+extraRecord;
  }
})
  .join('');
