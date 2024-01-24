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

import { Select as MultiSelect } from 'antd';
import classNames from 'classnames';
import { FC, memo, useContext, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
// eslint-disable-next-line no-restricted-imports
import { black, IOption, Select, Switch, Tooltip, Typography, WrapperTooltip } from '@apitable/components';
import {
  BasicValueType,
  CollaCommandName,
  ConfigConstant,
  DateTimeField,
  DEFAULT_WORK_DAYS,
  ExecuteResult,
  Field,
  FieldType,
  GanttColorType,
  GanttStyleKeyType,
  getNewId,
  getUniqName,
  IDPrefix,
  IGanttViewColumn,
  IGanttViewProperty,
  IGanttViewStatus,
  ILinkField,
  ISetRecordOptions,
  LinkFieldSet,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import {
  AddOutlined,
  ChevronDownOutlined,
  ChevronRightOutlined,
  ClassOutlined,
  CloseOutlined,
  OneWayLinkOutlined,
  QuestionCircleOutlined, TwoWayLinkOutlined,
  WarnCircleOutlined,
} from '@apitable/icons';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { Message } from 'pc/components/common';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { ColorGroup } from 'pc/components/common/color_picker/color_group';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { autoTaskScheduling } from 'pc/components/gantt_view/utils';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import styles from './style.module.less';

const Option = Select.Option;
const MultiOption = MultiSelect.Option;

const colorOptions = [
  {
    label: t(Strings.gantt_config_color_by_custom),
    value: GanttColorType.Custom,
  },
  {
    label: t(Strings.gantt_config_color_by_single_select_field),
    value: GanttColorType.SingleSelect,
  },
];

const weekOptions = [
  {
    value: 1,
    label: t(Strings.gantt_config_monday),
    selectLabel: t(Strings.gantt_config_monday_in_select),
  },
  {
    value: 2,
    label: t(Strings.gantt_config_tuesday),
    selectLabel: t(Strings.gantt_config_tuesday_in_select),
  },
  {
    value: 3,
    label: t(Strings.gantt_config_wednesday),
    selectLabel: t(Strings.gantt_config_wednesday_in_select),
  },
  {
    value: 4,
    label: t(Strings.gantt_config_thursday),
    selectLabel: t(Strings.gantt_config_thursday_in_select),
  },
  {
    value: 5,
    label: t(Strings.gantt_config_friday),
    selectLabel: t(Strings.gantt_config_friday_in_select),
  },
  {
    value: 6,
    label: t(Strings.gantt_config_saturday),
    selectLabel: t(Strings.gantt_config_saturday_in_select),
  },
  {
    value: 0,
    label: t(Strings.gantt_config_sunday),
    selectLabel: t(Strings.gantt_config_sunday_in_select),
  },
];

interface ISettingPanelProps {
  ganttViewStatus: IGanttViewStatus;
}

export const SettingPanel: FC<React.PropsWithChildren<ISettingPanelProps>> = memo(({ ganttViewStatus }) => {
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { view, fieldMap, ganttStyle, fieldPermissionMap, permissions, exitFieldNames } = useAppSelector((state) => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      fieldMap,
      view: Selectors.getCurrentView(state)!,
      ganttStyle: Selectors.getGanttStyle(state)!,
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
      permissions: Selectors.getPermissions(state),
      exitFieldNames: Object.values(fieldMap).map((field) => field.name),
    };
  }, shallowEqual);
  const env = getEnvVariables();
  const dispatch = useDispatch();
  const columns = view.columns as IGanttViewColumn[];
  const columnCount = columns.length;
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const {
    startFieldId,
    endFieldId,
    colorOption,
    workDays = DEFAULT_WORK_DAYS,
    onlyCalcWorkDay = false,
    linkFieldId,
    autoTaskLayout = false,
  } = ganttStyle;
  const startFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, startFieldId);
  const endFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, endFieldId);
  const isCryptoStartField = Boolean(startFieldRole && startFieldRole === ConfigConstant.Role.None);
  const isCryptoEndField = Boolean(endFieldRole && endFieldRole === ConfigConstant.Role.None);
  const noRequiredField = startFieldId == null && endFieldId == null;
  const manageable = permissions.manageable;
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state)) as IGanttViewProperty;
  const linkFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, linkFieldId);
  const isCryptoLinkField = Boolean(linkFieldRole && linkFieldRole === ConfigConstant.Role.None);
  const linkField = fieldMap[linkFieldId];
  const visibleRows = useAppSelector((state) => Selectors.getVisibleRows(state));
  const isViewLock = useShowViewLockModal();

  const fieldOptions = columns
    .map(({ fieldId }) => {
      const field = fieldMap[fieldId];
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

  const singleFieldOptions = columns
    .map(({ fieldId }) => {
      const field = fieldMap[fieldId];
      if (field.type === FieldType.SingleSelect) {
        return {
          label: field.name,
          value: fieldId,
        };
      }
      return null;
    })
    .filter((v) => v) as IOption[];

  const linkFieldOptions = useMemo(() => {
    const options: IOption[] = [];
    if (isCryptoLinkField) {
      options.push({
        value: linkFieldId,
        label: t(Strings.crypto_field),
        disabled: true,
        suffixIcon: <FieldPermissionLock fieldId={linkFieldId} tooltip={t(Strings.field_permission_lock_tips)} />,
      });
    }

    activeView.columns
      .filter((column) => [FieldType.Link, FieldType.OneWayLink].includes(fieldMap[column.fieldId].type))
      .forEach((column) => {
        const columnFieldId = column.fieldId;
        options.push({
          value: columnFieldId,
          label: fieldMap[columnFieldId].name,
          disabled: (fieldMap[columnFieldId] as ILinkField).property.foreignDatasheetId !== datasheetId,
          prefixIcon: fieldMap[column.fieldId].type === FieldType.Link ?
            <TwoWayLinkOutlined color={colors.thirdLevelText} /> : <OneWayLinkOutlined color={colors.thirdLevelText} />,
          disabledTip: t(Strings.org_chart_choose_a_self_link_field),
        });
      });

    options.push({
      label: t(Strings.org_chart_init_fields_button),
      value: 'add',
      disabled: !permissions.manageable,
      prefixIcon: <AddOutlined color={colors.thirdLevelText} />,
    });

    options.unshift({
      label: t(Strings.gantt_no_dependency),
      value: '',
      disabled: !permissions.manageable,
    });

    return options;
  }, [activeView, fieldMap, datasheetId, isCryptoLinkField, linkFieldId, permissions, colors]);

  const onClose = () => {
    dispatch(StoreActions.toggleGanttSettingPanel(false, datasheetId!));
    setStorage(StorageName.GanttStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...ganttViewStatus,
        settingPanelVisible: false,
      },
    });
  };

  const onGanttStyleChange = (styleKey: GanttStyleKeyType, styleValue: any) => {
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetGanttStyle,
          viewId: viewId!,
          data: [
            {
              styleKey,
              styleValue,
            },
          ],
        });
      },
      {
        style: {
          ...ganttStyle,
          [styleKey]: styleValue,
        },
      },
    );
  };

  const onFieldSelect = (styleKey: GanttStyleKeyType, value: string) => {
    if (value === LinkFieldSet.Add) {
      if (!manageable) {
        return;
      }
      const isLinkFieldType = styleKey === GanttStyleKeyType.LinkFieldId;
      const newFieldId = getNewId(IDPrefix.Field);
      const newFieldName = isLinkFieldType
        ? t(Strings.field_title_link)
        : styleKey === GanttStyleKeyType.StartFieldId
          ? t(Strings.gantt_start_field_name)
          : t(Strings.gantt_end_field_name);
      const result = resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.AddFields,
        data: [
          {
            data: {
              id: newFieldId,
              name: getUniqName(newFieldName, exitFieldNames),
              type: isLinkFieldType ? FieldType.Link : FieldType.DateTime,
              property: isLinkFieldType
                ? {
                  foreignDatasheetId: datasheetId,
                }
                : DateTimeField.defaultProperty(),
            },
            viewId,
            index: columnCount,
          },
        ],
      });
      if (ExecuteResult.Success === result.result) {
        notify.open({
          message: t(Strings.toast_add_field_success),
          key: NotifyKey.AddField,
        });

        onGanttStyleChange(styleKey, newFieldId);
      }
      return;
    }
    onGanttStyleChange(styleKey, value);
  };

  const onColorOptionSelect = (option: { value: any }) => {
    onGanttStyleChange(GanttStyleKeyType.ColorOption, {
      ...colorOption,
      type: option.value,
    });
  };

  const onSingleFieldSelect = (option: { value: any }) => {
    onGanttStyleChange(GanttStyleKeyType.ColorOption, {
      ...colorOption,
      fieldId: option.value,
    });
  };

  const onColorPick = (type: OptionSetting, _id: string, value: string | number) => {
    if (isViewLock) return;
    if (type === OptionSetting.SETCOLOR) {
      onGanttStyleChange(GanttStyleKeyType.ColorOption, {
        ...colorOption,
        type: GanttColorType.Custom,
        color: Number(value),
      });
    }
  };

  const onWorkDayChange = (value: number[]) => {
    const sortedValue = value.sort((a, b) => {
      if (a === 0) return 1;
      if (b === 0) return -1;
      return a - b;
    });
    onGanttStyleChange(GanttStyleKeyType.WorkDays, sortedValue);
  };

  const onSwitchClick = (status: boolean) => {
    onGanttStyleChange(GanttStyleKeyType.OnlyCalcWorkDay, status);
  };

  const autoAllRecords = (value: boolean) => {
    onGanttStyleChange(GanttStyleKeyType.AutoTaskLayout, value);
    if (value) {
      const startTimeIsComputedField = Field.bindModel(fieldMap[startFieldId]).isComputed;
      const endTimeISComputedField = Field.bindModel(fieldMap[endFieldId]).isComputed;
      if (startTimeIsComputedField || endTimeISComputedField) {
        Message.warning({
          content: t(Strings.gantt_cant_connect_when_computed_field),
        });
        return;
      }

      const commandDataArr: ISetRecordOptions[] = autoTaskScheduling(visibleRows, ganttStyle);

      resourceService.instance?.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        data: commandDataArr,
      });
    }
  };

  const onSwitchAutoTaskLayoutClick = (status: boolean) => {
    if (status) {
      Modal.info({
        title: t(Strings.gantt_historical_data_warning),
        content: t(Strings.gantt_open_auto_schedule_warning),
        onOk: () => autoAllRecords(status),
        okText: t(Strings.gantt_open_auto_schedule_switch),
        onCancel: () => onGanttStyleChange(GanttStyleKeyType.AutoTaskLayout, status),
        cancelText: t(Strings.gantt_open_auto_schedule_warning_no),
        hiddenCancelBtn: false,
      });
    } else {
      onGanttStyleChange(GanttStyleKeyType.AutoTaskLayout, status);
    }
  };

  const onLinkFieldIdChange = (option: any) => {
    if (option.value === LinkFieldSet.Add) {
      onFieldSelect(GanttStyleKeyType.LinkFieldId, LinkFieldSet.Add);
    } else {
      onGanttStyleChange(GanttStyleKeyType.LinkFieldId, option.value as string);
    }
    onGanttStyleChange(GanttStyleKeyType.OnlyCalcWorkDay, false);
  };

  useMemo(() => {
    if (!isCryptoStartField && !isCryptoEndField) {
      return;
    }
    if (isCryptoStartField) {
      fieldOptions.push({
        value: startFieldId,
        label: t(Strings.crypto_field),
        disabled: true,
        suffixIcon: <FieldPermissionLock fieldId={startFieldId} tooltip={t(Strings.field_permission_lock_tips)} />,
      });
    }
    if (isCryptoEndField) {
      fieldOptions.push({
        value: endFieldId,
        label: t(Strings.crypto_field),
        disabled: true,
        suffixIcon: <FieldPermissionLock fieldId={endFieldId} tooltip={t(Strings.field_permission_lock_tips)} />,
      });
    }
  }, [endFieldId, fieldOptions, isCryptoEndField, isCryptoStartField, startFieldId]);

  const onPlayGuideVideo = () => {
    TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.REPLAY_GANTT_VIDEO);
  };

  return (
    <div className={styles.settingPanelContainer}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Typography variant="body1">{t(Strings.gantt_setting)}</Typography>
          <Tooltip content={t(Strings.gantt_setting_help_tips)}>
            <a href={t(Strings.gantt_setting_help_url)} target="_blank" rel="noopener noreferrer" className={styles.helpIcon}>
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <CloseOutlined className={styles.closeIcon} size={16} color={black[500]} onClick={onClose} />
      </header>

      {/* Video teaching button */}
      {getEnvVariables().GANTT_SETTING_GUIDE_VIDEO_VISIBLE && (
        <div className={styles.guideWrap} onClick={onPlayGuideVideo}>
          <span className={styles.left}>
            <ClassOutlined size={16} color={colors.primaryColor} />
            <Typography variant="body3" color={colors.secondLevelText}>
              {t(Strings.play_guide_video_of_gantt_view)}
            </Typography>
          </span>
          <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
        </div>
      )}
      {/* Set the start and end date fields */}
      <div className={classNames(styles.setting, styles.firstSetting)}>
        <Typography className={styles.settingTitle} variant="h7">
          {t(Strings.gantt_date_time_setting)}
        </Typography>
        <div className={styles.settingLayout}>
          {[startFieldId, endFieldId].map((fieldId, fieldIndex) => {
            const isStartField = fieldIndex === 0;
            return (
              <div key={fieldIndex} className={styles.selectField} style={{ marginLeft: isStartField ? 0 : 16 }}>
                <Select
                  value={fieldId}
                  onSelected={(option) =>
                    onFieldSelect(isStartField ? GanttStyleKeyType.StartFieldId : GanttStyleKeyType.EndFieldId, option.value as string)
                  }
                  placeholder={isStartField ? t(Strings.gantt_pick_start_time) : t(Strings.gantt_pick_end_time)}
                  dropdownMatchSelectWidth
                  triggerStyle={{
                    width: 128,
                    border: fieldId == null ? `1px solid ${colors.rc08}` : 'none',
                  }}
                  disabled={isViewLock}
                  disabledTip={t(Strings.view_lock_setting_desc)}
                >
                  {fieldOptions.map((option, index) => {
                    return (
                      <Option key={option.value} value={option.value} disabled={option.disabled} currentIndex={index} prefixIcon={option.prefixIcon}>
                        {option.label}
                      </Option>
                    );
                  })}
                  <Option
                    key={'add'}
                    value={'add'}
                    currentIndex={fieldOptions.length}
                    disabled={!manageable}
                    prefixIcon={<AddOutlined color={colors.thirdLevelText} />}
                  >
                    {t(Strings.gantt_add_date_time_field)}
                  </Option>
                </Select>
                {!noRequiredField && fieldId == null && <span className={styles.errorText}>{t(Strings.gantt_pick_dates_tips)}</span>}
              </div>
            );
          })}
        </div>
        {noRequiredField && <span className={styles.errorText}>{t(Strings.gantt_pick_two_dates_tips)}</span>}
        {startFieldId && endFieldId && fieldMap[startFieldId]?.property?.timeZone !== fieldMap[endFieldId]?.property?.timeZone && (
          <div className={styles.timeZoneTip}>
            <WarnCircleOutlined color={colors.textCommonTertiary} />
            <span>{t(Strings.time_zone_inconsistent_tips)}</span>
          </div>
        )}
      </div>

      {/* Set taskbar colour */}
      <div className={styles.setting}>
        <div className={styles.settingHeader}>
          <Typography className={styles.settingTitle} variant="h7">
            {t(Strings.gantt_color_setting)}
          </Typography>
          {env.GANTT_CONFIG_COLOR_HELP_URL && (
            <Tooltip content={t(Strings.gantt_config_color_help)}>
              <a href={env.GANTT_CONFIG_COLOR_HELP_URL} target="_blank" rel="noopener noreferrer" className={styles.helpIcon}>
                <QuestionCircleOutlined color={colors.thirdLevelText} />
              </a>
            </Tooltip>
          )}
        </div>

        <div className={styles.settingLayout}>
          <Select
            options={colorOptions}
            value={colorOption.type}
            onSelected={onColorOptionSelect}
            dropdownMatchSelectWidth
            triggerStyle={{ width: 128 }}
            disabled={isViewLock}
            disabledTip={t(Strings.view_lock_setting_desc)}
          />
          {colorOption.type === GanttColorType.SingleSelect && (
            <Select
              options={singleFieldOptions}
              value={colorOption.fieldId}
              onSelected={onSingleFieldSelect}
              dropdownMatchSelectWidth
              triggerStyle={{ width: 128, marginLeft: 16 }}
              placeholder={t(Strings.gantt_config_color_by_single_select_pleaseholder)}
            />
          )}
        </div>
        {colorOption.type === GanttColorType.Custom && (
          <>
            <div className={styles.colorGroup}>
              <ColorGroup
                colorGroup={Array.from({ length: 11 }, (_, i) => i - 1)}
                option={{
                  id: '',
                  name: '',
                  color: colorOption.color,
                }}
                onChange={onColorPick}
                style={{ flexWrap: 'unset' }}
                disabled={isViewLock}
              />
            </div>
            <ColorPicker
              onChange={onColorPick}
              disabled={isViewLock}
              option={{
                id: '',
                name: '',
                color: colorOption.color,
              }}
              mask
              triggerComponent={
                isViewLock ? (
                  <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                    <div
                      style={{
                        display: 'inline-block',
                        cursor: isViewLock ? 'not-allowed' : '',
                        color: isViewLock ? colors.textCommonDisabled : '',
                      }}
                    >
                      <Typography variant="body3" className={styles.more} component={'span'}>
                        {t(Strings.gantt_color_more)}
                      </Typography>
                    </div>
                  </WrapperTooltip>
                ) : (
                  <div
                    style={{ display: 'inline-block', cursor: isViewLock ? 'not-allowed' : '', color: isViewLock ? colors.textCommonDisabled : '' }}
                  >
                    <Typography variant="body3" className={styles.more} component={'span'}>
                      {t(Strings.gantt_color_more)}
                    </Typography>
                  </div>
                )
              }
            />
          </>
        )}
      </div>

      {/* Set working days */}
      <div className={styles.setting}>
        <Typography className={styles.settingTitle} variant="h7">
          {t(Strings.gantt_workdays_setting)}
        </Typography>

        <Typography className={styles.settingDesc} variant="body4">
          {t(Strings.gantt_config_workdays_a_week)}
        </Typography>
        <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
          <div className={styles.settingLayout}>
            <MultiSelect
              mode="multiple"
              showArrow
              showSearch={false}
              className={classNames(styles.workDaySelect, { [styles.disabled]: isViewLock })}
              style={{ width: '100%' }}
              popupClassName={styles.workDaySelectDropdown}
              virtual={false}
              tagRender={({ label }) => <span className={styles.workDayTag}>{label}</span>}
              onChange={onWorkDayChange}
              tokenSeparators={[',']}
              defaultValue={workDays}
              size={'middle'}
              suffixIcon={<ChevronDownOutlined color={colors.black[500]} />}
              disabled={isViewLock}
            >
              {weekOptions.map((item) => {
                return (
                  <MultiOption
                    key={item.value}
                    value={item.value}
                    style={{
                      margin: '0 8px',
                      borderRadius: 8,
                    }}
                  >
                    {item.selectLabel}
                  </MultiOption>
                );
              })}
            </MultiSelect>
          </div>
        </WrapperTooltip>

        <div className={styles.settingLayout} style={{ marginTop: 16 }}>
          {isViewLock ? (
            <Tooltip content={t(Strings.view_lock_setting_desc)}>
              <Switch checked={Boolean(onlyCalcWorkDay)} onClick={onSwitchClick} disabled={isViewLock} />
            </Tooltip>
          ) : (
            <Switch checked={Boolean(onlyCalcWorkDay)} onClick={onSwitchClick} />
          )}
          <span style={{ marginLeft: 4 }}>{t(Strings.gantt_config_only_count_workdays)}</span>
        </div>
      </div>
      <div className={styles.setting}>
        <div className={styles.settingHeader}>
          <Typography className={styles.settingTitle} variant="h7">
            {t(Strings.gantt_dependency_setting)}
          </Typography>
          <Tooltip content={t(Strings.gantt_config_color_help)}>
            <a href={getEnvVariables().GANTT_SET_TASK_RELATION_HELP_URL} target="_blank" rel="noopener noreferrer" className={styles.helpIcon}>
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <div className={styles.settingLayout}>
          <div className={styles.selectField}>
            <Select
              value={linkFieldId ? (linkField ? linkFieldId : '') : activeView.style.linkFieldId}
              onSelected={onLinkFieldIdChange}
              options={linkFieldOptions}
              dropdownMatchSelectWidth
              placeholder={t(Strings.org_chart_pick_link_field)}
              disabled={isViewLock}
              disabledTip={t(Strings.view_lock_setting_desc)}
            />
          </div>
        </div>
        {linkField && (
          <div className={styles.settingLayout} style={{ marginTop: 16 }}>
            {isViewLock ? (
              <Tooltip content={t(Strings.view_lock_setting_desc)}>
                <Switch checked={Boolean(autoTaskLayout)} onClick={onSwitchAutoTaskLayoutClick} />
              </Tooltip>
            ) : (
              <Switch checked={Boolean(autoTaskLayout)} onClick={onSwitchAutoTaskLayoutClick} />
            )}
            <span style={{ marginLeft: 4 }}>{t(Strings.gantt_open_auto_schedule_switch)}</span>
          </div>
        )}
      </div>
    </div>
  );
});
