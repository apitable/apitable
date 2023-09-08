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
import { commandTran, StringsCommandName } from './interface';

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

export const getOperationInfo = (ops: IOperation[]) =>
  ops
    .map((op) => {
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
      }

      //commandString
      switch (op.cmd) {
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

        case CollaCommandName.SetViewFrozenColumnCount:
          return commandTran(cmdStringKey, { count: op.actions[0]['oi'] });

        case 'UNDO:SetViewFrozenColumnCount':
          return commandTran(cmdStringKey, { count: op.actions[0]['od'] });

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

        case CollaCommandName.MoveViews:
        case CollaCommandName.AddRecords:
        case CollaCommandName.AddWidgetToPanel:
        case CollaCommandName.MoveWidget:
        case CollaCommandName.DeleteWidget:
        case CollaCommandName.DeleteRecords:
          return commandTran(cmdStringKey);

        case CollaCommandName.ModifyWidgetPanelName:
          actionCount = op.actions[0]['oi'];
          return commandTran(cmdStringKey) + ': ' + actionCount;

        case CollaCommandName.DeleteWidgetPanel:
          actionCount = op.actions[0]['ld'].name;
          return commandTran(cmdStringKey) + ': ' + actionCount;

        default:
          const recordCount = op.actions.length > 1 ? op.actions.length : 1;
          return commandTran(cmdStringKey, { record_count: recordCount }) + ' ' + actionCount;
      }
    })
    .join('');
