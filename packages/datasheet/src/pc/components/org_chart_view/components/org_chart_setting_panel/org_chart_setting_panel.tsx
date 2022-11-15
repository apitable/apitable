import { useContext, useMemo } from 'react';
import * as React from 'react';
import {
  FieldType,
  IOrgChartViewProperty,
  Selectors,
  CollaCommandName,
  OrgChartStyleKeyType,
  t,
  Strings,
  ILinkField,
  ConfigConstant,
  Settings,
} from '@apitable/core';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { Select, Typography, IOption, IconButton, Switch, useThemeColors } from '@apitable/components';
import {
  InformationSmallOutlined,
  ColumnLinktableFilled,
  CloseMiddleOutlined,
  ClassroomOutlined,
  ChevronRightOutlined,
  AddOutlined,
} from '@apitable/icons';
import { resourceService } from 'pc/resource_service';
import styles from './style.module.less';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { FlowContext } from '../../context/flow_context';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

interface IOrgChartSettingPanelProps {
  onClose: () => void;
  onAddField: () => void;
}

export const OrgChartSettingPanel: React.FC<IOrgChartSettingPanelProps> = props => {

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
  const activeView = useSelector((state) => Selectors.getCurrentView(state)) as IOrgChartViewProperty;
  const datasheetId = useSelector((state) => Selectors.getActiveDatasheetId(state));
  const fieldMap = useSelector((state) => Selectors.getFieldMap(state))!;

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

    activeView.columns.filter((column) => fieldMap[column.fieldId].type === FieldType.Link)
      .forEach((column) => {
        options.push({
          value: column.fieldId,
          label: fieldMap[column.fieldId].name,
          disabled: (fieldMap[column.fieldId] as ILinkField).property.foreignDatasheetId !== datasheetId,
          prefixIcon: <ColumnLinktableFilled color={colors.thirdLevelText} />,
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
    TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.REPLAY_ORG_CHART_VIDEO);
  };

  const handleChange = (key, value) => {
    executeCommandWithMirror(() => {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetOrgChartStyle,
        viewId: activeView.id!,
        styleKey: key,
        styleValue: value,
      });
    }, {
      style: {
        ...activeView.style,
        [key]: value,
      }
    });
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
          <Typography variant="h6">
            {t(Strings.org_chart_setting)}
          </Typography>
          <Tooltip title={t(Strings.calendar_setting_help_tips)}>
            <a
              href={Settings.org_chart_setting_help_url.value}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.helpIcon}
            >
              <InformationSmallOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <IconButton
          onClick={onClose}
          icon={CloseMiddleOutlined}
          size="small"
        />
      </header>
      <div className={styles.guideWrap} onClick={onPlayGuideVideo}>
        <span className={styles.left}>
          <ClassroomOutlined size={16} color={colors.primaryColor} />
          <Typography variant="body3" color={colors.secondLevelText}>
            {t(Strings.org_chart_play_guide_video_title)}
          </Typography>
        </span>
        <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
      </div>
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
                border: (isFieldDeleted || isFieldInvalid) ? `1px solid ${colors.rc08}` : 'none'
              }}
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
          <div className={styles.selectField}>
            <Switch
              onChange={handleSwitch}
              checked={horizontal}
            />
            <span style={{ marginLeft: 8 }} >{t(Strings.org_chart_layout_horizontal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
