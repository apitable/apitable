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

import { IOption, Typography, LinkButton } from '@apitable/components';
import cls from 'classnames';
import { shallowEqual } from 'react-redux';
import styles from './style.module.less';
import { Api, INodeRoleMap, IReduxState, IUnitValue, StoreActions, Strings, t } from '@apitable/core';
import { Avatar, AvatarSize, Message, Tooltip } from '../../common';
import { getEnvVariables } from '../../../utils/env';
import { ChevronRightOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { UnitPermissionSelect } from '../../field_permission/unit_permission_select';
import { useCatalogTreeRequest, useRequest } from '../../../hooks';
import { copy2clipBoard, permissionMenuData } from '../../../utils';
import { expandInviteModal } from '../../invite';
// @ts-ignore
import { isSocialPlatformEnabled, SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IMemberList } from '../permission_settings_plus/permission';
import { IShareContentProps } from './interface';
import { LinkOutlined } from '@apitable/icons';

interface IPermissionAndCollaboratorProps extends IShareContentProps {
  setDetailModalVisible: Dispatch<SetStateAction<boolean>>
  roleList: INodeRoleMap | undefined;
  pageNo: number;
  getNodeRoleList: (...params: any[]) => Promise<INodeRoleMap>
}

export const PermissionAndCollaborator: React.FC<IPermissionAndCollaboratorProps> = ({
  data,
  setDetailModalVisible,
  pageNo,
  roleList,
  getNodeRoleList
}) => {
  const dispatch = useDispatch();
  const [memberList, setMemberList] = useState<IMemberList[]>([]);
  const { spaceFeatures } = useSelector((state: IReduxState) => ({
    spaceFeatures: state.space.spaceFeatures,
    spaceInfo: state.space.curSpaceInfo!,
  }), shallowEqual);

  const { getCollaboratorListPageReq } = useCatalogTreeRequest();
  const {
    run: getCollaboratorReq,
    data: collaboratorInfo
  } = useRequest((pageNo) => getCollaboratorListPageReq(pageNo, data.nodeId), {
    manual: true
  });
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  useEffect(() => {
    getCollaboratorReq(pageNo);
  }, [pageNo, getCollaboratorReq]);

  useEffect(() => {
    if (collaboratorInfo) {
      setMemberList([...memberList, ...collaboratorInfo.records]);
    }
    // eslint-disable-next-line
  }, [collaboratorInfo, setMemberList]);

  const adminAndOwnerUnitIds = roleList ? [
    ...roleList.admins.map(v => v.unitId),
    ...roleList.roleUnits.filter(v => v.role === 'manager').map(v => v.unitId),
    roleList.owner?.unitId || '',
  ] : [];

  // Select member submission events
  const onSubmit = async(unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
      return;
    }

    const result = triggerUsageAlert(
      'nodePermissionNums',
      { usage: spaceInfo!.nodeRoleNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert,
    );
    if (result) {
      return;
    }

    const unitIds = unitInfos.map(item => item.unitId);

    const res = await disableRoleExtend();
    if (!res) {
      return;
    }

    Api.addRole(data.nodeId, unitIds, permission.value + '').then(async(res) => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_add_success) });
        await getNodeRoleList();
      } else {
        Message.error({ content: message });
      }
    });
  };

  const disableRoleExtend = async() => {
    if (!roleList?.extend) {
      return true;
    }
    const res = await Api.disableRoleExtend(data.nodeId, true);
    const { success, message } = res.data;
    if (!success) {
      Message.error({ content: message });
      return false;
    }
    dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: true }));
    return success;
  };

  const optionData = permissionMenuData(data.type);

  const invitable = spaceFeatures?.invitable && !isSocialPlatformEnabled?.(spaceInfo);

  return <div className={styles.invite}>
    <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
      <span>{t(Strings.collaborate_and_share)}</span>
      <Tooltip title={t(Strings.support)} trigger={'hover'}>
        <a href={getEnvVariables().WORKBENCH_NODE_SHARE_HELP_URL} rel='noopener noreferrer' target='_blank'>
          <QuestionCircleOutlined currentColor/>
        </a>
      </Tooltip>
    </Typography>
    {
      getEnvVariables().FILE_PERMISSION_VISIBLE && <div className={styles.shareInvite}>
        <UnitPermissionSelect
          classNames={styles.permissionSelect}
          permissionList={optionData}
          onSubmit={onSubmit}
          adminAndOwnerUnitIds={adminAndOwnerUnitIds}
          showTeams
          searchEmail
        />
      </div>
    }
    <div className={cls(styles.shareFloor, styles.collaborator)}>
      <div className={styles.collaboratorStatus} onClick={() => setDetailModalVisible(true)}>
        {roleList && (
          <div className={styles.collaboratorIcon}>
            {
              memberList.slice(0, 5).map((v, i) => (
                <div key={v.memberId} className={styles.collaboratorIconItem}
                  style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 5 - i }}>
                  <Tooltip title={v.memberName}>
                    <div>
                      <Avatar
                        src={v.avatar}
                        title={v.nickName || v.memberName}
                        avatarColor={v.avatarColor}
                        id={v.memberId}
                        size={AvatarSize.Size24}
                      />
                    </div>
                  </Tooltip>
                </div>
              ))
            }
          </div>
        )}
        <Typography variant='body3' className={styles.collaboratorNumber}>
          {t(Strings.collaborator_number, { number: collaboratorInfo?.total })}
        </Typography>
      </div>
      {
        getEnvVariables().FILE_PERMISSION_VISIBLE && <Typography
          variant='body3'
          className={styles.collaboratorAuth}
          onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(data.nodeId))}
        >
          <span>{t(Strings.setting_permission)}</span>
          <ChevronRightOutlined/>
        </Typography>
      }
    </div>
    <div className={styles.inviteMore}>
      <LinkButton
        className={styles.inviteMoreMethod}
        underline={false}
        onClick={() => copy2clipBoard(window.location.href)}
        prefixIcon={<LinkOutlined currentColor/>}
      >
        {t(Strings.share_copy_url_link)}
      </LinkButton>
      {invitable && (

        <LinkButton
          className={styles.inviteMoreMethod}
          underline={false}
          onClick={() => expandInviteModal()}
        >
          {t(Strings.more_invite_ways)}
        </LinkButton>
      )}
    </div>

  </div>;
};
