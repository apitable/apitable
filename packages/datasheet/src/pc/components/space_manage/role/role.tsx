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

import { useMount } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { Loading, Message } from '@apitable/components';
import { ConfigConstant, Api } from '@apitable/core';
import { useRoleRequest } from 'pc/hooks/use_role';
import { useAppSelector } from 'pc/store/react-redux';
import { Left } from './content/left';
import { IRightRefs, Right } from './content/right';
import { RoleContext } from './context';
import { Empty } from './empty';
import { Header } from './header';
import styles from './style.module.less';

const Role = () => {
  const [activeRoleId, setActiveRoleId] = useState<string>();
  const [activeRoleName, setActiveRoleName] = useState<string>();
  const rightRef = useRef<IRightRefs>(null);
  const manageable = useAppSelector(
    (state) => state.spacePermissionManage.spaceResource?.permissions.includes(ConfigConstant.PermissionCode.MANAGE_ROLE),
  );
  const { run: refreshRoleList, data } = useRoleRequest();
  const { isOpen, roles: roleList } = data;
  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  useMount(async () => {
    await refreshRoleList();
    setFirstLoading(false);
  });

  useEffect(() => {
    if (!isOpen) {
      setActiveRoleId(undefined);
    }
  }, [isOpen]);

  const beginUse = () => {
    Api.initRoles().then((res) => {
      const { success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      refreshRoleList();
    });
  };

  if (firstLoading) {
    return <Loading />;
  }

  return (
    <RoleContext.Provider
      value={{
        manageable,
        activeRoleName,
        setActiveRoleName,
        refreshMemberList: rightRef.current?.refreshMemberList,
      }}
    >
      {!isOpen || !roleList ? (
        <Empty onClick={beginUse} />
      ) : (
        <div className={styles.roleManage}>
          <Header />
          <div className={styles.roleManageContent}>
            <div className={styles.roleManageContentLeft}>
              <Left activeRoleId={activeRoleId} setActiveRoleId={setActiveRoleId} roleList={roleList} refreshRoleList={refreshRoleList} />
            </div>
            <div className={styles.roleManageContentRight}>{activeRoleId && <Right ref={rightRef} activeRoleId={activeRoleId} />}</div>
          </div>
        </div>
      )}
    </RoleContext.Provider>
  );
};

export default Role;
