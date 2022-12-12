import { Button } from '@apitable/components';
import {
  ADDRESS_ID, Api, ConfigConstant, Events, IMember, IReduxState, isIdassPrivateDeployment, ITeam, Navigation, Player, StoreActions, Strings, t,
} from '@apitable/core';
import { AddOutlined, AddressOutlined } from '@apitable/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import { expandMemberInfo } from 'pc/components/address_list/expand_member_info';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { SearchTeamAndMember } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform';
import { expandInviteModal } from 'pc/components/invite';
import { OrganizationHead } from 'pc/components/organization_head';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useResponsive, useSideBarVisible, useUserRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import { AddressTreeMenu } from '../../address_list/address_tree_menu';
import styles from './style.module.less';

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

  const dispatch = useAppDispatch();
  const { getInviteStatus } = useUserRequest();
  const { data: inviteRes, loading } = useRequest(getInviteStatus);

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

  const memberClick = (memberId: string) => {
    Router.push(Navigation.MEMBER_DETAIL, { params: { spaceId, memberId }});
    isMobile && expandMemberInfo();
    teamClick(ConfigConstant.ROOT_TEAM_ID);
    dispatch(StoreActions.getMemberInfoData(memberId));
  };

  const { CUSTOM_SYNC_CONTACTS_LINKID = '' } = getEnvVariables();

  const isSyncingMembers = CUSTOM_SYNC_CONTACTS_LINKID && isAdmin;
  const btnSize = isSyncingMembers ? 'large' : 'middle';

  const OperateButton = React.useMemo(() => {
    if (isIdassPrivateDeployment()) {
      return;
    }

    if (inviteRes && !loading) {
      return (
        <>
          {isSyncingMembers && (
            <Button
              color='primary'
              prefixIcon={<AddOutlined />}
              id={ADDRESS_ID.INVITE_BTN}
              className={classNames({ [styles.inviteBtnMobile]: isMobile })}
              onClick={() => {
                expandUnitModal({
                  source: SelectUnitSource.SyncMember,
                  onSubmit: values => {
                    const data = values.reduce(
                      (prev: any, cur) => {
                        if ((cur as IMember).memberId) {
                          const { syncingTeamId, memberId, memberName } = cur as IMember & { syncingTeamId: string };
                          prev.members.push({ teamId: syncingTeamId, memberId, memberName });
                        } else if ((cur as ITeam).teamId) {
                          prev.teamIds.push((cur as ITeam).teamId);
                        }
                        return prev;
                      },
                      { members: [], linkId: CUSTOM_SYNC_CONTACTS_LINKID, teamIds: [] },
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
  }, [loading, isMobile, teamClick, inviteRes, CUSTOM_SYNC_CONTACTS_LINKID, dispatch, userInfo, isSyncingMembers, btnSize]);

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
              size='small'
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
