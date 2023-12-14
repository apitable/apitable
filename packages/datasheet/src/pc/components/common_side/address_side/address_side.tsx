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

import { Input } from 'antd';
import classNames from 'classnames';
import { usePostHog } from 'posthog-js/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Button } from '@apitable/components';
import {
  ADDRESS_ID,
  Api,
  ConfigConstant,
  Events,
  IReduxState,
  isIdassPrivateDeployment,
  Navigation,
  Player,
  StoreActions,
  Strings,
  t,
  TrackEvents,
} from '@apitable/core';
import { AddOutlined, SearchOutlined, UserAddOutlined } from '@apitable/icons';
import { expandMemberInfo } from 'pc/components/address_list/expand_member_info';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { SearchTeamAndMember } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { SpaceInfo } from 'pc/components/common_side/workbench_side/space-info';
import { expandInviteModal } from 'pc/components/invite';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useResponsive, useSideBarVisible, useUserRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { AddressTreeMenu } from '../../address_list/address_tree_menu';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise/home/social_platform/utils';
// @ts-ignore
import { syncOrgMember } from 'enterprise/organization/utils/index';
import styles from './style.module.less';

export const AddressSide: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { teamList, spaceId, userInfo } = useAppSelector(
    (state: IReduxState) => ({
      teamList: state.addressList.teamList,
      spaceId: state.space.activeId,
      userInfo: state.user.info,
    }),
    shallowEqual,
  );
  const posthog = usePostHog();

  const { isAdmin } = userInfo!;

  const dispatch = useAppDispatch();
  const { getInviteStatus } = useUserRequest();
  const { data: inviteRes, loading } = useRequest(getInviteStatus);

  const [inSearch, setInSearch] = useState<boolean>(false);

  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  useEffect(() => {
    if (spaceInfo && !isSocialPlatformEnabled?.(spaceInfo)) {
      Player.doTrigger(Events.address_shown);
    }
  }, [spaceInfo]);

  const { setSideBarVisible } = useSideBarVisible();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const teamClick = React.useCallback(
    (teamId: string) => {
      Api.readTeam(teamId).then((res) => {
        const { success, data } = res.data;
        if (success) {
          dispatch(
            StoreActions.updateSelectedTeamInfo({
              teamTitle: data.teamName,
              memberCount: data.memberCount,
              teamId: data.teamId,
            }),
          );
          dispatch(StoreActions.updateMemberListPageNo(1));
        }
      });
      isMobile && setSideBarVisible(false);
      dispatch(StoreActions.updateMemberInfo({ memberId: '', email: '' }));
      dispatch(StoreActions.updateMemberListPageNo(1));
    },
    [isMobile, setSideBarVisible, dispatch],
  );

  const memberClick = (memberId: string) => {
    Router.push(Navigation.MEMBER_DETAIL, { params: { spaceId, memberId } });
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
              color="primary"
              prefixIcon={<AddOutlined />}
              id={ADDRESS_ID.INVITE_BTN}
              className={classNames({ [styles.inviteBtnMobile!]: isMobile })}
              onClick={() => {
                expandUnitModal({
                  source: SelectUnitSource.SyncMember,
                  onSubmit: (values) => {
                    syncOrgMember?.({
                      values,
                      linkId: CUSTOM_SYNC_CONTACTS_LINKID,
                      userInfo,
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
            prefixIcon={<UserAddOutlined />}
            id={ADDRESS_ID.INVITE_BTN}
            className={classNames({
              [styles.inviteBtnMobile!]: isMobile,
              [styles.isSyncingMembers!]: isSyncingMembers,
            })}
            onClick={() => {
              posthog?.capture(TrackEvents.InviteByContacts);
              expandInviteModal({ resUpdate: () => teamClick(ConfigConstant.ROOT_TEAM_ID) });
            }}
          >
            {isSyncingMembers ? t(Strings.other_invitation_rule) : t(Strings.invite_member)}
          </Button>
        </>
      );
    }

    return <div />;
    // eslint-disable-next-line
  }, [loading, isMobile, teamClick, inviteRes, CUSTOM_SYNC_CONTACTS_LINKID, userInfo, isSyncingMembers, btnSize]);

  return (
    <div className={styles.leftContent}>
      <div className={styles.header}>
        <SpaceInfo />
      </div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.searchItem}>
          {t(Strings.contacts)}
          <span
            onClick={(e) => {
              stopPropagation(e);
              setInSearch(true);
            }}
          >
            <SearchOutlined />
          </span>
        </div>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        {
          <div className={styles.searchInputWrapper}>
            <Input
              className={styles.searchInput}
              prefix={<SearchOutlined />}
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
            <AddressTreeMenu listData={teamList} onSelect={(keys) => teamClick(keys[0]!)} inSearch={inSearch} />
          </div>
        </div>
        {/* <ComponentDisplay minWidthCompatible={ScreenSize.md}> */}
        {inSearch && <SearchTeamAndMember setInSearch={(search) => setInSearch(search)} teamClick={teamClick} memberClick={memberClick} />}
        {/* </ComponentDisplay> */}
      </div>
    </div>
  );
};
