import { Select, Switch, Tooltip } from '@vikadata/components';
import { AlarmUsersType, Api, FieldType, IMemberField, IRecordAlarmClient, Selectors, StoreActions, Strings, t, WithOptional } from '@apitable/core';
import { WarningTriangleNonzeroFilled } from '@vikadata/icons';
import cls from 'classnames';
import dayjs from 'dayjs';
import { keyBy, pick } from 'lodash';
import { memberStash } from 'pc/common/member_stash/member_stash';
import { AlarmTipText } from 'pc/components/alarm_tip_text';
import { Message } from 'pc/components/common';
import { FieldSelect } from 'pc/components/editors/date_time_editor/date_time_alarm/field_select/field_select';
import { FilterGeneralSelect } from 'pc/components/tool_bar/view_filter/filter_value/filter_general_select';
import { stopPropagation } from 'pc/utils';
import { ALARM_SUBTRACT, ALL_ALARM_SUBTRACT, CURRENT_ALARM_SUBTRACT, INNER_DAY_ALARM_SUBTRACT } from 'pc/utils/constant';
import { dispatch } from 'pc/worker/store';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { TimePicker } from '../time_picker_only';
import styles from './style.module.less';

const inDayKeys = Object.keys(INNER_DAY_ALARM_SUBTRACT);

interface IDateTimeAlarmProps {
  datasheetId: string;
  recordId: string;
  fieldId: string;
  handleDateTimeChange: (value: dayjs.Dayjs, isSetTime?: boolean) => void;
  handleDateAlarm(alarm: WithOptional<IRecordAlarmClient, 'id'> | undefined): void;
  curAlarm?: WithOptional<IRecordAlarmClient, 'id'>;
  timeValue?: string;
  dateValue?: string;
  includeTime?: boolean;
}

/**
 * 这个数据结构主要是为了使用成员选择器，组件来自于成员的筛选功能，由于必须提供一个 field，所以这里使用伪造的数据
 */
export const fakeMemberField = {
  name: 'fakeMemberField',
  type: FieldType.Member,
  id: 'fakeMemberField',
  property: {
    isMulti: true
  }
};

