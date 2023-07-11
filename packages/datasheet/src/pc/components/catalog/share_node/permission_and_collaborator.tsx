import { IOption, Typography } from '@apitable/components';
import cls from 'classnames';
import styles from './style.module.less';
import { Api, INodeRoleMap, IUnitValue, StoreActions, Strings, t } from '@apitable/core';
import { Avatar, AvatarSize, Message, Tooltip } from '../../common';
import { getEnvVariables } from '../../../utils/env';
import { ChevronRightOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { UnitPermissionSelect } from '../../field_permission/unit_permission_select';
import { useCatalogTreeRequest, useRequest } from '../../../hooks';
import { permissionMenuData } from '../../../utils';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IMemberList } from '../permission_settings_plus/permission';
import { IShareContentProps } from './interface';

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

  return <>
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
  </>;
};
