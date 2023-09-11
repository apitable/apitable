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

import { useContext, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, ContextMenu, Message } from '@apitable/components';
import { Api, StatusCode, Strings, t } from '@apitable/core';
import { AddOutlined, DeleteOutlined, EditOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, AvatarType, SearchEmpty, SearchInput } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';

import { flatContextData } from 'pc/utils';
import { RoleContext } from '../context';
import { IRoleItem } from '../interface';
import { expandEditRoleModal } from './edit_role_modal';
import { RoleItem, ROLE_MENU_EDIT_ID } from './role_item';

import styles from './style.module.less';

export const addRole = (roleName: string, cb: () => void) => {
  if (!roleName) {
    return;
  }
  Api.createRole(roleName).then((res) => {
    const { data } = res;
    if (!data.success) {
      Message.error({ content: data.message });
      return;
    }
    cb();
    Message.success({ content: t(Strings.add_role_success_message) });
  });
};

export const Left: React.FC<
  React.PropsWithChildren<{
    roleList: IRoleItem[];
    refreshRoleList: () => void;
    activeRoleId?: string;
    setActiveRoleId: (roleId: string) => void;
  }>
> = (props) => {
  const { roleList, refreshRoleList, activeRoleId, setActiveRoleId } = props;
  const { manageable, setActiveRoleName, refreshMemberList } = useContext(RoleContext);
  const [search, setSearch] = useState<string>('');

  const searchResultList = useMemo(() => {
    if (!search) {
      return [];
    }
    return roleList.filter((v) => v.roleName.includes(search));
  }, [roleList, search]);

  useEffect(() => {
    const role = roleList.find((v) => v.roleId === activeRoleId);
    if (!role) {
      // delete role trigger refresh role list
      setActiveRoleId(roleList[0]?.roleId);
      return;
    }
    setActiveRoleName && setActiveRoleName(role.roleName);
  }, [roleList, activeRoleId, setActiveRoleName, setActiveRoleId]);

  const editRole = (role: IRoleItem, roleName: string) => {
    const { roleId } = role;
    if (!roleName) {
      return;
    }
    Api.updateOrgRole(roleId, roleName).then((res) => {
      const { data } = res;
      if (!data.success) {
        Message.error({ content: data.message });
        return;
      }
      refreshRoleList();
      Message.success({ content: t(Strings.rename_role_success_message) });
    });
  };

  const deleteRole = (role: IRoleItem) => {
    const { roleId } = role;
    Api.deleteOrgRole(roleId).then((res) => {
      const { data } = res;
      // has member error code check
      if (!data.success && data.code === StatusCode.DELETE_ROLE_EXIST_MEMBER) {
        Modal.confirm({
          type: 'warning',
          title: t(Strings.delete_role_warning_title),
          content: t(Strings.delete_role_warning_content),
          onOk: () => activeRoleId && refreshMemberList && refreshMemberList(activeRoleId),
        });
        return;
      }
      if (!data.success) {
        Message.error({ content: data.message });
        return;
      }
      refreshRoleList();
      Message.success({ content: t(Strings.delete_role_success_message) });
    });
  };

  const roleNameArray = roleList.map((v) => v.roleName);

  const menuData = [
    [
      {
        icon: <EditOutlined />,
        text: t(Strings.role_context_item_rename),
        onClick: ({ onEdit, roleName, role }: any) => {
          expandEditRoleModal({
            value: roleName,
            title: t(Strings.rename_role_title),
            onChange: (value) => onEdit?.(role, value),
            existed: roleNameArray,
          });
        },
      },
      {
        icon: <DeleteOutlined />,
        text: t(Strings.role_context_item_delete),
        onClick: ({ onDelete, role }: any) => {
          onDelete?.(role);
        },
      },
    ],
  ];

  return (
    <div className={styles.leftWrap}>
      <SearchInput size="small" keyword={search} change={setSearch} />
      {search ? (
        <RoleListSearchContent activeRoleId={activeRoleId} list={searchResultList} onClick={setActiveRoleId} />
      ) : (
        <>
          {manageable && (
            <Button
              className={styles.addButton}
              prefixIcon={<AddOutlined />}
              color="primary"
              size="small"
              block
              onClick={() => {
                expandEditRoleModal({
                  value: '',
                  title: t(Strings.add_role_title),
                  onChange: (roleName: string) => addRole(roleName, refreshRoleList),
                  existed: roleNameArray,
                });
              }}
            >
              {t(Strings.add_role_btn)}
            </Button>
          )}
          <div className={styles.leftList}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              {roleList.map((roleItem) => (
                <RoleItem
                  key={roleItem.roleId}
                  role={roleItem}
                  onEdit={editRole}
                  onDelete={deleteRole}
                  onClick={setActiveRoleId}
                  selected={activeRoleId === roleItem.roleId}
                />
              ))}
            </Scrollbars>
          </div>
          <ContextMenu overlay={flatContextData(menuData, true)} menuId={ROLE_MENU_EDIT_ID} />
        </>
      )}
    </div>
  );
};

const RoleListSearchContent: React.FC<
  React.PropsWithChildren<{
    list: IRoleItem[];
    activeRoleId?: string;
    onClick?: (roleId: string) => void;
  }>
> = (props) => {
  const { activeRoleId, list, onClick } = props;
  if (list.length === 0) {
    return <SearchEmpty />;
  }
  return (
    <div className={styles.roleListSearchWrap}>
      <Scrollbars style={{ width: '100%', height: '100%' }}>
        {list.map((role, index) => (
          <RoleItem
            key={index}
            role={role}
            onClick={onClick}
            icon={<Avatar id={role.roleId} title={role.roleName} size={AvatarSize.Size32} type={AvatarType.Team} />}
            selected={activeRoleId === role.roleId}
          />
        ))}
      </Scrollbars>
    </div>
  );
};
