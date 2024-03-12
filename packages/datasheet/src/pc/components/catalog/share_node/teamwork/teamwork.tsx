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

import { useMount } from 'ahooks';
import classnames from 'classnames';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Button, TextInput } from '@apitable/components';
import { ConfigConstant, INodeRoleMap, IReduxState, StoreActions, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, EyeOpenOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useCatalogTreeRequest, useResponsive, useSpaceRequest, useUserRequest, useRequest } from 'pc/hooks';
import { NodeChangeInfoType } from 'pc/hooks/use_catalog';
import { useInviteRequest } from 'pc/hooks/use_invite_request';
import { useAppSelector } from 'pc/store/react-redux';
import { execNoTraceVerification, initNoTraceVerification } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { MembersDetail } from '../../permission_settings/permission/members_detail';
import { UnitItem } from '../../permission_settings/permission/unit_item';
import { TeamTreeSelect } from '../team_tree_select';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export interface ITeamworkProps {
  nodeId: string;
  jumpPublicLink: () => void;
}

export const Teamwork: FC<React.PropsWithChildren<ITeamworkProps>> = ({ nodeId, jumpPublicLink }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [joinTeamId, setJoinTeamId] = useState('');
  const treeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const socketData = useAppSelector((state: IReduxState) => state.catalogTree.socketData);
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { sendInviteReq } = useInviteRequest();
  const { getInviteStatus } = useUserRequest();
  const { checkEmailReq } = useSpaceRequest();
  const { data: inviteStatus, loading } = useRequest(getInviteStatus);
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(nodeId));
  const { run: sendInvite } = useRequest(sendInviteReq, { manual: true });
  const { run: checkEmail } = useRequest(checkEmailReq, { manual: true });
  const nodeAssignable = treeNodesMap[nodeId].permissions.nodeAssignable;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useDispatch();
  const [secondVerify, setSecondVerify] = useState<null | string>(null);
  const spaceInfo = useAppSelector((state: IReduxState) => state.space.curSpaceInfo)!;
  const spaceId = useAppSelector((state) => state.space.activeId)!;

  useMount(() => {
    initNoTraceVerification(setSecondVerify, ConfigConstant.CaptchaIds.LOGIN);
  });

  useEffect(() => {
    secondVerify && inviteEmail && sendInviteEmail(secondVerify);
    // eslint-disable-next-line
  }, [secondVerify]);

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
    // eslint-disable-next-line
  }, [socketData]);

  const inviteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInviteEmail(value);
  };

  const sendInviteEmail = async (nvcVal?: string) => {
    if (secondVerify) {
      setSecondVerify(null);
    }
    const success = await sendInvite(spaceId, [{ email: inviteEmail, teamId: joinTeamId }], nvcVal);
    if (success) {
      Message.success({ content: t(Strings.invite_success) });
    }
  };

  const sendInviteHandler = async () => {
    const isExist = await checkEmail(inviteEmail);
    if (isExist) {
      Message.error({ content: t(Strings.invite_email_already_exist) });
      return;
    }

    window['nvc'] ? execNoTraceVerification(sendInviteEmail) : sendInviteEmail();
  };

  if (!roleList || loading) {
    return <></>;
  }

  return (
    <div className={classnames(styles.teamwork, isMobile && styles.mobileTeamwork)}>
      <div className={styles.descContainer}>
        <div className={styles.desc}>
          {t(Strings.teamwork_number_tip, { number: roleList.members.length })}
          <span className={styles.viewDetails} onClick={() => setDetailModalVisible(true)}>
            {t(Strings.check_detail)}
          </span>
        </div>
        {nodeAssignable && getEnvVariables().FILE_PERMISSION_VISIBLE ? (
          <div className={styles.permissionSettingBtn} onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(nodeId))}>
            {t(Strings.permission_setting)}
            <ChevronRightOutlined />
          </div>
        ) : (
          <Tooltip title={t(Strings.no_permission_setting)}>
            <div className={classnames(styles.permissionSettingBtn, !nodeAssignable && styles.disable)}>
              {t(Strings.permission_setting)}
              <ChevronRightOutlined />
            </div>
          </Tooltip>
        )}
      </div>

      <div className={styles.memberList}>
        <AutoSizer style={{ width: '100%', height: '100%' }}>
          {({ height, width }) => {
            return (
              <List
                height={height}
                width={width}
                itemCount={roleList.members.length}
                itemSize={56}
                itemKey={(index: number) => roleList.members[index].memberId}
                itemData={{
                  roleList: roleList,
                }}
              >
                {Row}
              </List>
            );
          }}
        </AutoSizer>
      </div>
      {inviteStatus && !isSocialPlatformEnabled?.(spaceInfo) && (
        <div className={styles.inviteContainer}>
          <div className={styles.label}>{t(Strings.share_email_invite)}</div>
          <div className={styles.invite}>
            <div className={styles.inputContainer}>
              <TextInput value={inviteEmail} placeholder={t(Strings.placeholder_input_member_email)} onChange={inviteEmailChange} block />
              <TeamTreeSelect className={styles.teamTreeSelect} onChange={(checkedTeamId) => setJoinTeamId(checkedTeamId)} />
            </div>
            <Button
              color="primary"
              onClick={sendInviteHandler}
              size={isMobile ? 'large' : 'middle'}
              disabled={!inviteEmail || !joinTeamId}
              block={isMobile}
            >
              {t(Strings.invite_outsider_send_invitation)}
            </Button>
          </div>
        </div>
      )}
      <div className={styles.jumpBtn} onClick={jumpPublicLink}>
        <EyeOpenOutlined />
        {t(Strings.teamwork_click_here)}
      </div>
      {detailModalVisible && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
    </div>
  );
};

const Row = (props: any) => {
  const { index, data, style } = props;
  const { roleList } = data;
  const { members, admins, owner } = roleList;
  const member = members[index];
  return (
    <div style={style} key={member.memberId}>
      <UnitItem
        key={member.memberId}
        unit={{
          id: member.memberId,
          avatar: member.avatar,
          name: member.memberName,
          info: member.teams,
          isTeam: false,
        }}
        identity={{
          admin: Boolean(admins.find((item: any) => item.memberId === member.memberId)),
          permissionOpener: owner?.memberId === member.memberId,
        }}
        disabled
        role={member.role}
      />
    </div>
  );
};
