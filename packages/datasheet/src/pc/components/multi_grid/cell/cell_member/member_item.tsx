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
import * as React from 'react';
import { getThemeColors } from '@apitable/components';
import { IUnitValue, IUserValue, MemberType, t, Strings } from '@apitable/core';
import { UserOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './styles.module.less';

interface IMemberItemProps {
  unitInfo: IUnitValue | IUserValue;
  style?: React.CSSProperties;
  selected?: boolean;
  showTeams?: boolean;
}

export function isUnitLeave(unit: IUnitValue | IUserValue) {
  if (!unit) return true;
  if (unit.isDeleted) {
    return true;
  }
  return unit.type === MemberType.Member && !unit.isActive;
}

export const MemberItem: React.FC<React.PropsWithChildren<IMemberItemProps>> = (props) => {
  const { unitInfo, children, style, selected, showTeams } = props;
  const { unitId, avatar, avatarColor, nickName, name, type, userId, isSelf, desc, isMemberNameModified, team, email, isActive } = unitInfo as any;
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const colors = getThemeColors();

  const title =
    getSocialWecomUnitName?.({
      name,
      isModified: isMemberNameModified,
      spaceInfo,
    }) || name;

  if (showTeams) {
    return (
      <div className={styles.memberWithTeams}>
        <Avatar
          id={unitId || userId!}
          title={name}
          size={AvatarSize.Size24}
          src={avatar}
          type={type === MemberType.Member ? AvatarType.Member : AvatarType.Team}
          style={{ minWidth: 20 }}
          defaultIcon={isSelf ? <UserOutlined size={12} color={colors.defaultBg} /> : undefined}
        />
        <div className={styles.memberWithTeamsDesc}>
          <div className={styles.unitNameWrap}>
            <span className={classNames('unitName', styles.unitName)}>{title}</span>
            {!isActive && <div className={styles.unInvited}>{t(Strings.pending_invite)}</div>}
          </div>
          {team && <div className={styles.teams}>{team}</div>}
          {email && <div className={styles.teams}>{email}</div>}
        </div>
      </div>
    );
  }

  return (
    <span
      className={classNames('unitMember', {
        [styles.unitItemWrapper]: true,
        [styles.unitMember]: unitInfo.type === MemberType.Member,
        [styles.unitTeam]: unitInfo.type === MemberType.Role || unitInfo.type === MemberType.Team,
        [styles.isLeave]: isUnitLeave(unitInfo),
        [styles.selected]: selected,
      })}
      style={style}
    >
      <Avatar
        id={unitId || userId!}
        title={nickName || name}
        size={AvatarSize.Size20}
        src={avatar}
        avatarColor={avatarColor}
        type={type === MemberType.Member ? AvatarType.Member : AvatarType.Team}
        style={{ minWidth: 20 }}
        defaultIcon={isSelf ? <UserOutlined size={12} color={colors.defaultBg} /> : undefined}
      />
      <span className={classNames('unitName', styles.unitName)}>{title}</span>
      {desc && <span className={styles.unitDesc}>{`（${desc}）`}</span>}
      {children}
    </span>
  );
};
