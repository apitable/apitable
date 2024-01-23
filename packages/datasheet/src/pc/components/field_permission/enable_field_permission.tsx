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

import { useMount, useToggle } from 'ahooks';
import { Switch } from 'antd';
import { useState } from 'react';
import * as React from 'react';
import { IOption, LinkButton, Typography, useThemeColors } from '@apitable/components';
import {
  DatasheetApi,
  IFieldPermissionMember,
  IFieldPermissionRole,
  IMember,
  IUnitValue,
  MemberType,
  Selectors,
  Strings,
  t,
  ConfigConstant,
} from '@apitable/core';
import { ChevronRightOutlined, UserGroupFilled } from '@apitable/icons';
import { MembersDetail } from 'pc/components/catalog/permission_settings/permission/members_detail';
import { UnitItem } from 'pc/components/catalog/permission_settings/permission/unit_item';
import { Message, Popconfirm } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { IEnablePermission } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { useRequest, useResponsive } from 'pc/hooks';

import { useAppSelector } from 'pc/store/react-redux';

export const EnableFieldPermission: React.FC<React.PropsWithChildren<IEnablePermission>> = (props) => {
  const colors = useThemeColors();
  const { permissionStatus, onClose, field } = props;
  const [confirmPopVisible, setConfirmPopVisible] = useState(false);
  const [roleList, setRoleList] = useState<IFieldPermissionRole[]>([]);
  const [memberList, setMemberList] = useState<IFieldPermissionMember[]>([]);
  const [setting, setSetting] = useState({ formSheetAccessible: false });
  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId)!;
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const { screenIsAtLeast, screenIsAtMost } = useResponsive();
  const fieldPermission = useAppSelector(Selectors.getFieldPermissionMap)!;
  const readonly = fieldPermission[field.id] && !fieldPermission[field.id].manageable;
  const { run } = useRequest(DatasheetApi.fetchFieldPermissionRoleList, {
    manual: true,
    onSuccess(res) {
      const { success, data } = res.data;
      if (success) {
        const { members, roles, setting } = data;
        setMemberList(members);
        setRoleList(roles);
        setSetting(setting);
      }
    },
  });

  useMount(() => {
    fetchRoleList();
  });

  const submitAddRole = async (unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length || !permission) {
      return;
    }
    const unitIds = unitInfos.map((item) => {
      return item.unitId;
    });
    const role = permission.value + '';
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

  const closeFieldPermission = async () => {
    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, false);
    const { success, message } = res.data;
    if (!success) {
      handleErrMsg(message);
      return;
    }
    onClose();
  };

  const editRole = async (unitId: string, role: string) => {
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

  const onRemove = async (unitId: string) => {
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

  const fetchRoleList = async () => {
    await run(datasheetId, field.id);
  };

  const changeFormSheetAccessible = async (checked: boolean) => {
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

  return (
    <div className={styles.openPermissionWrapper}>
      <div className={styles.switchWrapper}>
        <Popconfirm
          title={t(Strings.field_permission_close)}
          content={<div>{t(Strings.field_permisson_close_tip)}</div>}
          visible={confirmPopVisible}
          onCancel={() => {
            setConfirmPopVisible(false);
          }}
          onOk={closeFieldPermission}
          type="warning"
        >
          <Switch
            size={'small'}
            checked={permissionStatus}
            style={{ marginRight: 8 }}
            onClick={() => {
              setConfirmPopVisible(true);
            }}
            disabled={readonly}
          />
        </Popconfirm>
        <Typography variant={'body2'}>{t(Strings.field_permission_switch_open)}</Typography>
      </div>
      {!readonly && <UnitPermissionSelect classNames={styles.permissionSelect} permissionList={permissionList} onSubmit={submitAddRole} />}
      <div className={styles.collaboratorTip}>
        <span className={styles.leftTip}>
          <UserGroupFilled color={[colors.thirdLevelText, 'transparent']} />
          <Typography variant={'body4'} component={'span'} className={styles.customColor}>
            {t(Strings.field_permission_modal_tip)}
          </Typography>
        </span>
        {screenIsAtLeast(ScreenSize.md) && (
          <LinkButton color={'default'} className={styles.rightButton} onClick={() => toggleIsMemberDetail()} underline={false}>
            <Typography variant={'body4'} component={'span'} className={styles.customColor}>
              {t(Strings.view_by_person)}
            </Typography>
            <ChevronRightOutlined color={colors.thirdLevelText} />
          </LinkButton>
        )}
      </div>
      {screenIsAtMost(ScreenSize.md) && (
        <span className={styles.mobileMemberList} onClick={() => toggleIsMemberDetail()}>
          {t(Strings.view_collaborative_members, {
            number: memberList.length,
          })}
        </span>
      )}
      <div className={styles.unitPermissionList}>
        {roleList.map((item) => {
          const roleOptions = [
            {
              value: ConfigConstant.permission.editor,
              label: t(Strings.can_edit),
            },
            {
              value: ConfigConstant.permission.reader,
              label: t(Strings.can_read),
            },
          ];
          return (
            <UnitItem
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
                permissionOpenerTip: t(Strings.permisson_model_field_owner),
              }}
              disabled={item.nodeManageable || readonly}
              disabledTip={readonly ? '' : t(Strings.field_permission_uneditable_tooltips)}
            />
          );
        })}
      </div>
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
      {isMemberDetail && (
        <MembersDetail
          data={{
            members: memberList,
            admins: memberList.filter((member) => member.isAdmin) as any as IMember[],
          }}
          onCancel={toggleIsMemberDetail}
        />
      )}
    </div>
  );
};
