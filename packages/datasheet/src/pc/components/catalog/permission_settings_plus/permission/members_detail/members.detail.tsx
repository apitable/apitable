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

import { useThrottleFn } from 'ahooks';
import { List } from 'antd';
import VirtualList from 'rc-virtual-list';
import { FC, useRef, useEffect, useState } from 'react';
import { t, Strings } from '@apitable/core';
import { BaseModal } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { IMemberList } from '../permission';
import { UnitItem } from '../unit_item';
import styles from './style.module.less';

export interface ICollaboratorInfo {
  total: number;
  pages: number;
  records: IMemberList[];
  extend: boolean;
}

export interface IMembersDetailProps {
  data: ICollaboratorInfo;
  memberList: IMemberList[];
  onCancel: () => void;
  pageNo: number;
  setPageNo: (pageNo: number) => void;
}

export const MembersDetail: FC<React.PropsWithChildren<IMembersDetailProps>> = ({ data, onCancel, pageNo, setPageNo, memberList }) => {
  const wrapref = useRef<HTMLDivElement>(null);

  const [listHeight, setListHeight] = useState<number>(556);

  useEffect(() => {
    if (wrapref.current) {
      const parentElement = wrapref.current;
      const observer = new ResizeObserver((entries) => {
        const { height } = entries[0].contentRect;
        setListHeight(height);
      });

      observer.observe(parentElement);

      return () => {
        observer.unobserve(parentElement);
      };
    }
    return () => {};
  }, []);

  const close = () => {
    onCancel();
  };

  const handleScroll = () => {
    setPageNo(pageNo + 1);
  };

  const { run: loadData } = useThrottleFn(() => handleScroll(), { wait: 500 });

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop >= listHeight && pageNo < data.pages) {
      loadData();
    }
  };

  const renderMemberList = () => {
    return (
      <div className={styles.scrollWrapper} ref={wrapref}>
        <div className={styles.memberList}>
          <List itemLayout="horizontal">
            <VirtualList
              data={memberList}
              itemKey="memberId"
              height={listHeight}
              itemHeight={80}
              onScroll={onScroll}
              className={styles.memberListWrapper}
            >
              {(item) => {
                const { memberId, avatar, avatarColor, nickName, memberName, teams, role, isWorkbenchAdmin, isControlOwner } = item;
                return (
                  <List.Item>
                    <UnitItem
                      key={memberId}
                      unit={{
                        id: memberId,
                        memberId: memberId,
                        avatar,
                        avatarColor,
                        nickName,
                        name: memberName,
                        info: teams,
                        isMemberNameModified: (item as any).isMemberNameModified,
                        isTeam: false,
                      }}
                      identity={{
                        admin: isWorkbenchAdmin,
                        permissionOpener: isControlOwner,
                      }}
                      disabled
                      role={role}
                      isAppointMode={data.extend}
                      isDetail
                    />
                  </List.Item>
                );
              }}
            </VirtualList>
          </List>
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
              <div className={styles.title}>{t(Strings.share_and_permission_member_detail, { count: data.total })}</div>
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
          title={t(Strings.share_and_permission_member_detail, { count: data.total })}
          onClose={close}
        >
          {renderMemberList()}
        </Popup>
      </ComponentDisplay>
    </>
  );
};
