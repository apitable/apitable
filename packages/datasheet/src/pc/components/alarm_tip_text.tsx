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

// 只有数表移动出现 tooltip 才渲染并加载成员数据，防止重复加载
export const AlarmTipText = ({ datasheetId, recordId, dateTimeFieldId, curAlarm, notShowDetail }: IAlarmTipTextProps) => {
  const snapshot = useSelector(state => Selectors.getSnapshot(state, datasheetId))!;
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const alarm = curAlarm || Selectors.getDateTimeCellAlarmForClient(snapshot, recordId, dateTimeFieldId);
  const unitMap = useSelector(state => Selectors.getUnitMap(state));
  const dateTimeCellValue = useSelector(state => Selectors.getCellValue(state, snapshot, recordId, dateTimeFieldId));
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId)!);

  // 无成员数据时异步补充
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

      // 在日期提醒设置的弹窗中，并不需要特别详细的展示有哪些字段需要提示
      // 而在单元格的 tooltip 中，需要把详细的字段名拼接出来
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
    // alarmTipData 为字符串，场景应该是出现了错误
    if (typeof alarmTipData === 'string') {
      return alarmTipData;
    }

    /* alarmTipData!.memberTip 如果是数组，说明是注入的企微的组件 */
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
    } // 兼容企微
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
