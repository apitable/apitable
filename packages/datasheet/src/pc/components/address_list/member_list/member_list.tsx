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
import { FC, useState, useEffect } from 'react';
import { Loading } from '@apitable/components';
import { IMemberInfoInAddressList, Navigation, StoreActions, Strings, t, ConfigConstant } from '@apitable/core';
import { InfoCard } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { Router } from 'pc/components/route_manager/router';
import { Identity } from 'pc/components/space_manage/identity';
import { useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { expandMemberInfo } from '../expand_member_info';
import { getIdentity } from '../member_info';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export interface IMemberList {
  memberList: IMemberInfoInAddressList[];
  // selectedMemberId: string;
  // setSMemberId: React.Dispatch<React.SetStateAction<string>>;
}

export const MemberList: FC<React.PropsWithChildren<IMemberList>> = (props) => {
  const { memberList } = props;
  const dispatch = useAppDispatch();
  const curMemberId = useAppSelector((state) => state.pageParams.memberId);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const memberListPageNo = useAppSelector((state) => state.addressList.memberListPageNo);
  const memberListTotal = useAppSelector((state) => state.addressList.memberListTotal);
  const memberListLoading = useAppSelector((state) => state.addressList.memberListLoading);
  const selectedTeamInfo = useAppSelector((state) => state.addressList.selectedTeamInfo);
  const onSelect = (data: IMemberInfoInAddressList) => {
    const { memberId } = data;
    setSelectedMemberId(memberId);
    Router.push(Navigation.MEMBER_DETAIL, { params: { spaceId, memberId } });
    isMobile && expandMemberInfo();
    dispatch(StoreActions.updateMemberInfo(data));
  };

  const [listHeight, setListHeight] = useState<number>(window.innerHeight - 101);
  useEffect(() => {
    const handleResize = () => {
      setListHeight(window.innerHeight - 101);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = () => {
    dispatch(StoreActions.updateMemberListPageNo(memberListPageNo + 1));
    dispatch(StoreActions.getMemberListPageData(memberListPageNo + 1, selectedTeamInfo.teamId));
  };

  const { run: loadData } = useThrottleFn(() => handleScroll(), { wait: 500 });

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const pages = Math.ceil(memberListTotal / ConfigConstant.MEMBER_LIST_PAGE_SIZE);
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === listHeight && memberListPageNo < pages) {
      loadData();
    }
  };

  return (
    <div className={styles.memberListContainer}>
      <List itemLayout="horizontal">
        <VirtualList
          data={memberList}
          itemKey="memberId"
          height={listHeight}
          itemHeight={70}
          onScroll={onScroll}
          className={styles.memberListWrapper}
        >
          {(item) => {
            const { memberId, memberName, email, avatar, isActive, isMemberNameModified, avatarColor, nickName } = item;
            const title =
              getSocialWecomUnitName?.({
                name: memberName,
                isModified: isMemberNameModified,
                spaceInfo,
              }) || memberName;
            const desc = () => {
              if (email && !isActive) {
                return t(Strings.added_not_yet);
              }
              if (email && isActive) {
                return email;
              }
              if (!email) {
                return t(Strings.unbound);
              }
              return '';
            };
            const identity = getIdentity({
              ...item,
              isMainAdmin: item.isPrimary,
              isAdmin: item.isSubAdmin,
            });
            return (
              <List.Item
                key={item.memberId}
                onClick={() => onSelect(item)}
                className={selectedMemberId === memberId || curMemberId === memberId ? styles.selectItem : ''}
              >
                <div className={styles.listItem}>
                  <InfoCard
                    title={title || ''}
                    description={desc()}
                    avatarProps={{
                      id: memberId,
                      avatarColor,
                      title: nickName || t(Strings.added_not_yet),
                      src: avatar,
                    }}
                    token={identity ? <Identity type={identity} /> : undefined}
                  />
                </div>
              </List.Item>
            );
          }}
        </VirtualList>
        {/* <div className={styles.lodaing} > <Loading /> </div> */}
      </List>
      {memberListLoading && (
        <div className={styles.lodingWrapper}>
          <Loading currentColor />
          <p>{t(Strings.data_loading)}</p>
        </div>
      )}
    </div>
  );
};
