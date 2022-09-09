import { FC, useEffect, useState } from 'react';
import { useRequest } from 'pc/hooks';
import { useToggle } from 'ahooks';
import { Api, INodePermissionData, INodeRoleMap, IReduxState, IUnitValue, StoreActions, Strings, t } from '@vikadata/core';
import { Popconfirm } from 'pc/components/common/popconfirm';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import styles from './style.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { MembersDetail } from './members_detail';
import { UnitList } from './unit_list';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { permissionMenuData } from 'pc/utils';
import { ChevronRightOutlined } from '@vikadata/icons';
import { Skeleton, IOption, Switch, Typography, useThemeColors } from '@vikadata/components';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';

export interface IPermissionSettingProps {
  data: INodePermissionData;
}

export const Permission: FC<IPermissionSettingProps> = ({ data }) => {
  const colors = useThemeColors();
  // 当前操作模式
  const [isAppointMode, setIsAppointMode] = useState(true);
  // 切换权限的气泡卡片
  const [visible, setVisible] = useState(false);
  // 是否显示查看成员详情模态框
  const [isMemberDetail, { toggle: toggleIsMemberDetail }] = useToggle(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useDispatch();
  const ownUnitId = useSelector((state: IReduxState) => state.user.info?.unitId);
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const nodeAssignable = treeNodesMap[data.nodeId]?.permissions.nodeAssignable;

  useEffect(() => {
    if (roleList && !isAppointMode !== roleList.extend) {
      setIsAppointMode(!roleList.extend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleList]);

  // 选择成员的提交事件
  const onSubmit = (unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
      return;
    }

    const unitIds = unitInfos.map(item => item.unitId);
    Api.addRole(data.nodeId, unitIds, permission.value + '').then(res => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_add_success) });
        getNodeRoleList();
      } else {
        Message.error({ content: message });
      }
    });
  };

  // 开启继承操作模式
  const enableRoleExtend = () => {
    Api.enableRoleExtend(data.nodeId).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_switch_succeed) });
        setIsAppointMode(false);
        dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: false }));
        getNodeRoleList();
        return;
      }

      Message.success({ content: t(Strings.permission_switch_failed) });
    });
    cancelPopoverHandler();
  };

  // 关闭继承操作模式（也就是打开指定模式）
  const disableRoleExtend = () => {
    Api.disableRoleExtend(data.nodeId).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_switch_succeed) });
        setIsAppointMode(true);
        dispatch(StoreActions.updateTreeNodesMap(data.nodeId, { nodePermitSet: true }));
        getNodeRoleList();
        return;
      }

      Message.error({ content: t(Strings.permission_switch_failed) });
    });
    cancelPopoverHandler();
  };

  const onVisibleChange = (visible: boolean, value: boolean) => {
    setVisible(visible);
  };

  const deleteUnit = (unitId: string) => {
    const isOwn = ownUnitId === unitId;
    const onOk = () => {
      Api.deleteRole(data.nodeId, unitId).then(res => {
        const { success } = res.data;
        if (success) {
          Message.success({ content: t(Strings.permission_delete_success) });
          getNodeRoleList();
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

  const cancelPopoverHandler = () => {
    setVisible(false);
  };

  const changeUnitRole = (unitId: string, role: string) => {
    Api.editRole(data.nodeId, unitId, role).then(res => {
      const { success } = res.data;
      if (success) {
        getNodeRoleList();
        Message.success({ content: t(Strings.permission_switch_succeed) });
      } else {
        Message.error({ content: t(Strings.permission_switch_failed) });
      }
    });
  };

  // 切换权限模式
  const toggleMode = () => {
    if (isAppointMode) {
      enableRoleExtend();
    } else {
      disableRoleExtend();
    }
  };

  const handleSwitchClick = () => {
    if (isMobile) {
      Modal.confirm({
        title: isAppointMode ? t(Strings.permission_switch_to_superior) : t(Strings.permission_switch_specified),
        content: isAppointMode ? t(Strings.permission_switched_inherit_superior) : t(Strings.permission_switched_reallocate),
        onOk: toggleMode,
      });
      return;
    }
    setVisible(true);
  };

  if (!roleList) {
    return (
      <>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />
      </>
    );
  }

  const optionData = permissionMenuData(data.type);
  return (
    <div className={styles.permission}>
      {/* <div className={styles.mainContainer}> */}
      {nodeAssignable && (
        <div className={styles.mainWrapper}>
          {/* 切换指定模式的按钮 */}
          <div className={styles.toggleSwitchWrapper}>
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <Popconfirm
                overlayClassName={styles.modTip}
                title={isAppointMode ? t(Strings.permission_switch_to_superior) : t(Strings.permission_switch_specified)}
                content={
                  <Typography variant="body4" color={colors.thirdLevelText}>
                    {isAppointMode ? t(Strings.permission_switched_inherit_superior) : t(Strings.permission_switched_reallocate)}
                  </Typography>
                }
                visible={visible}
                onVisibleChange={visible => onVisibleChange(visible, true)}
                trigger="click"
                onOk={toggleMode}
                onCancel={cancelPopoverHandler}
                type="warning"
              >
                <Switch checked={isAppointMode} onClick={handleSwitchClick} />
              </Popconfirm>
            </ComponentDisplay>
            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <Switch checked={isAppointMode} onClick={handleSwitchClick} />
            </ComponentDisplay>
            <Typography className={styles.switchText} variant="body2" color={colors.firstLevelText}>
              {t(isAppointMode ? Strings.close_node_permission_label : Strings.open_node_permission_label)}
            </Typography>
          </div>

          {isAppointMode && <UnitPermissionSelect classNames={styles.permissionSelect} permissionList={optionData} onSubmit={onSubmit} />}
        </div>
      )}
      {/* 当前权限的描述 */}
      <div className={styles.tipContainer}>
        <Typography variant="body4" className={styles.tip} color={colors.thirdLevelText}>
          {t(isAppointMode ? Strings.appoint_permission_tip : Strings.inherit_permission_tip)}
        </Typography>
        {!isMobile && (
          <div className={styles.viewByPersonBtn} onClick={() => toggleIsMemberDetail()}>
            <Typography variant="body4" color={colors.thirdLevelText}>
              {t(Strings.view_by_person)}
            </Typography>
            <ChevronRightOutlined color={colors.fourthLevelText} />
          </div>
        )}
      </div>
      <div className={styles.scrollContainer}>
        <UnitList
          owner={roleList.owner}
          admins={roleList.admins}
          roleUnits={roleList.roleUnits}
          onDelete={deleteUnit}
          onChange={changeUnitRole}
          isAppointMode={isAppointMode}
          readonly={!nodeAssignable || !isAppointMode}
        />
      </div>
      {isMemberDetail && <MembersDetail data={roleList} onCancel={toggleIsMemberDetail} />}
    </div>
  );
};
