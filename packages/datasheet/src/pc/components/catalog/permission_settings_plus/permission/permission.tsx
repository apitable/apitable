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

import { useToggle } from 'ahooks';
import { FC, useEffect, useRef, useState } from 'react';
import { Box, IOption, Skeleton } from '@apitable/components';
import {
  Api,
  ConfigConstant,
  INodePermissionData,
  INodeRoleMap,
  IReduxState,
  IUnitValue,
  StoreActions,
  Strings,
  t,
  IRoleMember,
} from '@apitable/core';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { permissionMenuData } from 'pc/utils';
import { dispatch } from 'pc/worker/store';
import { MembersDetail } from './members_detail';
import { PermissionInfoSetting } from './permission_info_setting';
import { UnitList } from './unit_list';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
import styles from './style.module.less';

export interface IPermissionSettingProps {
  data: INodePermissionData;
}

export type IMemberList = IRoleMember & {
  isWorkbenchAdmin: boolean;
  isControlOwner: boolean;
};

type IRoleMap = INodeRoleMap & { belongRootFolder: boolean };

export const Permission: FC<React.PropsWithChildren<IPermissionSettingProps>> = ({ data }) => {
  // Current operating mode
  const [isAppointMode, setIsAppointMode] = useState(true);
  // Whether to display the View Member Details modal box
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const ownUnitId = useAppSelector((state: IReduxState) => state.user.info?.unitId);
  const { getNodeRoleListReq, getCollaboratorListPageReq } = useCatalogTreeRequest();
  const { run: getNodeRoleMap, data: roleMap } = useRequest<IRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const treeNodesMap = useAppSelector((state) => state.catalogTree.treeNodesMap);
  const nodeAssignable = treeNodesMap[data.nodeId]?.permissions.nodeAssignable;
  const unitListScroll = useRef<HTMLDivElement>(null);
  const spaceId = useAppSelector((state) => state.space.activeId)!;
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const [pageNo, setPageNo] = useState<number>(1);
  const [memberList, setMemberList] = useState<IMemberList[]>([]);
  const { run: getCollaboratorReq, data: collaboratorInfo } = useRequest((pageNo) => getCollaboratorListPageReq(pageNo, data.nodeId), {
    manual: true,
  });

  useEffect(() => {
    if (!roleMap) {
      return;
    }
    setTimeout(() => {
      if (roleMap.extend) {
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_EXTEND);
        return;
      }
      TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_OPENED);
    }, 0);
  }, [roleMap]);

  useEffect(() => {
    if (roleMap && !isAppointMode !== roleMap.extend) {
      setIsAppointMode(!roleMap.extend);
    }
    // eslint-disable-next-line
  }, [roleMap]);

  useEffect(() => {
    getCollaboratorReq(pageNo);
  }, [pageNo, getCollaboratorReq]);

  useEffect(() => {
    if (collaboratorInfo) {
      setMemberList([...memberList, ...collaboratorInfo.records]);
    }
    // eslint-disable-next-line
  }, [collaboratorInfo, setMemberList]);

  /**
   * Turn off inheritance mode of operation
   * If the permission settings are not currently enabled, you will need to manually invoke them before the following actions can be performed
   * 1. Add Roles
   * 2. Editorial roles
   * 3. Delete Role
   * 4. Batch update roles
   * @returns
   */
  const disableRoleExtend = async () => {
    if (!roleMap?.extend) {
      return true;
    }

    const result = triggerUsageAlert('nodePermissionNums', { usage: spaceInfo!.nodeRoleNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
    if (result) {
      return false;
    }
    const res = await Api.disableRoleExtend(data.nodeId, true);
    const { success, message } = res.data;
    if (!success) {
      Message.error({ content: message });
      return false;
    }
    setIsAppointMode(true);
    dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: true }));
    dispatch(StoreActions.getSpaceInfo(spaceId, true));
    return success;
  };

  // Select member submission events
  const onSubmit = async (unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
      return;
    }

    const unitIds = unitInfos.map((item) => item.unitId);
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    Api.addRole(data.nodeId, unitIds, permission.value + '').then(async (res) => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_add_success) });
        await getNodeRoleMap();
        scrollBottom();
      } else {
        Message.error({ content: message });
      }
    });
  };

  const deleteUnit = (unitId: string) => {
    const isOwn = ownUnitId === unitId;
    const onOk = async () => {
      const res = await disableRoleExtend();
      if (!res) {
        return;
      }
      Api.deleteRole(data.nodeId, unitId).then((res) => {
        const { success } = res.data;
        if (success) {
          Message.success({ content: t(Strings.permission_delete_success) });
          getNodeRoleMap();
          return;
        }
        Message.error({ content: t(Strings.permission_delete_failed) });
      });
    };

    Modal.confirm({
      title: t(Strings.remove_permissions),
      content: isOwn ? t(Strings.remove_own_permissions_desc) : t(Strings.remove_permissions_desc),
      onOk,
    });
  };

  const changeUnitRole = async (unitId: string, role: string) => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    Api.editRole(data.nodeId, unitId, role).then((res) => {
      const { success } = res.data;
      if (success) {
        getNodeRoleMap();
        Message.success({ content: t(Strings.permission_switch_succeed) });
      } else {
        Message.error({ content: t(Strings.permission_switch_failed) });
      }
    });
  };

  const batchChangeUnitRole = async (role: string) => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    const unitIds = (roleMap?.roleUnits || []).map((v) => v.unitId);
    if (!unitIds.length) {
      return;
    }
    Api.batchEditRole(data.nodeId, unitIds, role).then((res) => {
      const { success } = res.data;
      if (success) {
        getNodeRoleMap();
        Message.success({ content: t(Strings.permission_switch_succeed) });
      } else {
        Message.error({ content: t(Strings.permission_switch_failed) });
      }
    });
  };

  const resetPermission = () => {
    Api.enableRoleExtend(data.nodeId).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_switch_succeed) });
        setIsAppointMode(false);
        dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: false }));
        dispatch(StoreActions.getSpaceInfo(spaceId, true));
        getNodeRoleMap();
        return;
      }

      Message.success({ content: t(Strings.permission_switch_failed) });
    });
  };

  const batchDeleteRole = async () => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    const unitIds = (roleMap?.roleUnits || []).map((v) => v.unitId);
    if (!unitIds.length) {
      return;
    }
    Api.batchDeleteRole(data.nodeId, unitIds).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_delete_success) });
        getNodeRoleMap();
        return;
      }
      Message.error({ content: t(Strings.permission_delete_failed) });
    });
  };

  if (!roleMap) {
    return (
      <Box padding={'0 16px 24px'}>
        <Skeleton style={{ marginTop: 0 }} height={'16px'} />
        <Skeleton count={2} height={'48px'} />
      </Box>
    );
  }

  const scrollBottom = () => {
    if (unitListScroll.current) {
      unitListScroll.current.scrollTop = unitListScroll.current.scrollHeight;
    }
  };

  const adminAndOwnerUnitIds = [...roleMap.admins.map((v) => v.unitId), roleMap.owner?.unitId || ''];

  const isRootNode = roleMap.belongRootFolder;
  const optionData = permissionMenuData(data.type);
  return (
    <div className={styles.permission}>
      <div className={styles.permissionHeader}>
        {nodeAssignable && (
          <div className={styles.mainWrapper}>
            <UnitPermissionSelect
              classNames={styles.permissionSelect}
              permissionList={optionData}
              onSubmit={onSubmit}
              adminAndOwnerUnitIds={adminAndOwnerUnitIds}
            />
          </div>
        )}
        {collaboratorInfo && (
          <PermissionInfoSetting
            totalMember={collaboratorInfo.total}
            isExtend={!isAppointMode}
            resetPermission={resetPermission}
            toggleIsMemberDetail={toggleIsMemberDetail}
            defaultRole={optionData}
            batchEditRole={batchChangeUnitRole}
            batchDeleteRole={batchDeleteRole}
            readonly={!nodeAssignable}
            tipOptions={{
              extendTips: isRootNode ? t(Strings.inherit_permission_tip_root) : t(Strings.inherit_permission_tip),
              resetPopConfirmTitle: isRootNode ? t(Strings.close_permission) : t(Strings.reset_permission),
              resetPopConfirmContent: isRootNode ? t(Strings.close_permission_warning_content) : t(Strings.reset_permission_content),
              resetPermissionDesc: isRootNode ? t(Strings.reset_permission_desc_root) : t(Strings.reset_permission_desc),
            }}
          />
        )}
      </div>
      <div className={styles.scrollContainer} ref={unitListScroll}>
        <UnitList
          owner={roleMap.owner}
          admins={roleMap.admins}
          roleUnits={roleMap.roleUnits}
          onDelete={deleteUnit}
          onChange={changeUnitRole}
          roleOptions={optionData}
          isAppointMode={isAppointMode || isRootNode}
          readonly={!nodeAssignable}
        />
      </div>
      {isMemberDetail && (
        <MembersDetail data={collaboratorInfo} memberList={memberList} setPageNo={setPageNo} onCancel={toggleIsMemberDetail} pageNo={pageNo} />
      )}
    </div>
  );
};
