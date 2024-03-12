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

import { Tooltip } from 'antd';
import * as React from 'react';
import { useContext, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { IconButton, IOption, Select, Switch, Typography, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  FieldType,
  ILinkField,
  IOrgChartViewProperty,
  OrgChartStyleKeyType,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import {
  AddOutlined, ChevronRightOutlined, ClassOutlined, CloseOutlined, OneWayLinkOutlined, TwoWayLinkOutlined, QuestionCircleOutlined
} from '@apitable/icons';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { FlowContext } from '../../context/flow_context';
import styles from './style.module.less';

interface IOrgChartSettingPanelProps {
  onClose: () => void;
  onAddField: () => void;
}

export const OrgChartSettingPanel: React.FC<React.PropsWithChildren<IOrgChartSettingPanelProps>> = (props) => {
  const { onClose, onAddField } = props;

  const {
    isCryptoLinkField,
    isFieldInvalid,
    isFieldDeleted,
    orgChartStyle: { linkFieldId, horizontal },
    permissions,
  } = useContext(FlowContext);
  const colors = useThemeColors();
  const noRequiredField = !linkFieldId;
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state)) as IOrgChartViewProperty;
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state));
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state))!;
  const isViewLock = useShowViewLockModal();

  const options = useMemo(() => {
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
        options.push({
          value: column.fieldId,
          label: fieldMap[column.fieldId].name,
          disabled: (fieldMap[column.fieldId] as ILinkField).property.foreignDatasheetId !== datasheetId,
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
    return options;
  }, [activeView, fieldMap, datasheetId, isCryptoLinkField, linkFieldId, permissions, colors]);

  const onPlayGuideVideo = () => {
    TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.REPLAY_ORG_CHART_VIDEO);
  };

  const handleChange = (key: OrgChartStyleKeyType, value: string | boolean) => {
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetOrgChartStyle,
          viewId: activeView.id!,
          styleKey: key as any,
          styleValue: value as any,
        });
      },
      {
        style: {
          ...activeView.style,
          [key]: value,
        },
      },
    );
  };

  const handleSelect = (option: IOption) => {
    if (option.value === 'add') {
      onAddField();
      return;
    }
    handleChange(OrgChartStyleKeyType.LinkFieldId, option.value as string);
  };

  const handleSwitch = (checked: boolean) => {
    handleChange(OrgChartStyleKeyType.Horizontal, checked);
  };

  return (
    <div className={styles.settingPanelContainer}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Typography variant="h6">{t(Strings.org_chart_setting)}</Typography>
          <Tooltip title={t(Strings.calendar_setting_help_tips)}>
            <a href={getEnvVariables().ARCHITECTURE_SETTING_HELP_URL} target="_blank" rel="noopener noreferrer" className={styles.helpIcon}>
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <IconButton onClick={onClose} icon={CloseOutlined} size="small" />
      </header>
      {getEnvVariables().ARCHITECTURE_SETTING_GUIDE_VIDEO_VISIBLE && (
        <div className={styles.guideWrap} onClick={onPlayGuideVideo}>
          <span className={styles.left}>
            <ClassOutlined size={16} color={colors.primaryColor} />
            <Typography variant="body3" color={colors.secondLevelText}>
              {t(Strings.org_chart_play_guide_video_title)}
            </Typography>
          </span>
          <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
        </div>
      )}
      <div className={styles.setting}>
        <Typography className={styles.settingTitle} variant="h7">
          {t(Strings.org_chart_choose_a_link_field)}
        </Typography>
        <div className={styles.settingLayout}>
          <div className={styles.selectField}>
            <Select
              value={activeView.style.linkFieldId}
              onSelected={handleSelect}
              options={options}
              dropdownMatchSelectWidth
              placeholder={t(Strings.org_chart_pick_link_field)}
              triggerStyle={{
                border: isFieldDeleted || isFieldInvalid ? `1px solid ${colors.rc08}` : 'none',
              }}
              disabled={isViewLock}
              disabledTip={t(Strings.view_lock_setting_desc)}
            />
            {(isFieldDeleted || isFieldInvalid) && linkFieldId && (
              <span className={styles.errorText}>
                {isFieldDeleted ? t(Strings.org_chart_setting_field_deleted) : t(Strings.org_chart_setting_field_invalid)}
              </span>
            )}
          </div>
        </div>
        {noRequiredField && <span className={styles.errorText}>{t(Strings.org_chart_must_have_a_link_field)}</span>}

        <Typography
          className={styles.settingTitle}
          variant="h7"
          style={{
            marginTop: 16,
          }}
        >
          {t(Strings.design_chart_style)}
        </Typography>
        <div className={styles.settingLayout}>
          <div className={styles.selectField} style={{ display: 'flex', alignItems: 'center' }}>
            {isViewLock ? (
              <Tooltip title={t(Strings.view_lock_setting_desc)}>
                <span>
                  <Switch onChange={handleSwitch} checked={horizontal} disabled={isViewLock} />
                </span>
              </Tooltip>
            ) : (
              <Switch onChange={handleSwitch} checked={horizontal} />
            )}
            <span style={{ marginLeft: 8 }}>{t(Strings.org_chart_layout_horizontal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
