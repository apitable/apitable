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
  CollaCommandName,
  ICellValue,
  IField,
  FieldType,
  ISetKanbanStyleValue,
  Selectors,
  IViewColumn,
  ISegment,
  IKanbanViewProperty,
} from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

interface ISetRecordData {
  recordId: string;
  fieldId: string;
  field?: IField; // Optional, applies to addRecords on fields that have not yet been applied to a snapshot
  fieldType: FieldType;
  value: ICellValue;
}

export const useCommand = () => {
  const { viewId, datasheetId } = useAppSelector((state) => state.pageParams);
  const view = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const snapshot = useAppSelector(Selectors.getSnapshot);

  const addRecords = (index: number, count: number, cellValues?: { [fieldId: string]: ICellValue }[]) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: viewId!,
      index,
      count,
      cellValues: cellValues ? cellValues : [{}],
    });
  };

  const setFieldAttr = (fieldId: string, field: IField, dstId?: string) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId: dstId || datasheetId,
      fieldId,
      data: field,
    });
  };

  const setRecords = (data: ISetRecordData[]) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data,
    });
  };

  const addField = (field: IField, index: number) => {
    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: {
            ...field,
          },
          viewId,
          index,
        },
      ],
    });
  };

  const setKanbanStyle = (setting: ISetKanbanStyleValue, addRecord?: boolean) => {
    const state = store.getState();
    const { viewId, datasheetId } = state.pageParams;
    const snapshot = Selectors.getSnapshot(state)!;
    const mirror = Selectors.getMirror(state);
    const activeView = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, undefined, mirror) as IKanbanViewProperty;

    executeCommandWithMirror(
      () => {
        return resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetKanbanStyle,
          viewId: viewId!,
          addRecord,
          ...setting,
        });
      },
      {
        style: {
          ...activeView.style,
          [setting.styleKey]: setting.styleValue,
        },
      },
      () => {
        if (addRecord) {
          const unitId = state.user.info!.unitId;
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.AddRecords,
            viewId: viewId!,
            index: activeView.rows.length,
            count: 1,
            cellValues: [{ [setting.styleKey]: [unitId] }],
          });
        }
      },
    );
  };

  const copyRecord = (recordIndex: number, recordId: string) => {
    const cellCollection = (view.columns as IViewColumn[]).reduce(
      (total, cur, index) => {
        let value = Selectors.getCellValue(store.getState(), snapshot!, recordId, cur.fieldId);
        const fieldType = snapshot?.meta.fieldMap[cur.fieldId].type;
        if (fieldType === FieldType.Text && index === 0 && value) {
          value = [...value] as ISegment[];
        }
        total[cur.fieldId] = value;
        return total;
      },
      {} as { [fieldId: string]: ICellValue },
    );
    addRecords(recordIndex, 1, cellCollection ? [cellCollection] : undefined);
  };

  return {
    addRecords,
    setFieldAttr,
    setRecords,
    addField,
    setKanbanStyle,
    copyRecord,
  };
};
