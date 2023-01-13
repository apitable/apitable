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

import { Typography, useThemeColors } from '@apitable/components';
import { Api, ConfigConstant, IRoleMember, IShareSettings, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { SettingOutlined } from '@apitable/icons';
import { Avatar, Loading, Tag } from 'pc/components/common';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { FC, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TagColors } from '../tag';
import styles from './style.module.less';
import { IAvatarProps } from 'pc/components/common';
import classNames from 'classnames';
export interface IUserCard {
  memberId?: string;
  userId?: string;
  permissionVisible?: boolean;
  spareName?: string; // Alternate interface in case the interface does not query information
  spareSrc?: string; 
  spaceName?: string; // If not passed, the space name in userinfo is taken by default
  isAlien?: boolean;
  isDeleted?: boolean;
  isActive?: boolean;
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

  // Get member information
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

  // Get the member's role by memberId
  async function getMemberRoleReq(memberId?: string) {
    if (memberId) {
      try {
        const data = await getNodeRoleListReq(activeNodeId!);
        if (data) {
          const members: IRoleMember[] = data.members;
          const member = members.filter(item => item.memberId === memberId);
          if (member[0]?.role) {
            return member[0].role;
          }
        }
      } catch(e) {
        console.log('Get member role error', e);
      }
    }

    // External visitors
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
  
    // Aliens
    if (isAlien) {
      return t(Strings.anonymous);
    } else if (!memberInfo) { // External visitors
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

  const title = getSocialWecomUnitName?.({
    name: memberInfo?.memberName,
    isModified: memberInfo?.isMemberNameModified,
    spaceInfo
  }) || memberInfo?.memberName;

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
                  title={memberInfo?.nickName || memberInfo?.memberName || spareName || ''}
                  avatarColor={memberInfo?.avatarColor}
                  {...avatarProps}
                  size={40}
                />
                <div className={styles.nameWrapper}>
                  <Typography className={styles.name} variant="h7" color={colors.firstLevelText} ellipsis tooltipsZIndex={tooltipZIndex}>
                    { title || spareName }
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
                    {memberInfo ?
                      memberInfo?.teamData?.map((item, index) => {
                        return(
                          <div key={index} className={styles.teamItem}><p>-</p><p className={styles.teamText}>{item.fullHierarchyTeamName}</p></div>
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