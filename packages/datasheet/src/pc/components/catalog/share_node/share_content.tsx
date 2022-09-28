import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from 'classnames';
import { 
  Api, ConfigConstant, INodeRoleMap, IReduxState,
  IUnitValue, Selectors, StoreActions, Strings, t
} from '@vikadata/core';
import { IOption, Skeleton, Typography } from '@vikadata/components';
import { InformationSmallOutlined, ChevronRightOutlined } from '@vikadata/icons';
import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { permissionMenuData } from 'pc/utils';
import { ScreenSize } from 'pc/components/common/component_display';
import { Avatar, Message } from 'pc/components/common';
import { Tooltip } from 'pc/components/common/tooltip';
import { PublicShareInviteLink } from './public_link';
import { MembersDetail } from '../permission_settings/permission/members_detail';
import styles from './style.module.less';
import { UnitPermissionSelect } from 'pc/components/field_permission/unit_permission_select';

export interface IShareContentProps {
  /** 被操作节点相关的信息 */
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
  const { socketData, canEditInvite } = useSelector((state: IReduxState) => {
    const permissions = Selectors.getPermissions(state);
    return {
      socketData :state.catalogTree.socketData,
      canEditInvite: permissions.manageable,
    };
  });
  const invitable = useSelector(state => state.space.spaceFeatures?.invitable);
  // const { checkEmailReq } = useSpaceRequest();
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
        <Skeleton count={1} width="38%" height="24px" />
        <Skeleton count={2} style={{ marginTop: '16px' }} height="24px"/>
        <Skeleton count={1} style={{ marginTop: '40px' }} width="38%" height="24px" />
        <Skeleton count={1} style={{ marginTop: '16px' }} height="24px" />
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
        await getNodeRoleList();
      } else {
        Message.error({ content: message });
      }
    });
  };

  const adminAndOwnerUnitIds = roleList ? [
    ...roleList.admins.map(v => v.unitId),
    ...roleList.roleUnits.map(v => v.unitId),
    roleList.owner?.unitId || ''
  ] : [];

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
          <span>{t(Strings.collaborate_and_share)}</span>
          <InformationSmallOutlined currentColor />
        </Typography>
        <div className={styles.shareInvite}>
          <UnitPermissionSelect
            classNames={styles.permissionSelect}
            permissionList={optionData}
            onSubmit={onSubmit}
            adminAndOwnerUnitIds={adminAndOwnerUnitIds}
            showTeams
            searchEmail
          />
        </div>
        <div className={cls(styles.shareFloor, styles.collaborator)}>
          <div className={styles.collaboratorStatus} onClick={() => setDetailModalVisible(true)}>
            {roleList && (
              <div className={styles.collaboratorIcon}>
                {
                  roleList.members.slice(0, 5).map((v, i) => (
                    <div key={v.memberId} className={styles.collaboratorIconItem} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 5 - i }}>
                      <Tooltip title={v.memberName}>
                        <div><Avatar src={v.avatar} title={v.memberName} id={v.memberId} /></div>
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
          <Typography
            variant='body3'
            className={styles.collaboratorAuth}
            onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(data.nodeId))}
          >
            <span>{t(Strings.setting_permission)}</span>
            <ChevronRightOutlined />
          </Typography>
        </div>
        <PublicShareInviteLink
          nodeId={data.nodeId}
          isMobile={isMobile}
          canEditInvite={canEditInvite || Boolean(invitable)}
        />
      </div>
      {detailModalVisible && roleList && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
    </>
  );
};