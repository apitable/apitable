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

import classNames from 'classnames';
import { FC, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, useThemeColors } from '@apitable/components';
import { Api, ConfigConstant, IShareSettings, Selectors, StoreActions, Strings, t, IMemberInfoInAddressList } from '@apitable/core';
import { SettingOutlined, InfoCircleOutlined } from '@apitable/icons';
import { Avatar } from 'pc/components/common/avatar';
import { IAvatarProps } from 'pc/components/common/avatar/avatar';
import { Loading } from 'pc/components/common/loading';
import { Tag, TagColors } from 'pc/components/common/tag';
import { useCatalogTreeRequest } from 'pc/hooks/use_catalogtree_request';
import { useRequest } from 'pc/hooks/use_request';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

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

export const UserCard: FC<React.PropsWithChildren<IUserCard>> = ({
  memberId,
  userId,
  spareName,
  spareSrc,
  isAlien,
  permissionVisible = true,
  isDeleted = false,
  isActive = true,
  avatarProps,
  onClose,
}) => {
  const colors = useThemeColors();
  const [tagType, setTagType] = useState('');
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activeNodePrivate = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[activeNodeId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[activeNodeId]?.nodePrivate
  );
  const { shareSettingsReq } = useCatalogTreeRequest();
  const { data: memberInfo, loading } = useRequest(getMemberInfo);
  const { run: getMemberRole, data: memberRole } = useRequest(getMemberRoleReq, { manual: true });
  const dispatch = useDispatch();

  // Get member information
  function getMemberInfo(): Promise<IMemberInfoInAddressList | null> {
    if (memberId) {
      return Api.getMemberInfo({ memberId, uuid: userId }).then((res) => {
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
    if (userId) {
      return Api.getNodeCollaboratorInfo({ uuid: userId, nodeId: activeNodeId }).then((res) => {
        const { success, data } = res.data;
        if (success) {
          setTagType(TAGTYPE.Member);
          permissionVisible && getMemberRole(data.memberId, data.role);
          return data;
        }
        permissionVisible && getMemberRole();
        setTagType(isAlien ? TAGTYPE.Alien : TAGTYPE.Visitor);
        return null;
      });
    }
    return new Promise((resolve) => {
      permissionVisible && getMemberRole();
      setTagType(isAlien ? TAGTYPE.Alien : TAGTYPE.Visitor);
      resolve(null);
    });
  }

  // Get the member's role by memberId
  async function getMemberRoleReq(memberId?: string, role?: string) {
    if (memberId) {
      return role;
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
    if (isDeleted) {
      return t(Strings.member_status_removed);
    }

    if (!isActive || (memberInfo && !memberInfo.isActive)) {
      return t(Strings.added_not_yet);
    }
    return '';
  }, [isDeleted, isActive, memberInfo]);

  const tooltipZIndex = 10001;

  const openPermissionModal = () => {
    if (!activeNodeId) {
      return;
    }
    dispatch(StoreActions.updatePermissionModalNodeId(activeNodeId));
    onClose && onClose();
  };

  const title =
    getSocialWecomUnitName?.({
      name: memberInfo?.memberName || memberInfo?.nickName || spareName,
      isModified: memberInfo?.isMemberNameModified,
      spaceInfo,
    }) || memberInfo?.memberName;

  return (
    <>
      <div className={styles.userCard} onClick={(e) => e.stopPropagation()}>
        {loading || (!memberRole && permissionVisible) ? (
          <Loading />
        ) : (
          <div>
            {permissionVisible && memberRole && memberInfo && getEnvVariables().FILE_PERMISSION_VISIBLE && !activeNodePrivate && (
              <div className={styles.cardTool} onClick={openPermissionModal}>
                <div className={styles.settingPermissionBtn}>
                  <SettingOutlined size={20} color={colors.textCommonPrimary} />
                </div>
                <span>{t(Strings.permission)}</span>
              </div>
            )}
            <div className={styles.avatarWrapper}>
              <Avatar
                id={memberInfo?.memberId || userId || '0'}
                src={memberInfo?.avatar || spareSrc}
                title={memberInfo?.memberName || memberInfo?.nickName || spareName || ''}
                avatarColor={memberInfo?.avatarColor}
                {...avatarProps}
                size={40}
              />
              <div className={styles.nameWrapper}>
                <h6>
                  <span>{title}</span>
                  {permissionVisible && memberRole && (
                    <Tag className={styles.permissionWrapper} color={TagColors[memberRole]}>
                      {ConfigConstant.permissionText[memberRole]}
                    </Tag>
                  )}
                  <TeamTag tagText={tagText} isActive={memberInfo ? (memberInfo.isActive as boolean | undefined) : isActive} />
                </h6>
              </div>
            </div>
            {memberInfo?.email && (
              <div className={styles.infoWrapper}>
                <div className={styles.email}>
                  <Typography variant="body4" color={colors.textCommonSecondary} ellipsis tooltipsZIndex={tooltipZIndex}>
                    {tagType === TAGTYPE.Alien ? t(Strings.alien_tip_in_user_card) : memberInfo?.email}
                  </Typography>
                </div>
              </div>
            )}
            <div
              className={styles.infoContent}
              style={{
                marginTop: memberInfo ? '16px' : '8px',
              }}
            >
              {getEnvVariables().UNIT_LIST_TEAM_INFO_VISIBLE && (
                <div className={styles.infoWrapper}>
                  {isAlien || !memberInfo ? (
                    <div className={styles.infoText}>
                      <InfoCircleOutlined size={16} />
                      <p>{t(Strings.alien_tip_in_user_card)}</p>
                    </div>
                  ) : (
                    <>
                      <p>{t(Strings.role_member_table_header_team)}</p>
                      <div className={styles.teamList}>
                        {memberInfo
                          ? memberInfo?.teamData?.map((item, index) => {
                            return (
                              <div key={index} className={styles.teamItem}>
                                <p>-</p>
                                <p className={styles.teamText}>{item.fullHierarchyTeamName}</p>
                              </div>
                            );
                          })
                          : '-'}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface ITeamTag {
  tagText: string;
  isActive?: boolean | undefined;
}

const TeamTag: FC<React.PropsWithChildren<ITeamTag>> = (props) => {
  const { tagText, isActive } = props;

  const colors = useThemeColors();

  if (tagText === '') {
    return null;
  }

  return (
    <div
      className={classNames({
        [styles.tag]: isActive,
        [styles.dangerTag]: !isActive,
      })}
    >
      <p style={{ color: isActive ? colors.secondLevelText : colors.borderDangerDefault }}>{tagText}</p>
    </div>
  );
};
