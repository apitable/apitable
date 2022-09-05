import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import {
  Strings,
  t,
  ConfigConstant,
  StoreActions,
  Api,
  IApi,
  IReduxState,
  Navigation,
  ADDRESS_ID,
  Player,
  Events,
  getCustomConfig,
  IMember,
  ITeam,
  isIdassPrivateDeployment,
} from '@vikadata/core';
import { Input } from 'antd';
import { expandInviteModal } from 'pc/components/invite';
import { AddressTreeMenu } from '../../address_list/address_tree_menu';
import { SearchTeamAndMember } from 'pc/components/common';
import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useRequest } from 'pc/hooks';
import { useUserRequest, useSideBarVisible, useResponsive } from 'pc/hooks';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { OrganizationHead } from 'pc/components/organization_head';
import { ScreenSize, ComponentDisplay } from 'pc/components/common/component_display';
import classNames from 'classnames';
import { expandMemberInfo } from 'pc/components/address_list/expand_member_info';
import { Button } from '@vikadata/components';
import { AddOutlined, AddressOutlined } from '@vikadata/icons';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Message } from 'pc/components/common/message';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform';
import { stopPropagation } from 'pc/utils';

export const AddressSide: React.FC = () => {
  const { teamList, spaceId, userInfo } = useSelector(
    (state: IReduxState) => ({
      teamList: state.addressList.teamList,
      spaceId: state.space.activeId,
      userInfo: state.user.info,
    }),
    shallowEqual,
  );

  const { isAdmin } = userInfo!;

  const dispatch = useDispatch();
  const { getInviteStatus } = useUserRequest();
  const { data: inviteRes, loading } = useRequest(getInviteStatus);

  // 是否处于搜索状态
  const [inSearch, setInSearch] = useState<boolean>(false);

  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  useEffect(() => {
    if (spaceInfo && !isSocialPlatformEnabled(spaceInfo)) {
      Player.doTrigger(Events.address_shown);
    }
  }, [spaceInfo]);

  const { setSideBarVisible } = useSideBarVisible();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  // 操作-选择小组，获取所选小组信息，以及小组成员列表
  const teamClick = React.useCallback(
    (teamId: string) => {
      Api.readTeam(teamId).then(res => {
        const { success, data } = res.data;
        if (success) {
          dispatch(
            StoreActions.updateSelectedTeamInfo({
              teamTitle: data.teamName,
              memberCount: data.memberCount,
              teamId: data.teamId,
            }),
          );
        }
      });
      isMobile && setSideBarVisible(false);
      dispatch(StoreActions.updateMemberInfo({ memberId: '', email: '' }));
    },
    [isMobile, setSideBarVisible, dispatch],
  );
  const navigationTo = useNavigation();

  // 操作-选择成员
  const memberClick = (memberId: string) => {
    navigationTo({ path: Navigation.MEMBER_DETAIL, params: { spaceId, memberId } });
    isMobile && expandMemberInfo();
    teamClick(ConfigConstant.ROOT_TEAM_ID);
    dispatch(StoreActions.getMemberInfoData(memberId));
  };

  const { syncTeamsAndMembersLinkId = '' } = getCustomConfig();

  const isSyncingMembers = syncTeamsAndMembersLinkId && isAdmin;
  const btnSize = isSyncingMembers ? 'large' : 'middle';

  const OperateButton = React.useMemo(() => {
    // 玉符私有化隐藏按钮
    if (isIdassPrivateDeployment()) {
      return;
    }

    if (inviteRes && !loading) {
      return (
        <>
          {isSyncingMembers && (
            <Button
              color="primary"
              prefixIcon={<AddOutlined />}
              id={ADDRESS_ID.INVITE_BTN}
              className={classNames({ [styles.inviteBtnMobile]: isMobile })}
              onClick={() => {
                expandUnitModal({
                  source: SelectUnitSource.SyncMember,
                  onSubmit: values => {
                    const data = values.reduce(
                      (prev: IApi.ISyncMemberRequest, cur) => {
                        if ((cur as IMember).memberId) {
                          const { syncingTeamId, memberId, memberName } = cur as IMember & { syncingTeamId: string };
                          prev.members.push({ teamId: syncingTeamId, memberId, memberName });
                        } else if ((cur as ITeam).teamId) {
                          prev.teamIds.push((cur as ITeam).teamId);
                        }
                        return prev;
                      },
                      { members: [], linkId: syncTeamsAndMembersLinkId, teamIds: [] },
                    );

                    Message.loading({ content: t(Strings.syncing) });
                    Api.syncOrgMembers(data).then(res => {
                      const { success, message } = res.data;
                      if (!success) {
                        Message.error({ content: message });
                      } else {
                        dispatch(StoreActions.getTeamListData(userInfo!));
                        Message.success({ content: t(Strings.sync_success) });
                      }
                    });
                  },
                  isSingleSelect: false,
                  checkedList: [],
                });
              }}
              size={btnSize}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {t(Strings.poc_sync_members)}
            </Button>
          )}
          <Button
            size={btnSize}
            color={isSyncingMembers ? 'default' : 'primary'}
            prefixIcon={<AddressOutlined />}
            id={ADDRESS_ID.INVITE_BTN}
            className={classNames({
              [styles.inviteBtnMobile]: isMobile,
              [styles.isSyncingMembers]: isSyncingMembers,
            })}
            onClick={() => expandInviteModal({ resUpdate: () => teamClick(ConfigConstant.ROOT_TEAM_ID) })}
          >
            {isSyncingMembers ? t(Strings.other_invitation_rule) : t(Strings.invite_member)}
          </Button>
        </>
      );
    }

    return <div className={styles.empty} />;
  }, [loading, isMobile, teamClick, inviteRes, syncTeamsAndMembersLinkId, dispatch, userInfo, isSyncingMembers, btnSize]);

  return (
    <div className={styles.leftContent}>
      <OrganizationHead />
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.searchItem}>
          {t(Strings.contacts)}
          <span
            onClick={e => {
              stopPropagation(e);
              setInSearch(true);
            }}
          >
            <SearchIcon />
          </span>
        </div>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        {
          <div className={styles.searchInputWrapper}>
            <Input
              className={styles.searchInput}
              prefix={<SearchIcon />}
              size="small"
              placeholder={t(Strings.search)}
              onClick={() => setInSearch(true)}
            />
          </div>
        }
      </ComponentDisplay>

      <div className={styles.listWrapper}>
        <div style={{ filter: inSearch ? ConfigConstant.GLASS_FILTER : 'none' }} className={styles.filter}>
          {OperateButton}
          <div className={styles.menu}>
            <AddressTreeMenu listData={teamList} onSelect={keys => teamClick(keys[0])} inSearch={inSearch} />
          </div>
        </div>
        {/* <ComponentDisplay minWidthCompatible={ScreenSize.md}> */}
        {inSearch && <SearchTeamAndMember setInSearch={search => setInSearch(search)} teamClick={teamClick} memberClick={memberClick} />}
        {/* </ComponentDisplay> */}
      </div>
    </div>
  );
};
