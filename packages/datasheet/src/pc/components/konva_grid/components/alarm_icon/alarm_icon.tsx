import { KONVA_DATASHEET_ID, Selectors } from '@apitable/core';
import { NotificationSmallOutlined } from '@vikadata/icons';
import { AlarmTipText } from 'pc/components/alarm_tip_text';
import { generateTargetName, getDayjs } from 'pc/components/gantt_view';
import { Icon } from 'pc/components/konva_components';
import { GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { useThemeColors } from '@vikadata/components';
import { useContext } from 'react';

const NotificationSmallOutlinedPath = NotificationSmallOutlined.toString();

export interface IAlarmIconProps {
  datasheetId: string;
  fieldId: string;
  recordId: string;
  instance: GridCoordinate;
  columnIndex: number;
  rowIndex: number;
  toggleEditing: () => boolean | void;
}

export const AlarmIcon = (props: IAlarmIconProps) => {
  const colors = useThemeColors();
  const { datasheetId, fieldId, recordId, instance, columnIndex, rowIndex, toggleEditing } = props;
  const state = store.getState();
  const { snapshot } = useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
  const alarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, fieldId);

  if (!cellValue || !alarm) {
    return null;
  }
  const x = instance.getColumnOffset(columnIndex + 1) - 25;
  const y = instance.getRowOffset(rowIndex) + 8;
  const alarmDate = getDayjs(cellValue);
  const subtractMatch = alarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);
  if (subtractMatch) {
    alarmDate.subtract(Number(subtractMatch[1]), subtractMatch[2] as any);
  }
  return (
    <Icon
      key={`date-alarm-${fieldId}-${recordId}`}
      x={x}
      y={y}
      name={generateTargetName({
        targetName: KONVA_DATASHEET_ID.GRID_DATE_CELL_ALARM,
        fieldId,
        recordId
      })}
      data={NotificationSmallOutlinedPath}
      fill={colors.primaryColor}
      onClick={toggleEditing}
      onMouseEnter={() => {
        setTooltipInfo({
          placement: 'top',
          title: <AlarmTipText datasheetId={datasheetId} recordId={recordId} dateTimeFieldId={fieldId} />,
          visible: true,
          width: 16,
          height: 16,
          x: x,
          y: y,
          rowsNumber: 5
        });
      }}
      onMouseOut={clearTooltipInfo}
    />
  );
};
