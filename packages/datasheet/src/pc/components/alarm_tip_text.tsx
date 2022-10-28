import { AlarmUsersType, Api, IRecordAlarmClient, Selectors, StoreActions, Strings, t, WithOptional } from '@apitable/core';
import dayjs from 'dayjs';
import { difference, keyBy } from 'lodash';
import { dispatch } from 'pc/worker/store';
import { ReactElement, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSocialWecomUnitName, isSocialWecom } from './home/social_platform';

interface IAlarmTipTextProps {
  datasheetId: string,
  recordId: string;
  dateTimeFieldId: string;
  curAlarm?: WithOptional<IRecordAlarmClient, 'id'>;
  notShowDetail?: boolean;
}

// Only render and load member data when a tooltip appears on a table move to prevent double loading
export const AlarmTipText = ({ datasheetId, recordId, dateTimeFieldId, curAlarm, notShowDetail }: IAlarmTipTextProps) => {
  const snapshot = useSelector(state => Selectors.getSnapshot(state, datasheetId))!;
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const alarm = curAlarm || Selectors.getDateTimeCellAlarmForClient(snapshot, recordId, dateTimeFieldId);
  const unitMap = useSelector(state => Selectors.getUnitMap(state));
  const dateTimeCellValue = useSelector(state => Selectors.getCellValue(state, snapshot, recordId, dateTimeFieldId));
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId)!);

  // Asynchronous replenishment when no member data is available
  useEffect(() => {
    if (alarm?.target !== AlarmUsersType.Member) {
      return;
    }

    const unitIds = alarm.alarmUsers;
    const missUnitIds = difference(unitIds, Object.keys(unitMap || {}));

    if (missUnitIds.length) {
      Api.loadOrSearch({ unitIds: missUnitIds.join(',') }).then(res => {
        const { data: { data: resData, success }} = res;

        if (!resData.length || !success) {
          return;
        }

        dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
      });
    }
  }, [spaceInfo, unitMap, alarm?.alarmUsers, alarm?.target]);

  const alarmTipData = useMemo(() => {
    if (!alarm || !dateTimeCellValue) {
      return;
    }
    let memberTip: string | (ReactElement | string)[] = '';

    if (alarm?.target === AlarmUsersType.Field) {

      if (alarm.alarmUsers.every(fieldId => !fieldMap[fieldId])) {
        return t(Strings.task_reminder_notify_who_error_not_exist);
      }

      if (!alarm.alarmUsers.length) {
        return t(Strings.task_reminder_notify_who_error_empty);
      }

      // The pop-up window for date reminders does not need to show in particular detail which fields need to be prompted
      // And in the tooltip of the cell, the detailed field names need to be spliced out
      if (notShowDetail) {
        memberTip = t(Strings.specifical_member_field);
      } else {
        const fieldIds = alarm.alarmUsers;
        const fieldMap = snapshot.meta.fieldMap;
        const fieldNamesString = fieldIds.map(fieldId => fieldMap[fieldId]?.name).filter(item => item).join(', ');
        memberTip = `${t(Strings.specifical_member_field)}：${fieldNamesString}`;
      }

    }

    if (alarm?.target === AlarmUsersType.Member && unitMap) {
      const isOpenFromWecom = isSocialWecom(spaceInfo);
      const alarmNames = alarm.alarmUsers.map(unitId => {
        const unit = unitMap[unitId];
        if (!unit) {
          return '';
        }

        if (isOpenFromWecom) {
          return getSocialWecomUnitName({
            name: unit?.name,
            isModified: unit?.isMemberNameModified,
            spaceInfo
          });
        }
        return unit.name || '';
      }).filter(item => item);
      if (notShowDetail) {
        memberTip = t(Strings.specifical_member);
      } else {
        memberTip = isOpenFromWecom ? alarmNames : `${t(Strings.task_reminder_notify_member, { member: alarmNames.join(', ') })}`;
      }
    }

    let alarmDate = dayjs(dateTimeCellValue as number);
    const subtractMatch = alarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);

    if (subtractMatch) {
      alarmDate = alarmDate.subtract(Number(subtractMatch[1]), subtractMatch[2] as any);
    }

    return {
      date: `${alarmDate.format('YYYY-MM-DD')} ${alarm?.time || alarmDate.format('HH:mm')}`,
      memberTip,
    };
  }, [spaceInfo, alarm, dateTimeCellValue, fieldMap, unitMap, notShowDetail, snapshot.meta.fieldMap]);

  const getTipText = () => {
    // alarmTipData is a string, the scene should be in error
    if (typeof alarmTipData === 'string') {
      return alarmTipData;
    }

    /* alarmTipData!.memberTip If it's an array, it means it's an injected Enterprise Micro component */
    const remindWho = Array.isArray(alarmTipData!.memberTip) ? <div>
      {alarmTipData!.memberTip.map(item => item)}
    </div> : alarmTipData!.memberTip;

    const isRemindWhoStr = typeof remindWho === 'string';
    if (isRemindWhoStr) {
      return t(Strings.task_reminder_notify_tooltip, {
        remind_date: alarmTipData!.date,
        remind_time: '',
        remind_who: remindWho,
      });
    } // Compatible with Enterprise Micro
    return <span>
      {t(Strings.task_reminder_notify_tooltip, {
        remind_date: alarmTipData!.date,
        remind_time: '',
        remind_who: '',
      })}
      {remindWho}
    </span>;

  };

  const tipText: string | JSX.Element = alarmTipData ? getTipText() : '';

  return <span>{tipText}</span>;
};
