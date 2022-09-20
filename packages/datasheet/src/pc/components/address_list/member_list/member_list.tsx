import { IMemberInfoInAddressList, Navigation, StoreActions, Strings, t } from '@vikadata/core';
import { List } from 'antd';
import { InfoCard } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
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

export const MemberList: FC<IMemberList> = props => {
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
        const { memberId, memberName, email, avatar, isActive, isMemberNameModified } = item;
        const title = getSocialWecomUnitName({
          name: memberName,
          isModified: isMemberNameModified,
          spaceInfo,
        });
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
                title: memberName || t(Strings.added_not_yet),
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
