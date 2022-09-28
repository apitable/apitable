import { Typography, useThemeColors } from '@vikadata/components';
import { Api, ConfigConstant, IRoleMember, IShareSettings, Selectors, StoreActions, Strings, t } from '@vikadata/core';
import { SettingOutlined } from '@vikadata/icons';
import { Avatar, Loading, Tag } from 'pc/components/common';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TagColors } from '../tag';
import styles from './style.module.less';

export interface IUserCard {
  // 通知中心使用
  memberId?: string;
  // 协同头像使用
  userId?: string;
  // 是否显示权限模块
  permissionVisible?: boolean;
  spareName?: string; // 接口查询不到信息时备用接口
  spareSrc?: string; // 接口查询不到信息时备用接口
  spaceName?: string; // 不传则默认取userinfo里的空间名称
  isAlien?: boolean;
  // 关闭悬浮卡片
  onClose?: () => void;
}
enum TAGTYPE {
  Visitor = 'Visitor',
  Member = 'Member',
  Alien = 'Alien',
}

export const UserCard: FC<IUserCard> = ({
  memberId,
  userId,
  spareName,
  spareSrc,
  isAlien,
  permissionVisible = true,
  onClose
}) => {
  const colors = useThemeColors();
  const [tagType, setTagType] = useState('');
 
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const activeNodeId = useSelector(state => Selectors.getNodeId(state));
  const { getNodeRoleListReq, shareSettingsReq } = useCatalogTreeRequest();
  const { data: memberInfo, loading } = useRequest(getMemberInfo);
  const { run: getMemberRole, data: memberRole } = useRequest(getMemberRoleReq, { manual: true });
  const dispatch = useDispatch();

  // 获取成员信息
  function getMemberInfo() {
    return Api.getMemberInfo({ memberId, uuid: userId }).then(res => {
      const { success, data } = res.data;
      if (success) {
        setTagType(TAGTYPE.Member);
        permissionVisible && getMemberRole(data.memberId);
        return data;
      }
      permissionVisible && getMemberRole();
      setTagType(isAlien ? TAGTYPE.Alien : TAGTYPE.Visitor);
      return null;
    });
  }

  // 通过memberId获取成员的角色
  async function getMemberRoleReq(memberId?: string) {
    if (memberId) {
      const data = await getNodeRoleListReq(activeNodeId!);
      if (data) {
        const members: IRoleMember[] = data.members;
        const member = members.filter(item => item.memberId === memberId);
        if (member[0]?.role) {
          return member[0].role;
        }
      }
    }

    // 外部访客
    if (!isAlien) {
      const shareInfo: IShareSettings = await shareSettingsReq(activeNodeId!);
      if (shareInfo.props.canBeEdited) {
        return ConfigConstant.Role.Editor;
      }
    }

    return ConfigConstant.Role.Reader;
  }

  const tooltipZIndex = 10001;

  const openPermissionModal = () => {
    if (!activeNodeId) { return; }
    dispatch(StoreActions.updatePermissionModalNodeId(activeNodeId));
    onClose && onClose();
  };

  const title = getSocialWecomUnitName({
    name: memberInfo?.memberName,
    isModified: memberInfo?.isMemberNameModified,
    spaceInfo
  });
 
  return (
    <>
      <div className={styles.userCard} onClick={e => e.stopPropagation()}>
        {loading || (!memberRole && permissionVisible) ? <Loading /> :
          (
            <div>
              {permissionVisible && 
                <div className={styles.cardTool} onClick={openPermissionModal}>
                  <div className={styles.settingPermissionBtn} >
                    <SettingOutlined />
                  </div>
                  <span>{t(Strings.permission)}</span>
                </div>
              }
              <div className={styles.avatarWrapper}>
                <Avatar
                  id={memberInfo?.memberId || userId || '0'}
                  src={memberInfo?.avatar || spareSrc}
                  title={memberInfo?.memberName || spareName || ''}
                  size={40}
                />
                <div className={styles.nameWrapper}>
                  <Typography className={styles.name} variant="h7" color={colors.firstLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>
                    {title || spareName}
                  </Typography>
                  {permissionVisible && memberRole &&
                    <div className={styles.permissionWrapper}>
                      <Tag className={styles.permission} color={TagColors[memberRole]}>{ConfigConstant.permissionText[memberRole]}</Tag>
                    </div>
                  }
                </div>
              </div>
              <div className={styles.dividing} />
              <div className={styles.infoContent}>
                <div className={styles.infoWrapper}>
                  {/* {renderTags()} */}
                  <p>{t(Strings.role_member_table_header_team)}:</p>
                  <div className={styles.teamList}>
                    { memberInfo ?
                      memberInfo?.teamData?.map(item => {
                        return(
                          <div className={styles.teamItem}>{item.fullHierarchyTeamName}</div>
                        );
                      }) : '-'
                    }
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <p>{t(Strings.mail)}:</p>
                  <div className={styles.teamList}>
                    {
                      memberInfo?.email ? 
                        <Typography variant="body4" color={colors.textCommonPrimary} ellipsis tooltipsZIndex={tooltipZIndex}>
                          {tagType === TAGTYPE.Alien ? t(Strings.alien_tip_in_user_card) : memberInfo?.email}
                        </Typography> : '-'
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};
