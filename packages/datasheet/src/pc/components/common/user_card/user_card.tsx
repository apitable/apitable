import { FC, useState, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'pc/hooks';
import { Api, t, Strings, Selectors, ConfigConstant, IRoleMember, IShareSettings, StoreActions } from '@vikadata/core';
import { Typography, useThemeColors } from '@vikadata/components';
import { SettingOutlined } from '@vikadata/icons';
import { Tag, Loading, Avatar } from 'pc/components/common';
import styles from './style.module.less';
import { useCatalogTreeRequest } from 'pc/hooks';
import { TagColors } from '../tag';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

export interface IUserCard {
  // 通知中心使用
  memberId?: string;
  // 协同头像使用
  userId?: string;
  // 是否显示仅限模块
  permissionVisible?: boolean;
  spareName?: string; // 接口查询不到信息时备用接口
  spareSrc?: string; // 接口查询不到信息时备用接口
  spaceName?: string; // 不传则默认取userinfo里的空间名称
  isAlien?: boolean;
  // 关闭悬浮卡片
  onClose?: () => void;
}

export const UserCardWidth: CSSProperties = {
  width: 'auto',
  minWidth: '120px',
  maxWidth: '240px',
};
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
  spaceName,
  isAlien,
  permissionVisible = true,
  onClose
}) => {
  const colors = useThemeColors();
  const [tagType, setTagType] = useState('');
  const user = useSelector(state => Selectors.userStateSelector(state));
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

  const renderTags = () => {
    const teamTag = (team: string) => (<div className={styles.tag} key={team}>
      <Typography variant="body4" color={colors.secondLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>{team}</Typography>
    </div>);

    // 外星人
    if (isAlien) {
      return teamTag(t(Strings.anonymous));
    } else if (!memberInfo) { // 外部访问者
      return teamTag(t(Strings.guests_per_space));
    }

    // 如果请求到的team为空的话，就显示空间站名称
    const teams = memberInfo.teams?.length ?
      memberInfo.teams : [{ teamId: ConfigConstant.ROOT_TEAM_ID, teamName: spaceName || user.info!.spaceName }];
    return teams.map(item => teamTag(item.teamName));
  };

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
      <div className={styles.userCard}>
        {loading || (!memberRole && permissionVisible) ? <Loading /> :
          (
            <div>
              <div className={styles.avatarWrapper}>
                <Avatar
                  id={memberInfo?.memberId || userId || '0'}
                  src={memberInfo?.avatar || spareSrc}
                  title={memberInfo?.memberName || spareName || ''}
                  size={40}
                />
                {permissionVisible && memberRole &&
                  <div className={styles.permissionWrapper}>
                    <Tag className={styles.permission} color={TagColors[memberRole]}>{ConfigConstant.permissionText[memberRole]}</Tag>
                    {memberInfo && <div className={styles.settingPermissionBtn} onClick={openPermissionModal}>
                      <SettingOutlined />
                    </div>
                    }
                  </div>
                }
              </div>
              <Typography className={styles.name} variant="h7" color={colors.firstLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>
                {title || spareName}
              </Typography>
              <Typography variant="body4" color={colors.thirdLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>
                {tagType === TAGTYPE.Alien ? t(Strings.alien_tip_in_user_card) : memberInfo?.email}
              </Typography>
              <div className={styles.tagWrapper}>
                {renderTags()}
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};
