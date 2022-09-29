import { useState } from 'react';
import { IEnablePermissionPlus } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import { Message } from 'pc/components/common/message/message';
import { Switch } from 'antd';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { useMount, useToggle } from 'ahooks';
import { useRequest } from 'pc/hooks';
import {
  ConfigConstant,
  DatasheetApi, IFieldPermissionMember, IFieldPermissionRole, IMember, IUnitValue, MemberType, Selectors, Strings, SubscribeKye, t
} from '@vikadata/core';
import { UnitItem } from 'pc/components/catalog/permission_settings_plus/permission/unit_item';
import { Box, IOption, Skeleton } from '@vikadata/components';
import { useSelector } from 'react-redux';
import { permission } from '@vikadata/core/dist/config/constant';
import { MembersDetail } from 'pc/components/catalog/permission_settings/permission/members_detail';
import { PermissionInfoSetting } from '../catalog/permission_settings_plus/permission/permission_info_setting';
import { triggerUsageAlert } from 'pc/common/billing/trigger_usage_alert';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';

const defaultSetting = { formSheetAccessible: false };

export const EnableFieldPermissionPlus: React.FC<IEnablePermissionPlus> = (props) => {
  const { field } = props;
  const [roleList, setRoleList] = useState<IFieldPermissionRole[]>([]);
  const [memberList, setMemberList] = useState<IFieldPermissionMember[]>([]);
  const [setting, setSetting] = useState<{formSheetAccessible: boolean;}>();
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const fieldPermission = useSelector(Selectors.getFieldPermissionMap)!;
  const readonly = fieldPermission[field.id] && !fieldPermission[field.id].manageable;
  const [enabledFieldPermission, setEnabledFieldPermission] = useState<boolean>();
  const spaceInfo = useSelector(state => state.space.curSpaceInfo)!;

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
        // 请求数据去触发引导
        setTimeout(() => {
          if (enabled) {
            TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_OPENED);
            return;
          }
          TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_EXTEND);
        }, 0);
      }
    }
  });

  useMount(() => {
    fetchRoleList();
  });

  /**
   * 开启列权限
   * 如果当前未开启权限设置，那么需要在以下操作进行之前去手动调用开启
   * 1. 新增角色
   * 2. 编辑角色
   * 3. 删除角色
   * 4. 批量更新角色
   * @returns 
   */
  const openFieldPermission = async() => {
    if (enabledFieldPermission) {
      return true;
    }
    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, true, true);
    const { success, message } = res.data;

    if (!success) {
      Message.warning({
        content: message,
      });
      return false;
    }
    triggerUsageAlert(SubscribeKye.FieldPermissionNums, { usage: spaceInfo.fieldRoleNums + 1 });
    return true;
  };

  const submitAddRole = async(unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length || !permission) {
      return;
    }
    // 检查选择的人中是否有管理员
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
      role, unitIds
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.add_role_success)
    });
    await fetchRoleList();
  };

  const permissionList = [
    {
      value: permission.editor,
      label: t(Strings.field_permission_add_editor),
      subLabel: t(Strings.field_permission_edit_sub_label),
    },
    {
      value: permission.reader,
      label: t(Strings.field_permission_add_reader),
      subLabel: t(Strings.field_permission_read_sub_label),
    },
  ];

  const handleErrMsg = (content: string) => {
    Message.warning({
      content
    });
  };

  const editRole = async(unitId: string, role: string) => {
    const openFieldPermissionRes = await openFieldPermission();
    if (!openFieldPermissionRes) {
      return;
    }
    const res = await DatasheetApi.editFieldPermissionRole(datasheetId, field.id, {
      role, unitId
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success)
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
      content: t(Strings.operate_success)
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
      content: t(Strings.operate_success)
    });
    await fetchRoleList();
  };

  const createStandardUnit = (item: IFieldPermissionRole) => {
    return {
      id: item.unitId,
      avatar: item.avatar,
      name: item.unitName,
      info: item.teams,
      isTeam: item.unitType === MemberType.Team
    };
  };

  const roleOptions = [{
    value: permission.editor,
    label: t(Strings.can_edit),
  }, {
    value: permission.reader,
    label: t(Strings.can_read),
  }];

  const resetPermission = async() => {
    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, false);
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
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
      role, unitIds
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success)
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
      unitIds
    });
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    Message.success({
      content: t(Strings.operate_success)
    });
    await fetchRoleList();
  };

  if (!setting) {
    return (
      <Box padding={'0 16px'}>
        <Skeleton style={{ marginTop: 0 }} height={'16px'} />
        <Skeleton count={2} height={'48px'}/>
      </Box>
    );
  }

  return <div className={styles.fieldPermissionWrapper}>
    {
      !readonly && <UnitPermissionSelect
        classNames={styles.permissionSelect}
        permissionList={permissionList}
        onSubmit={submitAddRole}
        adminAndOwnerUnitIds={roleList.filter(v => v.isAdmin || v.isOwner).map(v => v.unitId)}
      />
    }
    <PermissionInfoSetting
      className={styles.permissionInfoSetting}
      members={memberList}
      isExtend={!enabledFieldPermission}
      resetPermission={resetPermission}
      toggleIsMemberDetail={toggleIsMemberDetail}
      batchEditRole={batchEditRole}
      defaultRole={roleOptions}
      batchDeleteRole={batchDeleteRole}
      readonly={readonly}
      tipOptions={{
        extendTips: t(Strings.inherit_field_permission_tip),
        resetPopConfirmTitle: t(Strings.field_permission_close),
        resetPopConfirmContent:  t(Strings.field_permisson_close_tip),
        resetPermissionDesc: t(Strings.reset_permission_desc_root)
      }}
    />
    <div className={styles.unitPermissionList}>
      {
        roleList.map(item => {
          
          return <UnitItem
            key={item.unitId}
            unit={createStandardUnit(item)}
            role={item.role}
            roleOptions={roleOptions}
            allowRemove={item.canRemove}
            onChange={editRole}
            onRemove={onRemove}
            roleInvalid={item.roleInvalid}
            identity={{
              admin: item.isAdmin,
              permissionOpener: item.isOwner,
              permissionOpenerTip: t(Strings.permisson_model_field_owner)
            }}
            isAppointMode
            disabled={item.nodeManageable || readonly}
            disabledTip={readonly ? '' : t(Strings.field_permission_uneditable_tooltips)}
            isFieldPermission
          />;
        })
      }
    </div>
    {enabledFieldPermission && <div className={styles.openFormPermission}>
      <Switch
        size={'small'}
        style={{ marginRight: 8 }}
        checked={setting.formSheetAccessible}
        onChange={changeFormSheetAccessible}
        disabled={readonly}
      />
      {t(Strings.field_permission_form_sheet_accessable)}
    </div>}
    {
      isMemberDetail &&
      (
        <MembersDetail
          data={{
            members: memberList,
            admins: memberList.filter(member => member.isAdmin) as any as IMember[]
          }}
          onCancel={toggleIsMemberDetail}
        />
      )
    }
  </div>;
};
