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

import { ReactNode, useContext, useMemo } from 'react';
import { AlarmUsersType, CellType, CollaCommandName, FieldType, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@apitable/core';
import { NotificationOutlined } from '@apitable/icons';
import { generateTargetName, IScrollState, PointPosition } from 'pc/components/gantt_view';
import { Icon } from 'pc/components/konva_components';
import { GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { AlarmIcon } from 'enterprise/alarm/alarm_icon/alarm_icon';

interface IUseCellAlarmProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStopIndex: number;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  toggleEditing: () => Promise<boolean | void>;
}

const NotificationSmallOutlinedPath = NotificationOutlined.toString();

export const useCellAlarm = (props: IUseCellAlarmProps) => {
  const { pointPosition, rowStopIndex, rowStartIndex, columnStopIndex, instance, toggleEditing, scrollState } = props;
  const { linearRows, visibleColumns, fieldMap, snapshot, permissions } = useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const { rowIndex: pointRowIndex, columnIndex: pointColumnIndex } = pointPosition;
  const state = store.getState();
  const dstId = Selectors.getActiveDatasheetId(state);
  const { isScrolling } = scrollState;
  const pointRecordId = linearRows[pointRowIndex]?.recordId;
  const { rowCount, columnCount, frozenColumnCount } = instance;

  const dateAlarmMap = useMemo(() => {
    if (isScrolling || !AlarmIcon || !getEnvVariables().RECORD_TASK_REMINDER_VISIBLE) return { dateAlarms: null, frozenDateAlarms: null };
    // Alarm clock icon for date
    const dateAlarms: React.ReactNode[] = [];
    const frozenDateAlarms: React.ReactNode[] = [];
    // Row head toolbar
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      if (rowIndex > rowCount - 1) break;
      const row = linearRows[rowIndex];
      if (row == null) continue;
      const { type, recordId } = row;
      if (type !== CellType.Record || recordId == null) continue;
      for (let columnIndex = 0; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        const { fieldId } = visibleColumns[columnIndex];
        if (columnIndex <= frozenColumnCount - 1) {
          if (fieldMap[fieldId]?.type === FieldType.DateTime) {
            frozenDateAlarms.push(
              <AlarmIcon
                key={`${rowIndex}-${columnIndex}`}
                datasheetId={dstId!}
                fieldId={fieldId}
                recordId={recordId}
                instance={instance}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                toggleEditing={toggleEditing}
              />,
            );
          }
          continue;
        }
        if (fieldMap[fieldId]?.type === FieldType.DateTime) {
          dateAlarms.push(
            <AlarmIcon
              key={`${rowIndex}-${columnIndex}`}
              datasheetId={dstId!}
              fieldId={fieldId}
              recordId={recordId}
              instance={instance}
              columnIndex={columnIndex}
              rowIndex={rowIndex}
              toggleEditing={toggleEditing}
            />,
          );
        }
      }
    }
    return { dateAlarms, frozenDateAlarms };
  }, [
    columnCount,
    columnStopIndex,
    fieldMap,
    frozenColumnCount,
    instance,
    isScrolling,
    linearRows,
    rowCount,
    rowStartIndex,
    rowStopIndex,
    visibleColumns,
    toggleEditing,
    dstId,
  ]);

  /**
   * hover date alarm clock icon, user quick add alarm clock
   */
  let dateAddAlarm: ReactNode = null;
  let frozenDateAddAlarm: ReactNode = null;
  const row = linearRows[pointRowIndex];
  const pointFieldId = visibleColumns[pointColumnIndex]?.fieldId;
  const pointField = fieldMap[pointFieldId];
  if (permissions.editable && Boolean(AlarmIcon) && !isScrolling && row?.type === CellType.Record && pointField?.type === FieldType.DateTime) {
    const pointCellValue = Selectors.getCellValue(state, snapshot, pointRecordId, pointFieldId);
    const alarm = Selectors.getDateTimeCellAlarm(snapshot, pointRecordId, pointFieldId);
    if (pointCellValue && !alarm) {
      const x = instance.getColumnOffset(pointColumnIndex + 1) - 25;
      const y = instance.getRowOffset(pointRowIndex) + 8;
      const isFrozenArea = pointColumnIndex < frozenColumnCount;
      const tempNode = (
        <Icon
          x={x}
          y={y}
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_DATE_CELL_CREATE_ALARM,
            fieldId: pointFieldId,
            recordId: pointRecordId,
          })}
          data={NotificationSmallOutlinedPath}
          fill={theme.color.thirdLevelText}
          onClick={async () => {
            clearTooltipInfo();
            await toggleEditing();
            const user = state.user.info;
            resourceService.instance!.commandManager.execute({
              cmd: CollaCommandName.SetDateTimeCellAlarm,
              recordId: pointRecordId,
              fieldId: pointFieldId,
              alarm: {
                subtract: '',
                alarmAt: pointCellValue,
                alarmUsers: [
                  {
                    type: AlarmUsersType.Member,
                    data: user?.unitId!,
                  },
                ],
              },
            });
          }}
          onMouseEnter={() => {
            setTooltipInfo({
              placement: 'top',
              title: t(Strings.task_reminder_hover_cell_tooltip),
              visible: true,
              width: 16,
              height: 16,
              x: x,
              y: y,
              coordXEnable: !isFrozenArea,
            });
          }}
          onMouseOut={clearTooltipInfo}
        />
      );
      if (isFrozenArea) {
        frozenDateAddAlarm = tempNode;
      } else {
        dateAddAlarm = tempNode;
      }
    }
  }

  return {
    ...dateAlarmMap,
    frozenDateAddAlarm,
    dateAddAlarm,
  };
};
