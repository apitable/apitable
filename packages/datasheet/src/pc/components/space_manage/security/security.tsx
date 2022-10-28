import { Skeleton, Typography } from '@vikadata/components';
import { ISocialAppType, StoreActions, Strings, t } from '@apitable/core';
import { isBoolean } from 'lodash';
import { SubscribeUsageTipType, triggerUsageAlert } from 'pc/common/billing';
import { SwitchInfo } from 'pc/components/common';
import { isSocialPlatformEnabled, SocialPlatformMap } from 'pc/components/home/social_platform';
import { labelMap, SubscribeGrade } from 'pc/components/subscribe_system/subscribe_label';
import { useRequest, useSpaceRequest } from 'pc/hooks';
import * as React from 'react';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.less';

enum SwitchType {
  AllowInvite = 'invitable',
  JoinSpace = 'joinable',
  ShowMobile = 'mobileShowable',
  NodeExportable = 'nodeExportable', // Abandon
  ExportLevel = 'exportLevel', // 0 - no export, 1 - exportable above read-only, 2 - exportable above editable, 3 - exportable above manageable
  WatermarkEnable = 'watermarkEnable',
  ShareNode = 'fileSharable',
  ManageRoot = 'rootManageable',
  DownloadFile = 'allowDownloadAttachment',
  CopyCellData = 'allowCopyDataToExternal',
  OrgIsolated = 'orgIsolated',
}

type SwitchValue = boolean | PermissionType;

export enum PermissionType {
  Readable = 1,
  Editable = 2,
  Manageable = 3,
  Updatable = 4,
}

export interface IPermissionInfo {
  name: string;
  value: PermissionType;
  disableTip?: string;
}

type ISwitchDataItem = {
  [key in SwitchType]?: {
    switchText: string;
    tipContent: string;
    onClickBefore: () => void;
    disabledWhenSocialPlatEnabled?: boolean;
    grade?: SubscribeGrade;
    permissionList?: IPermissionInfo[];
  };
};

