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

import { IMemberInfoInAddressList, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { List } from 'antd';
import { InfoCard } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/enum';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise';
import { Router } from 'pc/components/route_manager/router';
import { Identity } from 'pc/components/space_manage/identity';
import { useResponsive } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expandMemberInfo } from '../expand_member_info';
import { getIdentity } from '../member_info';
import styles from './style.module.less';

export interface IMemberList {
  memberList: IMemberInfoInAddressList[];
  // selectedMemberId: string;
  // setSMemberId: React.Dispatch<React.SetStateAction<string>>;
}

export const MemberList: FC<React.PropsWithChildren<IMemberList>> = props => {
  const { memberList } = props;
  const dispatch = useDispatch();
  const curMemberId = useSelector(state => state.pageParams.memberId);
  const spaceId = useSelector(state => state.space.activeId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const onSelect = (data: IMemberInfoInAddressList) => {
    const { memberId } = data;
    setSelectedMemberId(memberId);
    Router.push(Navigation.MEMBER_DETAIL, { params: { spaceId, memberId }});
    isMobile && expandMemberInfo();
    dispatch(StoreActions.updateMemberInfo(data));
  };

  return (
    <List
      itemLayout='horizontal'
      dataSource={memberList}
      className={styles.memberListWrapper}
      renderItem={item => {
        const { memberId, memberName, email, avatar, isActive, isMemberNameModified, avatarColor, nickName } = item;
        const title = getSocialWecomUnitName?.({
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
        const identity = getIdentity(item);
        return (
          <List.Item onClick={() => onSelect(item)} className={selectedMemberId === memberId || curMemberId === memberId ? styles.selectItem : ''}>
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
          </List.Item>
        );
      }}
    />
  );
};
