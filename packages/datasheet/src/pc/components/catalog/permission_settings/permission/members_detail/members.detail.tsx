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

import { FC } from 'react';
import { INodeRoleMap, t, Strings } from '@apitable/core';
import { BaseModal } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { UnitItem } from '../unit_item';
import styles from './style.module.less';

export interface IMembersDetailProps {
  // data: INodeRoleMap;
  data: Partial<INodeRoleMap> & Pick<INodeRoleMap, 'members' | 'admins'>;
  onCancel: () => void;
}

export const MembersDetail: FC<React.PropsWithChildren<IMembersDetailProps>> = ({ data, onCancel }) => {
  const close = () => {
    onCancel();
  };

  const renderMemberList = () => {
    return (
      <div className={styles.scrollWrapper}>
        <div className={styles.memberList}>
          {data.members.map((member) => {
            const isAdmin = Boolean(data.admins.find((item) => item.memberId === member.memberId));
            const isPermissionOpener = data.owner?.memberId === member.memberId;
            return (
              <UnitItem
                key={member.memberId}
                unit={{
                  id: member.memberId,
                  avatarColor: member.avatarColor,
                  avatar: member.avatar,
                  name: member.memberName,
                  nickName: member.nickName,
                  info: member.teams,
                  isTeam: false,
                }}
                identity={{
                  admin: isAdmin,
                  permissionOpener: isPermissionOpener,
                }}
                disabled
                role={member.role}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <BaseModal footer={null} onCancel={close} width={560}>
          <div className={styles.membersDetail}>
            <div className={styles.container}>
              <div className={styles.title}>{t(Strings.share_and_permission_member_detail, { count: data.members.length })}</div>
              {renderMemberList()}
            </div>
          </div>
        </BaseModal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          className={styles.permissionDrawer}
          height="90%"
          open
          placement="bottom"
          title={t(Strings.share_and_permission_member_detail, { count: data.members.length })}
          onClose={close}
        >
          {renderMemberList()}
        </Popup>
      </ComponentDisplay>
    </>
  );
};
