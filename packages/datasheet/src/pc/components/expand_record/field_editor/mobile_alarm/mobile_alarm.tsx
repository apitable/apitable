import { IconButton, List, Switch, TextButton, Typography, useThemeColors } from '@vikadata/components';
import {
  AlarmUsersType, Api, CollaCommandName, FieldType, IAlarmTypeKeys, ICellValue, IDPrefix, IMemberField, IRecordAlarmClient, Selectors, StoreActions,
  Strings, t, WithOptional
} from '@apitable/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@vikadata/icons';
import DatePicker from 'antd-mobile/lib/date-picker';
import cls from 'classnames';
import dayjs from 'dayjs';
import { compact, isEqual, keyBy, pick } from 'lodash';
import { memberStash } from 'pc/common/member_stash/member_stash';
import { AlarmTipText } from 'pc/components/alarm_tip_text';
import { Message, MobileContextMenu } from 'pc/components/common';
import { fakeMemberField } from 'pc/components/editors/date_time_editor/date_time_alarm';
import { FieldSelect } from 'pc/components/editors/date_time_editor/date_time_alarm/field_select';
import { convertAlarmStructure } from 'pc/components/editors/date_time_editor/date_time_alarm/utils';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { FilterGeneralSelect } from 'pc/components/tool_bar/view_filter/filter_value/filter_general_select';
import { resourceService } from 'pc/resource_service';
import { stopPropagation } from 'pc/utils';
import { ALARM_SUBTRACT, ALL_ALARM_SUBTRACT, CURRENT_ALARM_SUBTRACT, INNER_DAY_ALARM_SUBTRACT } from 'pc/utils/constant';
import { dispatch } from 'pc/worker/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import style from './style.module.less';

const inDayKeys = Object.keys(INNER_DAY_ALARM_SUBTRACT);

interface IMobileAlarmProps {
  setOpenAlarm: (openAlarm: boolean) => void;
  includeTime?: boolean;
  datasheetId: string;
  fieldId: string;
  recordId: string;
  cellValue?: ICellValue;
}

