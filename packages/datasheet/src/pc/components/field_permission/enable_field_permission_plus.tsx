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

import { Box, IOption, Skeleton } from '@apitable/components';
import {
  ConfigConstant,
  DatasheetApi,
  IFieldPermissionMember,
  IFieldPermissionRole,
  IMember,
  IUnitValue,
  MemberType,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { useMount, useToggle } from 'ahooks';
import { Switch } from 'antd';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { MembersDetail } from 'pc/components/catalog/permission_settings/permission/members_detail';
import { UnitItem } from 'pc/components/catalog/permission_settings_plus/permission/unit_item';
import { Message } from 'pc/components/common/message/message';
import { IEnablePermissionPlus } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { useRequest } from 'pc/hooks';
import { dispatch } from 'pc/worker/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PermissionInfoSetting } from '../catalog/permission_settings_plus/permission/permission_info_setting';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';

const defaultSetting = { formSheetAccessible: false };

export const EnableFieldPermissionPlus: React.FC<React.PropsWithChildren<IEnablePermissionPlus>> = (props) => {
  const { field } = props;
  const [roleList, setRoleList] = useState<IFieldPermissionRole[]>([]);
  const [memberList, setMemberList] = useState<IFieldPermissionMember[]>([]);
  const [setting, setSetting] = useState<{ formSheetAccessible: boolean }>();
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const fieldPermission = useSelector(Selectors.getFieldPermissionMap)!;
  const readonly = fieldPermission[field.id] && !fieldPermission[field.id].manageable;
  const [enabledFieldPermission, setEnabledFieldPermission] = useState<boolean>();
  const spaceInfo = useSelector(state => state.space.curSpaceInfo)!;
  const spaceId = useSelector(state => state.space.activeId)!;

  const { run } = useRequest(DatasheetApi.fetchFieldPermissionRoleList, {
    manual: true,
    onSuccess(res) {
      const { success, data } = res.data;
      if (success) {
        const { members, roles, setting, enabled } = data;
        setEnabledFieldPermission(enabled);
        setMemberList(members);
        setRoleList(roles || []);
        setSetting(setting || defaultSetting);
        setTimeout(() => {
          if (enabled) {
            TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_OPENED);
            return;
          }
          TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_EXTEND);
        }, 0);
      }
    },
  });

  useMount(() => {
    fetchRoleList();
  });

  /**
   * Open column permissions
   * If the permission settings are not currently enabled, you will need to manually invoke them before the following actions can be performed
   * 1. New characters
   * 2. Editorial roles
   * 3. Delete Role
   * 4. Batch update roles
   * @returns
   */
  const openFieldPermission = async() => {
    if (enabledFieldPermission) {
      return true;
    }
    const result = triggerUsageAlert('fieldPermissionNums', { usage: spaceInfo.fieldRoleNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
    if (result) {
      return false;
    }

    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, true, true);
    const { success, message } = res.data;

    if (!success) {
      Message.warning({
        content: message,
      });
      return false;
    }
    dispatch(StoreActions.getSpaceInfo(spaceId, true));
    return true;
  };

  const submitAddRole = async(unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length || !permission) {
      return;
    }
    if (unitInfos.some(({ unitId }) => roleList.some(v => v.unitId === unitId && (v.isAdmin || v.isOwner)))) {
      Message.error({ content: t(Strings.no_permission_setting_admin) });
      return;
    }
    const unitIds = unitInfos.map(item => {
      return item.unitId;
    });
    const role = permission.value + '';
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const res = await DatasheetApi.addFieldPermissionRole(datasheetId, field.id, {
      role,
      unitIds,
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.add_role_success),
    });
    await fetchRoleList();
  };

  const permissionList = [
    {
      value: ConfigConstant.permission.editor,
      label: t(Strings.field_permission_add_editor),
      subLabel: t(Strings.field_permission_edit_sub_label),
    },
    {
      value: ConfigConstant.permission.reader,
      label: t(Strings.field_permission_add_reader),
      subLabel: t(Strings.field_permission_read_sub_label),
    },
  ];

  const handleErrMsg = (content: string) => {
    Message.warning({
      content,
    });
  };

  const editRole = async(unitId: string, role: string) => {
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const res = await DatasheetApi.editFieldPermissionRole(datasheetId, field.id, {
      role,
      unitId,
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success),
    });
    await fetchRoleList();
  };

  const onRemove = async(unitId: string) => {
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const res = await DatasheetApi.deleteFieldPermissionRole(datasheetId, field.id, unitId);
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success),
    });
    await fetchRoleList();
  };

  const fetchRoleList = async() => {
    await run(datasheetId, field.id);
  };

  const changeFormSheetAccessible = async(checked: boolean) => {
    const res = await DatasheetApi.updateFieldPermissionSetting(datasheetId, field.id, checked);
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success),
    });
    await fetchRoleList();
  };

  const createStandardUnit = (item: IFieldPermissionRole) => {
    return {
      id: item.unitId,
      avatar: item.avatar,
      name: item.unitName,
      info: item.teams,
      isTeam: item.unitType === MemberType.Team,
    };
  };

  const resetPermission = async() => {
    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, false);
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    dispatch(StoreActions.getSpaceInfo(spaceId, true));
    fetchRoleList();
  };

  const batchEditRole = async(role: string) => {
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const unitIds = (roleList || []).filter(v => !v.isAdmin && !v.isOwner).map(v => v.unitId);
    if (!unitIds.length) {
      return;
    }
    const res = await DatasheetApi.batchEditFieldPermissionRole(datasheetId, field.id, {
      role,
      unitIds,
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success),
    });
    await fetchRoleList();
  };

  const batchDeleteRole = async() => {
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const unitIds = (roleList || []).filter(v => !v.isAdmin && !v.isOwner).map(v => v.unitId);

    if (!unitIds.length) {
      return;
    }
    const res = await DatasheetApi.batchDeletePermissionRole(datasheetId, field.id, {
      unitIds,
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success),
    });
    await fetchRoleList();
  };

  if (!setting) {
    return (
      <Box padding={'0 16px'}>
        <Skeleton style={{ marginTop: 0 }} height={'16px'} />
        <Skeleton count={2} height={'48px'} />
      </Box>
    );
  }

  return (
    <div className={styles.fieldPermissionWrapper}>
      {!readonly && (
        <UnitPermissionSelect
          classNames={styles.permissionSelect}
          permissionList={permissionList}
          onSubmit={submitAddRole}
          adminAndOwnerUnitIds={roleList.filter(v => v.isAdmin || v.isOwner).map(v => v.unitId)}
        />
      )}
      <PermissionInfoSetting
        className={styles.permissionInfoSetting}
        members={memberList}
        isExtend={!enabledFieldPermission}
        resetPermission={resetPermission}
        toggleIsMemberDetail={toggleIsMemberDetail}
        batchEditRole={batchEditRole}
        defaultRole={permissionList}
        batchDeleteRole={batchDeleteRole}
        readonly={readonly}
        tipOptions={{
          extendTips: t(Strings.inherit_field_permission_tip),
          resetPopConfirmTitle: t(Strings.field_permission_close),
          resetPopConfirmContent: t(Strings.field_permisson_close_tip),
          resetPermissionDesc: t(Strings.reset_permission_desc_root),
        }}
      />
      <div className={styles.unitPermissionList}>
        {roleList.map(item => {
          return (
            <UnitItem
              key={item.unitId}
              unit={createStandardUnit(item)}
              role={item.role}
              roleOptions={permissionList}
              allowRemove={item.canRemove}
              onChange={editRole}
              onRemove={onRemove}
              roleInvalid={item.roleInvalid}
              identity={{
                admin: item.isAdmin,
                permissionOpener: item.isOwner,
                permissionOpenerTip: t(Strings.permisson_model_field_owner),
              }}
              isAppointMode
              disabled={item.nodeManageable || readonly}
              disabledTip={readonly ? '' : t(Strings.field_permission_uneditable_tooltips)}
              teamData={item.teamData}
              memberId={item.unitRefId}
            />
          );
        })}
      </div>
      {enabledFieldPermission && (
        <div className={styles.openFormPermission}>
          <Switch
            size={'small'}
            style={{ marginRight: 8 }}
            checked={setting.formSheetAccessible}
            onChange={changeFormSheetAccessible}
            disabled={readonly}
          />
          {t(Strings.field_permission_form_sheet_accessable)}
        </div>
      )}
      {isMemberDetail && (
        <MembersDetail
          data={{
            members: memberList,
            admins: (memberList.filter(member => member.isAdmin) as any) as IMember[],
          }}
          onCancel={toggleIsMemberDetail}
        />
      )}
    </div>
  );
};