export const SwitchData: ISwitchDataItem[] = [
  {
    [SwitchType.AllowInvite]: {
      switchText: t(Strings.security_setting_invite_member_title),
      tipContent: t(Strings.security_setting_invite_member_description),
      disabledWhenSocialPlatEnabled: true,
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingInviteMember',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
    [SwitchType.JoinSpace]: {
      switchText: t(Strings.security_setting_apply_join_space_title),
      tipContent: t(Strings.security_setting_apply_join_space_description),
      disabledWhenSocialPlatEnabled: true,
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingApplyJoinSpace',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
    [SwitchType.ShareNode]: {
      switchText: t(Strings.security_setting_share_title),
      tipContent: t(Strings.security_setting_share_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingShare',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
  },
  {
    [SwitchType.ManageRoot]: {
      switchText: t(Strings.security_setting_catalog_management_title),
      tipContent: t(Strings.security_setting_catalog_management_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingCatalogManagement',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
    [SwitchType.ExportLevel]: {
      switchText: t(Strings.security_setting_export_data_title),
      tipContent: t(Strings.security_setting_export_data_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean | string) => {
        if (typeof value === 'string') {
          return false;
        }
        return (
          value &&
          triggerUsageAlert(
            'securitySettingExport',
            { grade: labelMap[SubscribeGrade.Gold](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Gold,
      permissionList: [
        {
          value: PermissionType.Readable,
          name: t(Strings.security_setting_export_data_read_only),
          disableTip: t(Strings.security_setting_export_data_tooltips),
        },
        {
          value: PermissionType.Updatable,
          name: t(Strings.security_setting_export_data_updatable),
          disableTip: t(Strings.security_setting_export_data_tooltips),
        },
        {
          value: PermissionType.Editable,
          name: t(Strings.security_setting_export_data_editable),
          disableTip: t(Strings.security_setting_export_data_tooltips),
        },
        {
          value: PermissionType.Manageable,
          name: t(Strings.security_setting_export_data_manageable),
          disableTip: t(Strings.security_setting_export_data_tooltips),
        },
      ],
    },
    [SwitchType.DownloadFile]: {
      switchText: t(Strings.security_setting_download_file_title),
      tipContent: t(Strings.security_setting_download_file_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingDownloadFile',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
    [SwitchType.CopyCellData]: {
      switchText: t(Strings.security_setting_copy_cell_data_title),
      tipContent: t(Strings.security_setting_copy_cell_data_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingCopyCellData',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
  },
  {
    [SwitchType.ShowMobile]: {
      switchText: t(Strings.security_show_mobile),
      tipContent: t(Strings.security_show_mobile_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingMobile',
            { grade: labelMap[SubscribeGrade.Gold](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Gold,
    },
    [SwitchType.WatermarkEnable]: {
      switchText: t(Strings.security_show_watermark),
      tipContent: t(Strings.security_show_watermark_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert('watermark', { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true }, SubscribeUsageTipType.Alert)
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
    [SwitchType.OrgIsolated]: {
      switchText: t(Strings.security_address_list_isolation),
      tipContent: t(Strings.security_address_list_isolation_description),
      onClickBefore: (appType?: ISocialAppType, value?: boolean) => {
        return (
          value &&
          triggerUsageAlert(
            'securitySettingAddressListIsolation',
            { grade: labelMap[SubscribeGrade.Enterprise](appType), alwaysAlert: true },
            SubscribeUsageTipType.Alert,
          )
        );
      },
      grade: SubscribeGrade.Enterprise,
    },
  },
];

const reversedSwitches = [SwitchType.ShowMobile, SwitchType.WatermarkEnable, SwitchType.OrgIsolated, SwitchType.ExportLevel];

/**
 * switchType === SwitchType.ExportLevel，data.switchValue has five possible values, namely true, false, '1', '2', '3', '4'
 * When switchValue === true, manageable permissions are checked by default, i.e. 2 is returned
 */
function exportLevelHandle(value: boolean | PermissionType) {
  if (typeof value === 'boolean') {
    return value ? 2 : 0;
  }
  return Number(value);
}

export const Security: FC = () => {
  const { spaceFeaturesReq, updateSecuritySettingReq } = useSpaceRequest();
  const [settingLoading, setSettingLoading] = useState<null | SwitchType>(null);
  const { data: spaceFeatures, mutate, loading } = useRequest(spaceFeaturesReq);
  const { run: updateSecuritySetting } = useRequest(updateSecuritySettingReq, { manual: true });
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const dispatch = useDispatch();
  const switchReq = React.useCallback(
    (data: { key: SwitchType; status: SwitchValue; loadingEnabled: boolean }) => {
      const { key, status, loadingEnabled = true } = data;
      if (loadingEnabled) setSettingLoading(key as SwitchType);
      return updateSecuritySetting({
        [key]: status,
      });
    },
    [updateSecuritySetting],
  );

  const social = spaceInfo?.social;

  const onSwitchClick = React.useCallback(
    (data: { switchType: SwitchType; switchValue: SwitchValue; sectionData: ISwitchDataItem }) => {
      const { switchType, sectionData } = data;
      let switchValue = !data.switchValue;
      if (reversedSwitches.includes(switchType)) {
        switchValue = !switchValue;
      }

      const setting = sectionData[switchType];
      if (setting?.disabledWhenSocialPlatEnabled && spaceInfo && isSocialPlatformEnabled(spaceInfo)) {
        SocialPlatformMap[spaceInfo.social.platform].org_manage_reject_default_modal();
        return;
      }
      if (spaceFeatures?.[switchType] == null || !setting) {
        return;
      }

      const onOk = async() => {
        const newStatus = [SwitchType.ExportLevel].includes(switchType) ? exportLevelHandle(data.switchValue) : switchValue;
        // The loading state is required only when switching Switch components; it is not required when switching Radio components.
        const res = await switchReq({ key: switchType, status: newStatus, loadingEnabled: isBoolean(switchValue) });
        setSettingLoading(null);
        const newFeatures = { ...spaceFeatures!, [switchType]: newStatus };
        if (res.success) {
          mutate(newFeatures);
          dispatch(StoreActions.setSpaceFeatures(newFeatures));
        }
      };
      onOk();
    },
    [mutate, spaceFeatures, switchReq, spaceInfo, dispatch],
  );

  const SwitchList = React.useMemo(() => {
    return SwitchData.map((sectionData, index) => {
      return (
        <div key={index} className={styles.optionSection}>
          {Object.keys(sectionData).map((key, index) => {
            const { switchText, tipContent, grade, onClickBefore, permissionList = [] } = sectionData[key];
            const permissionType = spaceFeatures?.[key];
            let checked = !Boolean(permissionType);
            if (reversedSwitches.includes(key as SwitchType)) {
              checked = !checked;
            }
            return (
              <div style={{ maxWidth: '820px' }} key={key} className={styles.optionItem}>
                <SwitchInfo
                  checked={checked}
                  onClick={value => {
                    const result = onClickBefore(social?.appType, value);
                    if (result) return;
                    onSwitchClick({ switchType: key as SwitchType, switchValue: value, sectionData });
                  }}
                  switchText={switchText}
                  tipContent={tipContent}
                  permissionType={permissionType}
                  permissionList={permissionList}
                  loading={settingLoading === key}
                  grade={grade}
                />
              </div>
            );
          })}
        </div>
      );
    });
  }, [onSwitchClick, spaceFeatures, settingLoading, social?.appType]);

  if (loading || !spaceFeatures) {
    return (
      <div className={styles.loading}>
        <Skeleton height='24px' />
        <Skeleton count={2} style={{ marginTop: '24px' }} height='80px' />
      </div>
    );
  }

  return (
    <div className={styles.securityContainer}>
      <Typography variant={'h1'}>{t(Strings.permission_and_security)}</Typography>
      <Typography className={styles.pageSubscribe} variant={'body2'}>
        {t(Strings.permission_and_security_content)}
      </Typography>
      <div className={styles.content}>{SwitchList}</div>
    </div>
  );
};
