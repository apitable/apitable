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

import { IOption, Skeleton, Typography } from '@apitable/components';
import { Api, ConfigConstant, INodeRoleMap, IUnitValue, StoreActions, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, InformationSmallOutlined } from '@apitable/icons';
import cls from 'classnames';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';
import { Avatar, Message } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { Tooltip } from 'pc/components/common/tooltip';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { permissionMenuData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MembersDetail } from '../permission_settings/permission/members_detail';
import { PublicShareInviteLink } from './public_link';
import styles from './style.module.less';

export interface IShareContentProps {
  /** Information about the node being operated on */
  data: {
    nodeId: string,
    type: ConfigConstant.NodeType,
    icon: string,
    name: string,
  };
}

export const ShareContent: FC<IShareContentProps> = ({ data }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const socketData = useSelector(state => state.catalogTree.socketData);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { run: getNodeRoleList, data: roleList, loading } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  // const { run: checkEmail } = useRequest(checkEmailReq, { manual: true });

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData, getNodeRoleList]);

  if (loading) {
    return (
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Skeleton count={1} width='38%' height='24px' />
        <Skeleton count={2} style={{ marginTop: '16px' }} height='24px' />
        <Skeleton count={1} style={{ marginTop: '40px' }} width='38%' height='24px' />
        <Skeleton count={1} style={{ marginTop: '16px' }} height='24px' />
      </div>
    );
  }

  const optionData = permissionMenuData(data.type);

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

  // Select member submission events
  const onSubmit = async(unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
      return;
    }

    const result = triggerUsageAlert?.(
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

  const adminAndOwnerUnitIds = roleList ? [
    ...roleList.admins.map(v => v.unitId),
    ...roleList.roleUnits.filter(v => v.role === 'manager').map(v => v.unitId),
    roleList.owner?.unitId || '',
  ] : [];

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
          <span>{t(Strings.collaborate_and_share)}</span>
          <Tooltip title={t(Strings.support)} trigger={'hover'}>
            <a href={getEnvVariables().WORKBENCH_NODE_SHARE_HELP_URL} rel='noopener noreferrer' target='_blank'>
              <InformationSmallOutlined currentColor />
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
                  roleList.members.slice(0, 5).map((v, i) => (
                    <div key={v.memberId} className={styles.collaboratorIconItem} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 5 - i }}>
                      <Tooltip title={v.memberName}>
                        <div>
                          <Avatar 
                            src={v.avatar} 
                            title={v.nickName || v.memberName} 
                            avatarColor={v.avatarColor}
                            id={v.memberId} 
                          />
                        </div>
                      </Tooltip>
                    </div>
                  ))
                }
              </div>
            )}
            <Typography variant='body3' className={styles.collaboratorNumber}>
              {t(Strings.collaborator_number, { number: roleList?.members.length })}
            </Typography>
          </div>
          {
            getEnvVariables().FILE_PERMISSION_VISIBLE && <Typography
              variant='body3'
              className={styles.collaboratorAuth}
              onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(data.nodeId))}
            >
              <span>{t(Strings.setting_permission)}</span>
              <ChevronRightOutlined />
            </Typography>
          }
        </div>
        <PublicShareInviteLink
          nodeId={data.nodeId}
          isMobile={isMobile}
        />
      </div>
      {detailModalVisible && roleList && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
    </>
  );
};
