import { Typography, useThemeColors } from '@vikadata/components';
import { Api, ConfigConstant, IRoleMember, IShareSettings, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { SettingOutlined } from '@vikadata/icons';
import { Avatar, Loading, Tag } from 'pc/components/common';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { FC, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TagColors } from '../tag';
import styles from './style.module.less';
import { IAvatarProps } from 'pc/components/common';
import classNames from 'classnames';
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
  isDeleted?: boolean;
  isActive?: boolean;
  // 关闭悬浮卡片
  onClose?: () => void;
  avatarProps?: IAvatarProps;
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
  isDeleted = false,
  isActive = true,
  avatarProps,
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

  const tagText = useMemo(() => {
    if(isDeleted) {
      return t(Strings.member_status_removed);
    }
  
    if(!isActive || (memberInfo && !memberInfo.isActive)) {
      return t(Strings.added_not_yet);
    }
  
    // 外星人
    if (isAlien) {
      return t(Strings.anonymous);
    } else if (!memberInfo) { // 外部访问者
      return t(Strings.guests_per_space);
    }

    return '';
  }, [isDeleted, isActive, isAlien, memberInfo]);

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
              {permissionVisible && memberRole && memberInfo &&
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
                  {...avatarProps}
                  size={40}
                />
                <div className={styles.nameWrapper}>
                  <Typography className={styles.name} variant="h7" color={colors.firstLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>
                    {spareName || title }
                  </Typography>
                  {permissionVisible && memberRole &&
                    <div className={styles.permissionWrapper}>
                      <Tag className={styles.permission} color={TagColors[memberRole]}>{ConfigConstant.permissionText[memberRole]}</Tag>
                    </div>
                  }
                  <TeamTag tagText={tagText} isActive={memberInfo ? memberInfo.isActive as boolean | undefined : isActive } />
                </div>
              </div>
              <div className={styles.infoWrapper}>
                <div className={styles.email}>
                  {
                    memberInfo?.email &&
                      <Typography variant="body4" color={colors.textCommonSecondary} ellipsis tooltipsZIndex={tooltipZIndex}>
                        {tagType === TAGTYPE.Alien ? t(Strings.alien_tip_in_user_card) : memberInfo?.email}
                      </Typography>
                  }
                </div>
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoWrapper}>
                  <p>{t(Strings.role_member_table_header_team)}</p>
                  <div className={styles.teamList}>
                    { memberInfo ?
                      memberInfo?.teamData?.map(item => {
                        return(
                          <div className={styles.teamItem}><p>-</p><p className={styles.teamText}>{item.fullHierarchyTeamName}</p></div>
                        );
                      }) : isAlien ? t(Strings.alien_tip_in_user_card) : '-' 
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

interface ITeamTag {
  tagText: string;
  isActive?: boolean | undefined;
}

const TeamTag: FC<ITeamTag> = (props) => {
  const { tagText, isActive } = props;
  
  const colors = useThemeColors();
  
  if(tagText === '') {
    return null;
  }

  return (
    <div className={classNames({
      [styles.tag]: isActive,
      [styles.dangerTag]: !isActive
    })} >
      <Typography variant="body4" color={isActive ? colors.secondLevelText : colors.borderDanger} ellipsis >{tagText}</Typography>
    </div>
  );
};