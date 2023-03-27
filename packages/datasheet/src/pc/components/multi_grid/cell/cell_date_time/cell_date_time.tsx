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

import { AlarmUsersType, CollaCommandName, Field, IDateTimeField, Selectors, shallowEqual, Strings, t } from '@apitable/core';
import { NotificationOutlined } from '@apitable/icons';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Tooltip } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { useThemeColors } from '@apitable/components';
import { getEnvVariables } from 'pc/utils/env';
import { useMemo } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './styles.module.less';
// @ts-ignore
import { AlarmTipText } from 'enterprise';

interface ICellDateTime extends ICellComponentProps {
  field: IDateTimeField;
}

export const CellDateTime: React.FC<React.PropsWithChildren<ICellDateTime>> = props => {
  const colors = useThemeColors();
  const { className, field, recordId, cellValue, toggleEdit, showAlarm } = props;
  const { snapshot, user, dstId } = useSelector(state => {
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
        <div className='dateTimeValue'>
          <div className={classNames(styles.date, !time && styles.single, 'cellDateTimeDate')}>{date}</div>
          {time && <div className={classNames(styles.time, 'time')}>{time}</div>}
          {timeRule && <div className={classNames(styles.time, 'time')}>{timeRule}</div>}
          {abbr && <div className={classNames(styles.time, 'time')}>{abbr}</div>}
        </div>
      )}
      {showAlarm && Boolean(alarm) && date && Boolean(snapshot) && RECORD_TASK_REMINDER_VISIBLE && (
        <Tooltip
          title={AlarmTipText && <AlarmTipText datasheetId={dstId!} recordId={recordId!} dateTimeFieldId={field.id!} />}
        >
          <span className={styles.alarm} onClick={toggleEdit}>
            <NotificationOutlined color={colors.deepPurple[500]} size={16} />
            <span className={styles.alarmTime}>
              {alarmRealTime}
            </span>
          </span>
        </Tooltip>
      )}
      {showAlarm && !alarm && date && RECORD_TASK_REMINDER_VISIBLE && Boolean(snapshot) && (
        <Tooltip
          title={t(Strings.task_reminder_hover_cell_tooltip)}
        >
          <span className={classNames(styles.quickAlarm)} onMouseDown={async() => {
            toggleEdit && await toggleEdit();
            resourceService.instance!.commandManager.execute({
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
            <NotificationOutlined color={colors.fc3} size={16} />
          </span>
        </Tooltip>
      )}
    </div>
  );
};