export const DateTimeAlarm = (props: IDateTimeAlarmProps) => {
  const { datasheetId, recordId, fieldId, timeValue, dateValue, includeTime, curAlarm, handleDateTimeChange, handleDateAlarm } = props;
  const alarmTarget = curAlarm?.target;
  const isAlarmMemberField = alarmTarget === AlarmUsersType.Field;
  const { fieldMap, user, unitMap } = useSelector(state => {
    return {
      fieldMap: Selectors.getFieldMap(state, datasheetId),
      user: state.user.info,
      unitMap: Selectors.getUnitMap(state)
    };
  }, shallowEqual);

  const stashList = useMemo(() => {
    return memberStash.getMemberStash();
  }, []);

  const handleOpen = status => {
    const nowTime = dayjs(new Date()).format('HH:mm');
    const time = includeTime ? (timeValue || nowTime) : '09:00';
    if (status && !dateValue) {
      const nowDate = dayjs(new Date()).format('YYYY-MM-DD');
      handleDateTimeChange(dayjs(`${nowDate} ${time}`), includeTime);
    }
    const newAlarm = status ? {
      subtract: '',
      time,
      alarmUsers: [user?.unitId || ''],
      target: AlarmUsersType.Member
    } : undefined;
    handleDateAlarm!(newAlarm);
  };

  const handleChangeAlarm = (item: { [key: string]: any }) => {
    handleDateAlarm!({
      ...curAlarm!,
      ...item
    });
  };

  const handleTimeChange = (newTime: string) => {
    handleChangeAlarm({ time: newTime });
  };

  const alertTargetOptions = useMemo(() => {
    const fields = Object.values(fieldMap!);
    const isNotExistMemberField = fields.every(field => field.type !== FieldType.Member);
    return [{
      value: AlarmUsersType.Member,
      label: t(Strings.alarm_specifical_member)
    }, {
      value: AlarmUsersType.Field,
      label: t(Strings.alarm_specifical_field_member),
      disabled: isNotExistMemberField,
      disabledTip: t(Strings.alarm_no_member_field_tips)
    }];
  }, [fieldMap]);

  // 无成员数据时异步补充
  useEffect(() => {
    if (curAlarm?.target !== AlarmUsersType.Member) {
      return;
    }
    const missUnitIds: string[] = [];

    if (unitMap) {
      for (const unitId of curAlarm.alarmUsers) {
        if (unitMap[unitId]) {
          continue;
        }
        missUnitIds.push(unitId);
      }
    } else {
      missUnitIds.push(...curAlarm.alarmUsers);
    }

    if (!unitMap || missUnitIds.length) {
      Api.loadOrSearch({ unitIds: missUnitIds.join(',') }).then(res => {
        const { data: { data: resData, success }} = res;
        if (!resData.length || !success) {
          return;
        }
        dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
      });
    }
  }, [isAlarmMemberField, unitMap, user?.unitId, curAlarm?.alarmUsers, curAlarm?.target]);

  const subtractOptions = useMemo(() => {
    let optionData: object;
    if (includeTime) { // 日期开启时间可以选所有选项
      optionData = ALL_ALARM_SUBTRACT;
    } else {
      // 日期不显示时间，但是之前设置过分钟、小时级别
      let extraSubtract = {};
      if (curAlarm?.subtract && inDayKeys.includes(curAlarm?.subtract)) {
        extraSubtract = pick(ALL_ALARM_SUBTRACT, curAlarm?.subtract);
      }
      optionData = { ...CURRENT_ALARM_SUBTRACT, ...extraSubtract, ...ALARM_SUBTRACT };
    }
    return Object.keys(optionData).map(item => ({
      label: optionData[item],
      value: item,
      disabled: !includeTime && inDayKeys.includes(item),
      suffixIcon: !includeTime && inDayKeys.includes(item) ? (
        <Tooltip content={t(Strings.task_reminder_notify_time_warning)}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <WarningTriangleNonzeroFilled color="#FFAB00" />
          </span>
        </Tooltip>
      ) : <></>
    }));
  }, [curAlarm?.subtract, includeTime]);

  if (!fieldMap) {
    return <></>;
  }

  const changeDateAlarmTarget = (option) => {
    if (option.value === AlarmUsersType.Field) {
      const memberField = Object.values(fieldMap).find(field => field.type === FieldType.Member)!;
      return handleChangeAlarm({ target: AlarmUsersType.Field, alarmUsers: [memberField.id] });
    }
    handleChangeAlarm({ target: AlarmUsersType.Member, alarmUsers: [user!.unitId] });
  };

  const changeAlarmField = (fieldIds: string[]) => {
    if (!fieldIds.length) {
      // 在当前配置条件下，不允许清空所有选项
      Message.warning({
        content: t(Strings.at_least_select_one_field)
      });
      return;
    }
    handleChangeAlarm({ target: AlarmUsersType.Field, alarmUsers: fieldIds });
  };

  const showTimePicker = Boolean(curAlarm?.time) || !includeTime ||
    // subtract 选择不在一天内时需要显示具体的时间
    (!curAlarm?.subtract || !inDayKeys.includes(curAlarm?.subtract));
  return (
    <div className={styles.dateTimeAlarm}>
      <div className={styles.alarmItem}>
        <div className={styles.alarmItemTitle}>{t(Strings.task_reminder_entry)}</div>
        <Switch checked={Boolean(curAlarm)} onClick={handleOpen} />
      </div>
      {Boolean(curAlarm) && (
        <>
          <div className={styles.alertResult}>
            <AlarmTipText datasheetId={datasheetId} recordId={recordId} dateTimeFieldId={fieldId} notShowDetail curAlarm={curAlarm} />
          </div>
          <div className={styles.alarmItem}>
            <div className={styles.right}>
              <Select
                dropdownMatchSelectWidth={false}
                triggerCls={styles.select}
                triggerStyle={{ width: showTimePicker ? 184 : 248 }}
                options={subtractOptions}
                value={curAlarm?.subtract || 'current'}
                onSelected={(option) => {
                  const val = option.value === 'current' ? '' : option.value;
                  const updateAlarm: any = { subtract: val };
                  // 设置为天以内的时间清空 time
                  if (inDayKeys.includes(val as string) && curAlarm?.time) {
                    updateAlarm.time = undefined;
                  }
                  // 设置为非天以内的时间补充 time
                  if (!inDayKeys.includes(val as string) && !curAlarm?.time) {
                    updateAlarm.time = timeValue;
                  }
                  handleChangeAlarm(updateAlarm);
                }}
              />
            </div>
            {
              showTimePicker && <div className={styles.timePicker}>
                <TimePicker
                  placeholder="hh:mm"
                  minuteStep={30}
                  onChange={handleTimeChange}
                  value={curAlarm?.time}
                  align={{
                    points: ['bl', 'tl'],
                    offset: [0, 0]
                  }}
                />
              </div>
            }
          </div>
          <div className={styles.alertTarget}>
            <Select
              dropdownMatchSelectWidth={false}
              triggerStyle={{ width: 248 }}
              triggerCls={styles.select}
              options={alertTargetOptions}
              value={curAlarm?.target || AlarmUsersType.Member}
              onSelected={changeDateAlarmTarget}
            />
          </div>
          <div className={styles.alarmItem}>
            {
              curAlarm?.target === AlarmUsersType.Member ? <div onFocus={stopPropagation} className={styles.cellMember}>
                <FilterGeneralSelect
                  field={fakeMemberField as IMemberField}
                  isMulti
                  onChange={(unitIds) => {
                    if (!Array.isArray(unitIds) || !unitIds.length) {
                      Message.warning({
                        content: t(Strings.at_least_select_one)
                      });
                      return;
                    }
                    handleChangeAlarm({ alarmUsers: unitIds });
                  }}
                  cellValue={curAlarm?.alarmUsers}
                  listData={stashList}
                />
              </div> : <div className={cls(styles.right, styles.memberSelect)}>
                <FieldSelect selectedFieldIds={curAlarm?.alarmUsers || []} fieldMap={fieldMap} onChange={changeAlarmField} />
              </div>
            }
          </div>
        </>
      )}
    </div>
  );
};
