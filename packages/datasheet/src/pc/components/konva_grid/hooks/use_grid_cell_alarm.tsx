import { AlarmUsersType, CellType, CollaCommandName, FieldType, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@vikadata/core';
import { NotificationSmallOutlined } from '@vikadata/icons';
import { generateTargetName, getDayjs, IScrollState, PointPosition } from 'pc/components/gantt_view';
import { Icon } from 'pc/components/konva_components';
import { GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { ReactNode, useContext, useMemo } from 'react';
import { AlarmIcon } from '../components/alarm_icon/alarm_icon';

interface IUseCellAlarmProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStopIndex: number;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  toggleEditing: () => boolean | void;
}

const NotificationSmallOutlinedPath = NotificationSmallOutlined.toString();

export const useCellAlarm = (props: IUseCellAlarmProps) => {
  const {
    pointPosition, rowStopIndex, rowStartIndex, columnStopIndex, instance,
    toggleEditing, scrollState
  } = props;
  const {
    linearRows,
    visibleColumns,
    fieldMap,
    snapshot
  } = useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const {
    rowIndex: pointRowIndex,
    columnIndex: pointColumnIndex,
  } = pointPosition;
  const state = store.getState();
  const dstId = Selectors.getActiveDatasheetId(state);
  const { isScrolling } = scrollState;
  const pointRecordId = linearRows[pointRowIndex]?.recordId;
  const { rowCount, columnCount, frozenColumnCount } = instance;

  const dateAlarmMap = useMemo(() => {
    if (isScrolling) return { dateAlarms: null, frozenDateAlarms: null };
    // 日期的闹钟图标
    const dateAlarms: React.ReactNode[] = [];
    const frozenDateAlarms: React.ReactNode[] = [];
    // 行头工具栏
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
              />
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
            />
          );
        }
      }
    }
    return { dateAlarms, frozenDateAlarms };
  }, [
    columnCount, columnStopIndex, fieldMap, frozenColumnCount, instance, isScrolling,
    linearRows, rowCount, rowStartIndex, rowStopIndex, visibleColumns, toggleEditing, dstId,
  ]);

  /**
   * hover 日期闹钟图标、用户快速添加闹钟
   */
  let dateAddAlarm: ReactNode = null;
  let frozenDateAddAlarm: ReactNode = null;
  const row = linearRows[pointRowIndex];
  const pointFieldId = visibleColumns[pointColumnIndex]?.fieldId;
  const pointField = fieldMap[pointFieldId];
  if (
    !isScrolling &&
    row?.type === CellType.Record &&
    pointField?.type === FieldType.DateTime
  ) {
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
            recordId: pointRecordId
          })}
          data={NotificationSmallOutlinedPath}
          fill={theme.color.thirdLevelText}
          onClick={() => {
            clearTooltipInfo();
            toggleEditing();
            const user = state.user.info;
            resourceService.instance!.commandManager!.execute({
              cmd: CollaCommandName.SetDateTimeCellAlarm,
              recordId: pointRecordId,
              fieldId: pointFieldId,
              alarm: {
                subtract: '',
                time: pointField.property.includeTime ? getDayjs(pointCellValue as number).format('HH:mm') : '09:00',
                alarmUsers: [{
                  type: AlarmUsersType.Member,
                  data: user?.unitId!
                }]
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
              coordXEnable: !isFrozenArea
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
    dateAddAlarm
  };
};
