import { AlarmUsersType, CollaCommandName, Field, IDateTimeField, Selectors, shallowEqual, Strings, t } from '@vikadata/core';
import { NotificationSmallOutlined } from '@vikadata/icons';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { AlarmTipText } from 'pc/components/alarm_tip_text';
import { Tooltip } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { useThemeColors } from '@vikadata/components';
import { useMemo } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './styles.module.less';

interface ICellDateTime extends ICellComponentProps {
  field: IDateTimeField;
}

export const CellDateTime: React.FC<ICellDateTime> = props => {
  const colors = useThemeColors();
  const { className, field, recordId, cellValue, toggleEdit, showAlarm } = props;
  const { snapshot, user, dstId } = useSelector(state => {
    return {
      snapshot: Selectors.getSnapshot(state)!,
      user: state.user.info,
      dstId: Selectors.getActiveDatasheetId(state),
    };
  }, shallowEqual);
  // snapshot 为 undefined 时不展示闹钟（比如通知中心直接展开卡片）
  const alarm = showAlarm ? Selectors.getDateTimeCellAlarm(snapshot, recordId!, field.id) : undefined;
  const cellString = Field.bindModel(field).cellValueToString(cellValue);
  const [date, time, timeRule] = cellString ? cellString.split(' ') : [];

  const alarmRealTime = useMemo(() => {
    let alarmDate = dayjs(cellValue as number);
    const subtractMatch = alarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);

    if (subtractMatch) {
      alarmDate = alarmDate.subtract(Number(subtractMatch[1]), subtractMatch[2] as any);
    }
    return alarm?.time || alarmDate.format('HH:mm');
  }, [alarm?.subtract, alarm?.time, cellValue]);

  return (
    <div
      className={classNames('dateTime', styles.dateTime, className, {
        [styles.hoverAlarm]: showAlarm && !alarm && date
      })}
      onDoubleClick={toggleEdit}
    >
      {cellValue != null && (
        <div className="dateTimeValue">
          <div className={classNames(styles.date, !time && styles.single, 'cellDateTimeDate')}>{date}</div>
          {time && <div className={classNames(styles.time, 'time')}>{time}</div>}
          {timeRule && <div className={classNames(styles.time, 'time')}>{timeRule}</div>}
        </div>
      )}
      {showAlarm && Boolean(alarm) && date && Boolean(snapshot) && (
        <Tooltip
          title={<AlarmTipText datasheetId={dstId!} recordId={recordId!} dateTimeFieldId={field.id!} />}
        >
          <span className={styles.alarm} onClick={toggleEdit}>
            <NotificationSmallOutlined color={colors.deepPurple[500]} size={14} />
            <span className={styles.alarmTime}>
              {alarmRealTime}
            </span>
          </span>
        </Tooltip>
      )}
      {showAlarm && !alarm && date && Boolean(snapshot) && (
        <Tooltip
          title={t(Strings.task_reminder_hover_cell_tooltip)}
        >
          <span className={classNames(styles.quickAlarm)} onMouseDown={() => {
            toggleEdit && toggleEdit();
            resourceService.instance!.commandManager!.execute({
              cmd: CollaCommandName.SetDateTimeCellAlarm,
              recordId: recordId!,
              fieldId: field.id,
              alarm: {
                subtract: '',
                time: field.property.includeTime ? dayjs(cellValue as number).format('HH:mm') : '09:00',
                alarmUsers: [{
                  type: AlarmUsersType.Member,
                  data: user?.unitId!
                }],
              },
            });
          }}>
            <NotificationSmallOutlined color={colors.fc3} size={14} />
          </span>
        </Tooltip>
      )}
    </div>
  );
};
