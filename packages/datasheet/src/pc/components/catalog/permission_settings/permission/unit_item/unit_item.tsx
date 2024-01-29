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

import { Space } from 'antd';
import classnames from 'classnames';
import { FC } from 'react';
import { useThemeColors, WrapperTooltip } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { UserAdminFilled, UserAdminOutlined } from '@apitable/icons';
import { PermissionSelect } from 'pc/components/catalog/permission_settings/permission/unit_item/permission_select';
// eslint-disable-next-line no-restricted-imports
import { AvatarType, InfoCard, Tooltip } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { IRoleOption, IUnitItemProps } from './interface';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const DEFAULT_ROLE: IRoleOption[] = [
  {
    value: ConfigConstant.RolePriority[0],
    label: t(Strings.can_control),
  },
  {
    value: ConfigConstant.RolePriority[1],
    label: t(Strings.can_edit),
  },
  {
    value: ConfigConstant.RolePriority[3],
    label: t(Strings.can_updater),
  },
  {
    value: ConfigConstant.RolePriority[2],
    label: t(Strings.can_read),
  },
];

export const UnitItem: FC<React.PropsWithChildren<IUnitItemProps>> = (props) => {
  const colors = useThemeColors();
  const { unit, role, disabled, identity, className, roleOptions = DEFAULT_ROLE, disabledTip } = props;
  const isAdmin = identity?.admin;
  const isOwner = identity?.permissionOpener;

  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  const title =
    getSocialWecomUnitName?.({
      name: unit.name,
      isModified: unit.isMemberNameModified,
      spaceInfo,
    }) || unit.name;

  return (
    <div className={classnames(styles.unitItem, className)}>
      <div className={styles.unitInfo}>
        <InfoCard
          title={title}
          token={
            <Space align="center" size={4}>
              {isAdmin && (
                <Tooltip title={t(Strings.space_admin)}>
                  <div className={styles.role}>
                    <UserAdminFilled size={16} color={colors.primaryColor} />
                  </div>
                </Tooltip>
              )}
              {isOwner && (
                <Tooltip title={identity?.permissionOpenerTip || t(Strings.share_permisson_model_node_owner)}>
                  <div className={styles.role}>
                    <UserAdminOutlined size={16} color={colors.successColor} />
                  </div>
                </Tooltip>
              )}
            </Space>
          }
          description={unit.info || ''}
          style={{ backgroundColor: 'transparent' }}
          avatarProps={{
            id: unit.id,
            src: unit.avatar,
            avatarColor: unit.avatarColor,
            title: unit.nickName || unit.name,
            type: unit.isTeam ? AvatarType.Team : AvatarType.Member,
          }}
        />
      </div>
      <div className={classnames(styles.permission)}>
        {disabled ? (
          <WrapperTooltip wrapper={Boolean(disabledTip)} tip={disabledTip || ''}>
            <span className={styles.onlyShowPermission}>{roleOptions.find((item) => item.value === role)!.label}</span>
          </WrapperTooltip>
        ) : (
          <PermissionSelect {...props} roleOptions={roleOptions} />
        )}
      </div>
    </div>
  );
};
