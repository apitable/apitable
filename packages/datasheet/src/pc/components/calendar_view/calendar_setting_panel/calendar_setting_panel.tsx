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

import { FC, useContext, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
// eslint-disable-next-line no-restricted-imports
import { black, IOption, Select, Tooltip, Typography, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  CalendarColorType,
  CalendarStyleKeyType,
  CollaCommandName,
  ConfigConstant,
  DateTimeField,
  ExecuteResult,
  Field,
  FieldType,
  getNewId,
  getUniqName,
  ICalendarViewColumn,
  ICalendarViewProperty,
  ICalendarViewStyle,
  ISetCalendarStyle,
  IDPrefix,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined, ChevronRightOutlined, ClassOutlined, CloseOutlined, QuestionCircleOutlined, WarnCircleOutlined } from '@apitable/icons';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { setColor } from 'pc/components/multi_grid/format';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { setStorage, StorageName } from 'pc/utils/storage';
import { CalendarContext } from '../calendar_context';
import styles from './styles.module.less';

const UNUSED_END_DATE = 'unusedEndDate';

interface ICalendarSettingPanel {
  calendarStyle: ICalendarViewStyle;
}

export const CalendarSettingPanel: FC<React.PropsWithChildren<ICalendarSettingPanel>> = ({ calendarStyle }) => {
  const colors = useThemeColors();
  const { startFieldId, endFieldId, colorOption } = calendarStyle;
  const { color } = colorOption;
  const { fieldMap, view, calendarViewStatus, permissions, isCryptoStartField, isCryptoEndField } = useContext(CalendarContext);
  const noRequiredField = !startFieldId && !endFieldId;
  const exitFieldNames = Object.values(fieldMap).map((field) => field.name);
  const isStartFieldDeleted = startFieldId && !isCryptoStartField && !fieldMap[startFieldId];
  const isEndFieldDeleted = endFieldId && !isCryptoEndField && !fieldMap[endFieldId];
  const columns = view.columns as ICalendarViewColumn[];
  const isViewLock = useShowViewLockModal();
  const { spaceId, viewId, datasheetId, cacheTheme } = useAppSelector((state) => {
    const { datasheetId: dstId, viewId: vId } = state.pageParams;
    return {
      datasheetId: dstId,
      viewId: vId,
      spaceId: state.space.activeId!,
      cacheTheme: state.theme,
    };
  }, shallowEqual);
  const { CALENDAR_SETTING_HELP_URL } = getEnvVariables();
  const fieldOptions = useMemo(() => {
    // @ts-ignore
    const options = columns
      .map(({ fieldId }) => {
        const field = fieldMap[fieldId]!;
        if ([Field.bindModel(field).basicValueType, Field.bindModel(field).innerBasicValueType].includes(BasicValueType.DateTime)) {
          return {
            label: field.name,
            value: fieldId,
            prefixIcon: getFieldTypeIcon(field.type),
          };
        }
        return null;
      })
      .filter((v) => v) as IOption[];
    if (isCryptoStartField) {
      options.push({
        value: startFieldId,
        label: t(Strings.crypto_field),
        disabled: true,
        suffixIcon: <FieldPermissionLock fieldId={startFieldId} tooltip={t(Strings.field_permission_lock_tips)} />,
      });
    }
    if (isCryptoEndField) {
      options.push({
        value: endFieldId,
        label: t(Strings.crypto_field),
        disabled: true,
        suffixIcon: <FieldPermissionLock fieldId={endFieldId} tooltip={t(Strings.field_permission_lock_tips)} />,
      });
    }
    options.push({
      label: t(Strings.calendar_add_date_time_field),
      value: 'add',
      disabled: !permissions.manageable,
      prefixIcon: <AddOutlined color={colors.thirdLevelText} />,
    });
    return options;
  }, [columns, endFieldId, fieldMap, isCryptoEndField, isCryptoStartField, permissions.manageable, startFieldId, colors]);

  const dispatch = useDispatch();
  const onClose = () => {
    const { guideStatus } = calendarViewStatus;
    if (guideStatus) {
      dispatch(StoreActions.toggleCalendarSettingPanel(false, datasheetId!));
    } else {
      dispatch(
        batchActions([
          StoreActions.toggleCalendarSettingPanel(false, datasheetId!),
          StoreActions.toggleCalendarGuideStatus(true, datasheetId!),
          StoreActions.toggleCalendarGrid(true, datasheetId!),
        ]),
      );
    }
    const restStatus = guideStatus ? {} : { guideStatus: true, guideWidth: true };
    setStorage(StorageName.CalendarStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...calendarViewStatus,
        settingPanelVisible: false,
        ...restStatus,
      },
    });
  };

  const handleAddField = (styleKey: CalendarStyleKeyType) => {
    if (!permissions.manageable) {
      return;
    }
    const newFieldId = getNewId(IDPrefix.Field);
    const newFieldName = styleKey === CalendarStyleKeyType.StartFieldId ? t(Strings.calendar_start_field_name) : t(Strings.calendar_end_field_name);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: {
            id: newFieldId,
            name: getUniqName(newFieldName, exitFieldNames),
            type: FieldType.DateTime,
            property: DateTimeField.defaultProperty(),
          },
          viewId,
          index: columns.length,
        },
      ],
    });
    if (ExecuteResult.Success === result.result) {
      notify.open({
        message: t(Strings.toast_add_field_success),
        key: NotifyKey.AddField,
      });
      handleStyleChange(styleKey, newFieldId);
    }
  };

  const handleStyleChange = (styleKey: CalendarStyleKeyType, styleValue: ISetCalendarStyle['styleValue']) => {
    executeCommandWithMirror(
      () => {
        const calendarStyle = {
          styleKey,
          styleValue,
        } as ISetCalendarStyle;
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetCalendarStyle,
          viewId: viewId!,
          isClear: styleValue === UNUSED_END_DATE,
          data: [calendarStyle],
        });
      },
      {
        style: {
          ...(view as ICalendarViewProperty).style,
          [styleKey]: styleValue,
        },
      },
    );
  };

  const onColorPick = (type: OptionSetting, _id: string, value: string | number) => {
    if (type === OptionSetting.SETCOLOR) {
      handleStyleChange(CalendarStyleKeyType.ColorOption, {
        ...colorOption,
        type: CalendarColorType.Custom,
        color: Number(value),
      });
    }
  };

  const onPlayGuideVideo = () => {
    TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.REPLAY_CALENDAR_VIDEO);
  };

  return (
    <div className={styles.settingPanelContainer}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Typography variant="h6">{t(Strings.calendar_setting)}</Typography>
          <Tooltip content={t(Strings.calendar_setting_help_tips)}>
            <a href={CALENDAR_SETTING_HELP_URL} target="_blank" rel="noopener noreferrer" className={styles.helpIcon}>
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <CloseOutlined className={styles.closeIcon} size={16} color={black[500]} onClick={onClose} />
      </header>
      {getEnvVariables().CALENDAR_SETTING_GUIDE_VIDEO_VISIBLE && (
        <div className={styles.guideWrap} onClick={onPlayGuideVideo}>
          <span className={styles.left}>
            <ClassOutlined size={16} color={colors.primaryColor} />
            <Typography variant="body3" color={colors.secondLevelText}>
              {t(Strings.calendar_play_guide_video_title)}
            </Typography>
          </span>
          <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
        </div>
      )}
      <div className={styles.setting}>
        <Typography className={styles.settingTitle} variant="h7">
          {t(Strings.calendar_date_time_setting)}
        </Typography>
        <div className={styles.settingLayout}>
          {[
            [startFieldId, isStartFieldDeleted],
            [endFieldId || UNUSED_END_DATE, isEndFieldDeleted],
          ].map((fieldContent, fieldIdx) => {
            const [fieldId, isFieldDeleted] = fieldContent as [string, boolean];
            const isStart = fieldIdx === 0;
            return (
              <div key={fieldIdx} className={styles.selectField}>
                <Select
                  value={fieldId}
                  onSelected={(option) => {
                    const handleKey = isStart ? CalendarStyleKeyType.StartFieldId : CalendarStyleKeyType.EndFieldId;
                    if (option.value === 'add') {
                      handleAddField(handleKey);
                    } else {
                      handleStyleChange(handleKey, option.value as string);
                    }
                  }}
                  placeholder={isStart ? t(Strings.calendar_pick_start_time) : t(Strings.calendar_pick_end_time)}
                  dropdownMatchSelectWidth
                  triggerStyle={{
                    border: isFieldDeleted ? `1px solid ${colors.rc08}` : 'none',
                  }}
                  disabled={isViewLock}
                  disabledTip={t(Strings.view_lock_setting_desc)}
                >
                  {(isStart
                    ? fieldOptions.filter((f) => f.value !== endFieldId)
                    : [
                      {
                        label: t(Strings.calendar_setting_clear_end_time),
                        value: UNUSED_END_DATE,
                        disabled: !permissions.editable || !endFieldId,
                      },
                      ...fieldOptions.filter((f) => f.value !== startFieldId),
                    ]
                  ).map((option, index) => {
                    return (
                      <Select.Option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        currentIndex={index}
                        prefixIcon={option.prefixIcon}
                      >
                        {option.label}
                      </Select.Option>
                    );
                  })}
                </Select>
                {isFieldDeleted && <span className={styles.errorText}>{t(Strings.calendar_setting_field_deleted)}</span>}
              </div>
            );
          })}
        </div>
        {noRequiredField && <span className={styles.errorText}>{t(Strings.must_one_date)}</span>}
        {startFieldId && endFieldId && fieldMap[startFieldId]?.property?.timeZone !== fieldMap[endFieldId]?.property?.timeZone && (
          <div className={styles.timeZoneTip}>
            <WarnCircleOutlined color={colors.textCommonTertiary} />
            <span>{t(Strings.time_zone_inconsistent_tips)}</span>
          </div>
        )}
      </div>
      {false && (
        <div className={styles.color}>
          <div className={styles.outer}>
            <div
              className={styles.inner}
              style={{
                backgroundColor: color === -1 ? colors.defaultBg : setColor(color, cacheTheme),
              }}
            />
          </div>
          <ColorPicker
            onChange={onColorPick}
            option={{
              id: '',
              name: '',
              color: colorOption.color,
            }}
            mask
            triggerComponent={
              <Typography variant="body3" className={styles.more} component={'span'}>
                {t(Strings.calendar_color_more)}
              </Typography>
            }
          />
        </div>
      )}
    </div>
  );
};
