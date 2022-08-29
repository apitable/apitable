import { FC } from 'react';
import { List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.less';
import { StoreActions, IMemberInfoInAddressList, t, Strings, Navigation } from '@vikadata/core';
import { InfoCard } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useState } from 'react';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { expandMemberInfo } from '../expand_member_info';
import { Identity } from 'pc/components/space_manage/identity';
import { getIdentity } from '../member_info';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

export interface IMemberList {
  memberList: IMemberInfoInAddressList[];
  // selectedMemberId: string;
  // setSMemberId: React.Dispatch<React.SetStateAction<string>>;
}

export const MemberList: FC<IMemberList> = props => {

  const { memberList } = props;

  const dispatch = useDispatch();

  const navigationTo = useNavigation();

  const curMemberId = useSelector(state => state.pageParams.memberId);

  const spaceId = useSelector(state => state.space.activeId);

  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  const [selectedMemberId, setSelectedMemberId] = useState('');

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const onSelect = (data: IMemberInfoInAddressList) => {
    const {
      memberId,
    } = data;
    setSelectedMemberId(memberId);
    navigationTo({ path: Navigation.MEMBER_DETAIL, params: { spaceId, memberId }});
    isMobile && expandMemberInfo();
    dispatch(StoreActions.updateMemberInfo(data));
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={memberList}
      className={styles.memberListWrapper}
      renderItem={item => {
        const { memberId, memberName, email, avatar, isActive, isMemberNameModified } = item;
        const title = getSocialWecomUnitName({
          name: memberName,
          isModified: isMemberNameModified,
          spaceInfo
        });
        const desc = () => {
          if (email && (!isActive)) {
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
          <List.Item
            onClick={() => onSelect(item)}
            className={(selectedMemberId === memberId || curMemberId === memberId) ? styles.selectItem : ''}
          >
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