export const MobileAlarm = (props: IMobileAlarmProps) => {
  const { setOpenAlarm, datasheetId, fieldId, recordId, includeTime, cellValue } = props;
  const { snapshot, fieldMap, user, unitMap } = useSelector(state => {
    const dstId = Selectors.getActiveDatasheetId(state)!;
    return {
      snapshot: Selectors.getSnapshot(state)!,
      fieldMap: Selectors.getFieldMap(state, dstId)!,
      user: state.user.info,
      unitMap: Selectors.getUnitMap(state)
    };
  }, shallowEqual);

  const memberFieldOptions = useMemo(() => {
    return Object.values(fieldMap)
      .filter(field => field.type === FieldType.Member)
      .map(field => ({
        label: field.name,
        value: field.id
      }));
  }, [fieldMap]);

  const alarm = Selectors.getDateTimeCellAlarmForClient(snapshot, recordId, fieldId);
  // const alarmMember = alarm?.alarmUsers[0];
  const isAlarmMemberField = alarm?.target === AlarmUsersType.Field;
  const [openSelect, setOpenSelect] = useState<IAlarmTypeKeys>();
  const colors = useThemeColors();
  const [curAlarm, setCurAlarm] = useState<WithOptional<IRecordAlarmClient, 'id'> | undefined>(alarm);

  const stashList = useMemo(() => {
    return memberStash.getMemberStash();
  }, []);
  
  const handleOpen = status => {
    if (recordId) {
      const newAlarm = status ? {
        subtract: '',
        time: includeTime ? dayjs(cellValue as number).format('HH:mm') : '09:00',
        alarmUsers: [user?.unitId || ''],
        target: AlarmUsersType.Member
      } : undefined;
      setCurAlarm(newAlarm);
    }
  };

  const handleChangeAlarm = useCallback((item: { [key: string]: any }) => {
    setCurAlarm!({
      ...curAlarm!,
      ...item
    });

  }, [curAlarm]);

  const changeAlarmTarget = useCallback((value: AlarmUsersType) => {
    if (value === AlarmUsersType.Field) {
      const memberField = Object.values(fieldMap).find(field => field.type === FieldType.Member);
      return handleChangeAlarm({ target: AlarmUsersType.Field, alarmUsers: memberField ? [memberField.id] : [] });
    }
    handleChangeAlarm({ target: AlarmUsersType.Member, alarmUsers: [user!.unitId] });
  }, [fieldMap, handleChangeAlarm, user]);

  const handleOk = () => {
    if (curAlarm?.alarmUsers.length === 0) {
      Message.warning({
        content: t(Strings.alarm_save_fail)
      });
      return;
    }
    if (!isEqual(alarm, curAlarm) && recordId) {
      resourceService.instance!.commandManager!.execute({
        cmd: CollaCommandName.SetDateTimeCellAlarm,
        recordId,
        fieldId,
        alarm: convertAlarmStructure(curAlarm as IRecordAlarmClient) || null
      });
    }
    setOpenAlarm(false);
  };

  const pickTime = useMemo(() => {
    const time = curAlarm?.time;
    if (time) {
      return time;
    }
    const nowTime = dayjs(new Date()).format('HH:mm');
    return includeTime ? nowTime : '09:00';
  }, [curAlarm?.time, includeTime]);

  const pickValue = useMemo(() => {
    const date = dayjs(new Date).format('YYYY/MM/DD');
    return new Date(`${date} ${pickTime}`);
  }, [pickTime]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlarmMemberField, user?.unitId, curAlarm?.alarmUsers, curAlarm?.target]);

  const unitInfo = useMemo(() => {
    if (!unitMap || !user?.unitId) {
      return;
    }
    // TODO 补充逻辑
    // if (alarmMember?.data && !isAlarmMemberField) {
    //   return unitMap[alarmMember?.data];
    // }
    return unitMap[user?.unitId];
  }, [unitMap, user?.unitId]);

  const alarmSelectedMember = useMemo(() => {
    return unitInfo && (
      <div className={style.selfSelect}>
        <MemberItem unitInfo={unitInfo} />
        <span className={style.selfSelectText}>{t(Strings.task_reminder_enable_member)}</span>
      </div>
    );
  }, [unitInfo]);

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
      text: optionData[item],
      onClick: () => {
        const val = item === 'current' ? '' : item;
        const updateAlarm: any = { subtract: val };
        if (inDayKeys.includes(val as string) && curAlarm?.time) {
          updateAlarm.time = undefined;
        }
        handleChangeAlarm(updateAlarm);
      }
    }));
  }, [curAlarm?.subtract, curAlarm?.time, handleChangeAlarm, includeTime]);

  const contextMenuData = useMemo(() => {
    if (openSelect === 'subtract') {
      return [subtractOptions];
    }
    if (openSelect === 'target') {
      const fields = Object.values(fieldMap!);
      const isNotExistMemberField = fields.every(field => field.type !== FieldType.Member);
      return [
        [
          {
            value: AlarmUsersType.Member,
            text: t(Strings.alarm_specifical_member),
            onClick: () => {
              changeAlarmTarget(AlarmUsersType.Member);
            }
          },
          {
            value: AlarmUsersType.Field,
            text: t(Strings.alarm_specifical_field_member),
            disabled: isNotExistMemberField,
            disabledTip: t(Strings.alarm_no_member_field_tips),
            onClick: () => {
              changeAlarmTarget(AlarmUsersType.Field);
            }
          }
        ]
      ];
    }
    if (openSelect === 'alarmUsers') {
      return [
        [
          {
            label: alarmSelectedMember,
            value: user?.unitId || ''
          },
          ...memberFieldOptions
        ].map(item => ({
          text: item.label,
          onClick: () => {
            const isField = item.value.startsWith(IDPrefix.Field);
            const val = [{
              type: isField ? AlarmUsersType.Field : AlarmUsersType.Member,
              data: item.value
            }];
            handleChangeAlarm({
              alarmUsers: val
            });
          }
        }))
      ];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmSelectedMember, handleChangeAlarm, memberFieldOptions, openSelect, subtractOptions, user?.unitId, changeAlarmTarget]);

  const changeAlarmField = (fieldIds: string[]) => {
    if (!fieldIds.length) {
      Message.warning({
        content: t(Strings.at_least_select_one_field)
      });
      return;
    }
    handleChangeAlarm({
      alarmUsers: fieldIds
    });
  };

  const showTimePicker = Boolean(curAlarm?.time) || !includeTime ||
    // subtract 选择不在一天内时需要显示具体的时间
    (!curAlarm?.subtract || !inDayKeys.includes(curAlarm?.subtract));

  const alarmConfigList = compact([
    {
      title: t(Strings.task_reminder_notify_date),
      value: ALL_ALARM_SUBTRACT[curAlarm?.subtract || 'current'],
      onClick: () => setOpenSelect('subtract')
    }, showTimePicker && {
      title: t(Strings.task_reminder_notify_time),
      value: curAlarm?.time || pickTime
    },
    {
      title: t(Strings.alarm_target_type),
      value: curAlarm?.target === AlarmUsersType.Member ? t(Strings.alarm_specifical_member) : t(Strings.alarm_specifical_field_member),
      onClick: () => setOpenSelect('target')
    },
    {
      title: t(Strings.task_reminder_notify_who),
      value: curAlarm?.target === AlarmUsersType.Member ? <div onFocus={stopPropagation} className={style.cellMember}>
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
      </div> : <div className={style.fieldSelect}>
        <FieldSelect selectedFieldIds={curAlarm?.alarmUsers || []} fieldMap={fieldMap} onChange={changeAlarmField} />
      </div>
    }
  ]);

  return (
    <div className={style.mobileAlarm}>
      <div className={style.mobileAlarmHeader}>
        <div className={style.mobileAlarmBack}>
          <IconButton
            component="button" icon={ChevronLeftOutlined}
            onClick={() => setOpenAlarm(false)}
          />
        </div>
        <Typography variant="h6">
          {t(Strings.task_reminder_entry)}
        </Typography>
        <TextButton size="middle" color="primary" onClick={handleOk}>{t(Strings.save)}</TextButton>
      </div>
      <div className={style.mobileAlarmContent}>
        <div className={cls(style.mobileAlarmItem, style.wrapper)}>
          <Typography variant="body2">
            {t(Strings.task_reminder_app_enable_switch)}
          </Typography>
          <Switch checked={Boolean(curAlarm)} onClick={handleOpen} />
        </div>
        {Boolean(curAlarm) && (
          <Typography variant="body4" className={style.mobileAlarmTitle}>
            <AlarmTipText datasheetId={datasheetId} dateTimeFieldId={fieldId} recordId={recordId} curAlarm={curAlarm} />
          </Typography>
        )}
        {Boolean(curAlarm) && (
          <List
            className={style.wrapper}
            data={alarmConfigList}
            renderItem={(item: any, index) => (
              <div className={cls(style.mobileAlarmItem, style.border)} key={index}>
                <Typography variant="body2">
                  {item.title}
                </Typography>
                <div onClick={item.onClick} className={style.listRight}>
                  {showTimePicker && index === 1 ? (
                    <DatePicker
                      mode="time"
                      value={pickValue}
                      onChange={date => {
                        handleChangeAlarm({
                          time: dayjs(date).format('HH:mm')
                        });
                      }}
                    >
                      <div className={style.dateItem}>
                        <span className={style.listRightValue}>{item.value}</span>
                        <ChevronRightOutlined color={colors.fc3} size={16} />
                      </div>
                    </DatePicker>
                  ) : (
                    <>
                      <span className={style.listRightValue}>{item.value}</span>
                      <ChevronRightOutlined color={colors.fc3} size={16} />
                    </>
                  )}
                </div>
              </div>
            )}
          />
        )}
      </div>

      <MobileContextMenu
        title={t(Strings.operation)}
        visible={Boolean(openSelect)}
        onClose={() => { setOpenSelect(undefined); }}
        data={contextMenuData}
        height="auto"
      />

    </div>
  );
};
