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

import React, { useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Message } from '@apitable/components';
import { Api, MemberType, Strings, t, UnitItem } from '@apitable/core';
import { SelectUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { RoleContext } from '../context';
import { IMemberItem } from '../interface';
import { RightHeader } from './right_header';
import { defaultPage, IPageInfo, RoleTable } from './role_table';

import styles from './style.module.less';

export interface IRightRefs {
  refreshMemberList: (roleId: string) => void;
}

const RightBase: React.ForwardRefRenderFunction<IRightRefs, { activeRoleId: string }> = (props, ref) => {
  const { activeRoleId } = props;
  const { activeRoleName } = useContext(RoleContext);
  const [list, setList] = useState<IMemberItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectMemberModal, setSelectMemberModal] = useState<boolean>();
  const [batchSelectMember, setBatchSelectMember] = useState<string[]>();
  const getMemberList = useCallback((roleId: string, pageInfo: IPageInfo = defaultPage) => {
    Api.getRoleMemberList(roleId, {
      pageNo: pageInfo.page,
      pageSize: pageInfo.pageSize,
    }).then((res) => {
      const { data } = res;
      if (!data.success) {
        Message.error({ content: data.message });
        return;
      }
      const { records, total } = data.data;
      setList(records);
      setTotal(total);
    });
  }, []);

  useImperativeHandle(ref, () => ({
    refreshMemberList: getMemberList,
  }));

  useEffect(() => {
    if (!activeRoleId) {
      return;
    }
    getMemberList(activeRoleId);
  }, [activeRoleId, getMemberList]);

  const onChangePage = (page: number, pageSize?: number) => getMemberList(activeRoleId, { page, pageSize: pageSize! });

  const addMember = (unitList: UnitItem[]) => {
    if (unitList.length === 0) {
      return;
    }
    const list: { id: string; type: MemberType }[] = [];
    unitList.forEach((item) => {
      const isTeam = 'teamId' in item;
      const isMember = 'memberId' in item;

      if (isTeam || isMember) {
        list.push({
          id: isTeam ? item.teamId : item.memberId,
          type: isTeam ? MemberType.Team : MemberType.Member,
        });
      }
    });
    Api.addRoleMember(activeRoleId, list).then((res) => {
      const { success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      Message.success({ content: t(Strings.add_member_success) });
      getMemberList(activeRoleId);
    });
  };

  const openAddMemberModal = () => setSelectMemberModal(true);

  const removeRole = (unitIds: string[]) => {
    if (unitIds.length === 0) {
      return;
    }
    Api.deleteRoleMember(activeRoleId, unitIds).then((res) => {
      const { success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      Message.success({ content: t(Strings.delete_role_member_success) });
      getMemberList(activeRoleId);
    });
  };

  const onRemove = (unitIds: string[]) => {
    if (unitIds.length === 0) {
      return;
    }
    Modal.confirm({
      type: 'warning',
      title: t(Strings.delete_role_member_title),
      content: t(Strings.delete_role_member_content),
      onOk: () => removeRole(unitIds),
    });
  };

  return (
    <div className={styles.rightWrap}>
      <RightHeader
        count={total}
        buttonOpts={{ disabledRemoveBtn: !Boolean(batchSelectMember?.length) }}
        roleName={activeRoleName}
        openAddMemberModal={openAddMemberModal}
        onRemove={() => onRemove(batchSelectMember || [])}
      />
      <RoleTable
        list={list}
        total={total}
        onChangePage={onChangePage}
        openAddMemberModal={openAddMemberModal}
        onRemove={onRemove}
        onBatchSelectMember={setBatchSelectMember}
      />
      {selectMemberModal && (
        <SelectUnitModal
          source={SelectUnitSource.TeamAddMember}
          disableIdList={list.map((v) => v.unitId)}
          onCancel={() => setSelectMemberModal(false)}
          onSubmit={addMember}
          maskClosable
        />
      )}
    </div>
  );
};

export const Right = React.forwardRef(RightBase);
