import { FC, useEffect, useRef, useState } from 'react';
import { useRequest } from 'pc/hooks';
import { useToggle } from 'ahooks';
import { Api, ConfigConstant, INodePermissionData, INodeRoleMap, IReduxState, IUnitValue, StoreActions, Strings, t } from '@vikadata/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Message } from 'pc/components/common/message/message';
import { useCatalogTreeRequest } from 'pc/hooks';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { MembersDetail } from './members_detail';
import { UnitList } from './unit_list';
import { permissionMenuData } from 'pc/utils';
import { Skeleton, IOption, Box } from '@vikadata/components';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';
import { PermissionInfoSetting } from './permission_info_setting';
import { DEFAULT_ROLE } from './unit_item';
import { dispatch } from 'pc/worker/store';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';

export interface IPermissionSettingProps {
  data: INodePermissionData;
}

type IRoleMap = INodeRoleMap & { belongRootFolder: boolean };

export const Permission: FC<IPermissionSettingProps> = ({ data }) => {
  // 当前操作模式
  const [isAppointMode, setIsAppointMode] = useState(true);
  // 是否显示查看成员详情模态框
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const ownUnitId = useSelector((state: IReduxState) => state.user.info?.unitId);
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { run: getNodeRoleMap, data: roleMap } = useRequest<IRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const nodeAssignable = treeNodesMap[data.nodeId]?.permissions.nodeAssignable;
  const unitListScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roleMap) {
      return;
    }
    setTimeout(() => {
      if (roleMap.extend) {
        TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_EXTEND);
        return;
      }
      TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.PERMISSION_SETTING_OPENED);
    }, 0);
  }, [roleMap]);

  useEffect(() => {
    if (roleMap && !isAppointMode !== roleMap.extend) {
      setIsAppointMode(!roleMap.extend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleMap]);

  /**
   * 关闭继承操作模式
   * 如果当前未开启权限设置，那么需要在以下操作进行之前去手动调用开启
   * 1. 新增角色
   * 2. 编辑角色
   * 3. 删除角色
   * 4. 批量更新角色
   * @returns 
   */
  const disableRoleExtend = async() => {
    if (!roleMap?.extend) {
      return true;
    }
    const res = await Api.disableRoleExtend(data.nodeId, true);
    const { success, message } = res.data;
    if (!success) {
      Message.error({ content: message });
      return false;
    }
    setIsAppointMode(true);
    dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: true }));
    return success;
  };

  // 选择成员的提交事件
  const onSubmit = async(unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
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
        await getNodeRoleMap();
        scrollBottom();
      } else {
        Message.error({ content: message });
      }
    });
  };

  const deleteUnit = (unitId: string) => {
    const isOwn = ownUnitId === unitId;
    const onOk = async() => {
      const res = await disableRoleExtend();
      if (!res) {
        return;
      }
      Api.deleteRole(data.nodeId, unitId).then(res => {
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

  const changeUnitRole = async(unitId: string, role: string) => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    Api.editRole(data.nodeId, unitId, role).then(res => {
      const { success } = res.data;
      if (success) {
        getNodeRoleMap();
        Message.success({ content: t(Strings.permission_switch_succeed) });
      } else {
        Message.error({ content: t(Strings.permission_switch_failed) });
      }
    });
  };

  const batchChangeUnitRole = async(role: string) => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    const unitIds = (roleMap?.roleUnits || []).map(v => v.unitId);
    if (!unitIds.length) {
      return;
    }
    Api.batchEditRole(data.nodeId, unitIds, role).then(res => {
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
    Api.enableRoleExtend(data.nodeId).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_switch_succeed) });
        setIsAppointMode(false);
        dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: false }));
        getNodeRoleMap();
        return;
      }

      Message.success({ content: t(Strings.permission_switch_failed) });
    });
  };

  const batchDeleteRole = async() => {
    const res = await disableRoleExtend();
    if (!res) {
      return;
    }
    const unitIds = (roleMap?.roleUnits || []).map(v => v.unitId);
    if (!unitIds.length) {
      return;
    }
    Api.batchDeleteRole(data.nodeId, unitIds).then(res => {
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
        <Skeleton count={2} height={'48px'}/>
      </Box>
    );
  }

  const scrollBottom = () => {
    if (unitListScroll.current) {
      unitListScroll.current.scrollTop = unitListScroll.current.scrollHeight;
    }
  };

  const adminAndOwnerUnitIds = [...roleMap.admins.map(v => v.unitId), roleMap.owner?.unitId || ''];

  const isRootNode = roleMap.belongRootFolder;
  const optionData = permissionMenuData(data.type);
  return (
    <div className={styles.permission}>
      <div className={styles.permissionHeader}>
        {nodeAssignable &&
          <div className={styles.mainWrapper}>
            <UnitPermissionSelect
              classNames={styles.permissionSelect}
              permissionList={optionData}
              onSubmit={onSubmit}
              adminAndOwnerUnitIds={adminAndOwnerUnitIds}
            />
          </div>
        }
        <PermissionInfoSetting
          members={roleMap.members}
          isExtend={!isAppointMode}
          resetPermission={resetPermission}
          toggleIsMemberDetail={toggleIsMemberDetail}
          defaultRole={DEFAULT_ROLE}
          batchEditRole={batchChangeUnitRole}
          batchDeleteRole={batchDeleteRole}
          readonly={!nodeAssignable}
          tipOptions={{
            extendTips: isRootNode ? t(Strings.inherit_permission_tip_root) : t(Strings.inherit_permission_tip),
            resetPopConfirmTitle: isRootNode ? t(Strings.close_permission) : t(Strings.reset_permission),
            resetPopConfirmContent:  isRootNode ? t(Strings.close_permission_warning_content) : t(Strings.reset_permission_content),
            resetPermissionDesc: isRootNode ? t(Strings.reset_permission_desc_root) : t(Strings.reset_permission_desc)
          }}
        />
      </div>
      <div className={styles.scrollContainer} ref={unitListScroll}>
        <UnitList
          owner={roleMap.owner}
          admins={roleMap.admins}
          roleUnits={roleMap.roleUnits}
          onDelete={deleteUnit}
          onChange={changeUnitRole}
          isAppointMode={isAppointMode}
          readonly={!nodeAssignable}
        />
      </div>
      {
        isMemberDetail &&
        (
          <MembersDetail
            data={roleMap}
            onCancel={toggleIsMemberDetail}
          />
        )
      }
    </div>
  );
};
