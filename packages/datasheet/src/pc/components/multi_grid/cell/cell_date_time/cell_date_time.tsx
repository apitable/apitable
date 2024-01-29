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

import classNames from 'classnames';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { AlarmUsersType, CollaCommandName, Field, IDateTimeField, Selectors, shallowEqual, Strings, t } from '@apitable/core';
import { NotificationOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { INNER_DAY_ALARM_SUBTRACT } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { ICellComponentProps } from '../cell_value/interface';
// @ts-ignore
import { AlarmTipText } from 'enterprise/alarm/alarm_tip_text';
import styles from './styles.module.less';

interface ICellDateTime extends ICellComponentProps {
  field: IDateTimeField;
}

export const CellDateTime: React.FC<React.PropsWithChildren<ICellDateTime>> = (props) => {
  const colors = useThemeColors();
  const { className, field, recordId, cellValue, toggleEdit, showAlarm } = props;
  const userTimeZone = useAppSelector(Selectors.getUserTimeZone)!;
  const { snapshot, user, dstId } = useAppSelector((state) => {
    return {
      snapshot: Selectors.getSnapshot(state)!,
      user: state.user.info,
      dstId: Selectors.getActiveDatasheetId(state),
    };
  }, shallowEqual);
  // No alarm is displayed when snapshot is undefined (e.g. the notification center expands the card directly)
  const alarm = showAlarm ? Selectors.getDateTimeCellAlarm(snapshot, recordId!, field.id) : undefined;
  const cellString = Field.bindModel(field).cellValueToString(cellValue);
  const [date, time, timeRule, abbr] = cellString ? cellString.split(' ') : [];
  const { RECORD_TASK_REMINDER_VISIBLE } = getEnvVariables();
  const timeZone = field.property.timeZone || userTimeZone;

  // let alarmTime = alarm?.time || dayjs.tz(alarm?.alarmAt).tz(timeZone).format('HH:mm');
  const isInnerDay = alarm?.subtract && Object.keys(INNER_DAY_ALARM_SUBTRACT).includes(alarm?.subtract);
  const alarmRealTime = useMemo(() => {
    let alarmTime = alarm?.time || dayjs.tz(alarm?.alarmAt).tz(timeZone).format('HH:mm');
    const alarmDate = dayjs.tz(cellValue as number).tz(timeZone);
    if (isInnerDay) {
      alarmTime = alarmDate.format('HH:mm');
    }
    return alarmTime;
  }, [alarm?.alarmAt, alarm?.time, cellValue, isInnerDay, timeZone]);

  return (
    <div
      className={classNames('dateTime', styles.dateTime, className, {
        [styles.hoverAlarm]: showAlarm && !alarm && date,
      })}
      onDoubleClick={toggleEdit}
    >
      {cellValue != null && (
        <div className="dateTimeValue">
          <div className={classNames(styles.date, !time && styles.single, 'cellDateTimeDate')}>{date}</div>
          {time && <div className={classNames(styles.time, 'time')}>{time}</div>}
          {timeRule && <div className={classNames(styles.time, 'time')}>{timeRule}</div>}
          {abbr && <div className={classNames(styles.time, 'time')}>{abbr}</div>}
        </div>
      )}
      {showAlarm && Boolean(alarm) && date && Boolean(snapshot) && RECORD_TASK_REMINDER_VISIBLE && (
        <Tooltip title={AlarmTipText && <AlarmTipText datasheetId={dstId!} recordId={recordId!} dateTimeFieldId={field.id!} />}>
          <span className={styles.alarm} onClick={toggleEdit}>
            <NotificationOutlined color={colors.deepPurple[500]} size={16} />
            <span className={styles.alarmTime}>{alarmRealTime}</span>
          </span>
        </Tooltip>
      )}
      {showAlarm && !alarm && date && RECORD_TASK_REMINDER_VISIBLE && Boolean(snapshot) && (
        <Tooltip title={t(Strings.task_reminder_hover_cell_tooltip)}>
          <span
            className={classNames(styles.quickAlarm)}
            onMouseDown={async () => {
              toggleEdit && (await toggleEdit());
              resourceService.instance!.commandManager.execute({
                cmd: CollaCommandName.SetDateTimeCellAlarm,
                recordId: recordId!,
                fieldId: field.id,
                alarm: {
                  subtract: '',
                  alarmAt: cellValue as string,
                  alarmUsers: [
                    {
                      type: AlarmUsersType.Member,
                      data: user?.unitId!,
                    },
                  ],
                },
              });
            }}
          >
            <NotificationOutlined color={colors.fc3} size={16} />
          </span>
        </Tooltip>
      )}
    </div>
  );
};
