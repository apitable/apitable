import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from 'classnames';
import { 
  Api, ConfigConstant, INodeRoleMap, IReduxState,
  IUnitValue, Selectors, StoreActions, Strings, t
} from '@vikadata/core';
import { IOption, Typography } from '@vikadata/components';
import { InformationSmallOutlined, ChevronRightOutlined } from '@vikadata/icons';
import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive/* , useSpaceRequest */ } from 'pc/hooks';
import { permissionMenuData } from 'pc/utils';
import { useInviteRequest } from 'pc/hooks/use_invite_request';
import { ScreenSize } from 'pc/components/common/component_display';
import { Avatar, Message, IAvatarProps } from 'pc/components/common';
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
    icon: IAvatarProps,
    name: string,
  };
}

const ROOT_TEAM_ID = '0';

export const ShareContent: FC<IShareContentProps> = ({ data }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // 使用一个额外的数组保存已选择下拉的选项，用于搜索数据回显时不丢失显示数据
  const [inviteLink, setInviteLink] = useState<string>('');

  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { socketData, userInfo, canEditInvite } = useSelector((state: IReduxState) => {
    const permissions = Selectors.getPermissions(state);
    return {
      socketData :state.catalogTree.socketData,
      userInfo: state.user.info,
      canEditInvite: permissions.manageable,
    };
  });
  // const { checkEmailReq } = useSpaceRequest();
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { generateLinkReq, linkListReq } = useInviteRequest();
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  // const { run: checkEmail } = useRequest(checkEmailReq, { manual: true });

  /**
   * 邀请链接生成
   */
  const generateInviteLink = (token) => {
    const url = new URL(window.location.origin);
    url.pathname = '/invite/link';

    const searchParams = new URLSearchParams('');

    searchParams.append('token', token);
    userInfo?.inviteCode && searchParams.append('inviteCode', userInfo.inviteCode);
    url.search = searchParams.toString();
    setInviteLink(url.href);
  };

  /**
   * 获取新的邀请 token
   */
  const generateInviteLinkByNewToken = async() => {
    const token = await generateLinkReq(ROOT_TEAM_ID);
    generateInviteLink(token);
  };

  /**
   * 查询已经生成的邀请链接列表
   */
  const fetchInviteLinkList = async() => {
    const linkList = await linkListReq();
    if (!linkList) {
      return;
    }
    // TODO - 需要判断链接是否已经失效，失效则需要从新生成
    const generateInviteLinkItem = linkList.find((v) => v.teamId === ROOT_TEAM_ID);// 已经存在链接
    if (generateInviteLinkItem) {
      generateInviteLink(generateInviteLinkItem.token);
      return;
    }
    // 旧的链接失效后重新生成新的邀请
    generateInviteLinkByNewToken();
  };

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData, getNodeRoleList]);

  useEffect(() => {
    fetchInviteLinkList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionData = permissionMenuData(data.type);

  // 选择成员的提交事件
  const onSubmit = (unitInfos: IUnitValue[], permission: IOption) => {
    if (!unitInfos.length) {
      return;
    }

    const unitIds = unitInfos.map(item => item.unitId);
  
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

  const adminAndOwnerUnitIds = roleList ? [...roleList.admins.map(v => v.unitId), roleList.owner?.unitId || ''] : [];

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
          <span>{t(Strings.collaborate_and_share)}</span>
          <InformationSmallOutlined />
        </Typography>
        <div className={styles.shareInvite}>
          <UnitPermissionSelect
            classNames={styles.permissionSelect}
            permissionList={optionData}
            onSubmit={onSubmit}
            adminAndOwnerUnitIds={adminAndOwnerUnitIds}
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
        <PublicShareInviteLink inviteLink={inviteLink} nodeId={data.nodeId} isMobile={isMobile} canEditInvite={canEditInvite} />
      </div>
      {detailModalVisible && roleList && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
    </>
  );
};