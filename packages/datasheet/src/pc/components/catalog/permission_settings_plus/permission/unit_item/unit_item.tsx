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

import { Dropdown } from 'antd';
import classnames from 'classnames';
import { get } from 'lodash';
import { FC, useState } from 'react';
import { useThemeColors, Box, Tooltip, Typography, Space } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { ChevronDownOutlined, ChevronUpOutlined } from '@apitable/icons';
import { AvatarType, InfoCard } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { Menu, MenuItem } from '../menu';
import { IRoleOption, IUnitItemProps } from './interface';
import { PermissionSelectMobile } from './permission_select_mobile';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export const DEFAULT_ROLE: IRoleOption[] = [
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

const triggerBase = {
  action: ['hover'],
  popupAlign: {
    points: ['tl', 'bl'],
    offset: [0, 18],
    overflow: { adjustX: true, adjustY: true },
  },
};

export const UnitItem: FC<React.PropsWithChildren<IUnitItemProps>> = (props) => {
  const colors = useThemeColors();
  const {
    unit,
    role,
    identity,
    className,
    roleOptions = DEFAULT_ROLE,
    isAppointMode,
    disabled,
    onChange,
    onRemove,
    isDetail,
    teamData,
    memberId,
  } = props;
  const isAdmin = identity?.admin;
  const isOwner = identity?.permissionOpener;

  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const curUnitId = useAppSelector((state) => state.user.info?.unitId);

  const title =
    getSocialWecomUnitName?.({
      name: unit.name,
      isModified: unit.isMemberNameModified,
      spaceInfo,
    }) || unit.name;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const [menuVisible, setMenuVisible] = useState<boolean>();

  const Tag = () => {
    if (!isAdmin && !isOwner) {
      return <></>;
    }
    // Defaults to isAdmin && !isOwner
    let backgroundColor: string = colors.rainbowPurple1;
    let color: string = colors.rainbowPurple5;
    let str = t(Strings.space_admin);

    if (!isAdmin && isOwner) {
      backgroundColor = colors.rainbowTeal1;
      color = colors.rainbowTeal4;
      str = t(Strings.share_permisson_model_node_owner);
    }
    if (isAdmin && isOwner) {
      backgroundColor = colors.rainbowIndigo1;
      color = colors.rainbowIndigo5;
      str = t(Strings.node_permission_label_space_and_file);
    }
    return (
      <Box backgroundColor={backgroundColor} className={styles.identifyTag}>
        <Typography className={styles.tagContent} color={color} variant="h9">
          {str}
        </Typography>
      </Box>
    );
  };
  const arrowIconProps = { color: colors.textCommonPrimary, size: 12 };
  const arrow = menuVisible ? <ChevronUpOutlined {...arrowIconProps} /> : <ChevronDownOutlined {...arrowIconProps} />;
  const getUnitItemTips = () => {
    if (isAdmin) {
      return unit.id === curUnitId ? t(Strings.node_permission_item_tips_admin_you) : t(Strings.node_permission_item_tips_admin_he);
    }
    if (isOwner) {
      return unit.id === curUnitId ? t(Strings.node_permission_item_tips_file_you) : t(Strings.node_permission_item_tips_file_he);
    }
    const label = roleOptions.find((v) => v.value === role)?.label;
    if (unit.id === curUnitId) {
      return t(Strings.node_permission_item_tips_other_you, { role: label });
    }
    return `${t(Strings.node_permission_item_tips_other_he, { role: label })}${disabled ? '' : t(Strings.node_permission_item_tips_other_he_edit)}`;
  };
  const itemContentMain = (
    <div className={classnames(styles.unitItem, className, !disabled && styles.unitItemOperation, (isDetail || isMobile) && styles.unitItemMobile)}>
      <div className={styles.unitInfo}>
        <InfoCard
          title={unit.isTeam ? unit.name : title}
          token={
            <Space align="center" size={4}>
              <Tag />
            </Space>
          }
          triggerBase={unit.isTeam ? undefined : triggerBase}
          memberId={unit.memberId || memberId}
          description={get(teamData, '0.fullHierarchyTeamName', '') || unit.info}
          extra={!isAppointMode ? t(Strings.node_permission_extend_desc) : ''}
          style={{ backgroundColor: 'transparent', height: 'auto' }}
          avatarProps={{
            id: unit.id,
            src: unit.avatar,
            title: unit.nickName || unit.name,
            avatarColor: unit.avatarColor,
            type: unit.isTeam ? AvatarType.Team : AvatarType.Member,
          }}
          className={styles.infoCard}
        />
      </div>
      <div className={classnames(styles.permission)}>
        <span className={classnames(styles.onlyShowPermission, disabled && styles.onlyShowPermissionDisabled)}>
          {roleOptions.find((item) => item.value === role)!.label}
        </span>
        {!disabled && arrow}
      </div>
    </div>
  );
  const itemContent = (
    <div className={styles.itemContent}>
      {isMobile || isDetail ? (
        itemContentMain
      ) : (
        <Tooltip placement={'left-center'} trigger="hover" content={getUnitItemTips()}>
          {itemContentMain}
        </Tooltip>
      )}
    </div>
  );
  if (disabled) {
    return itemContent;
  }

  const clickRole = (unitId: string, clickRole: string) => {
    setMenuVisible(false);
    onChange && role !== clickRole && onChange(unitId, clickRole);
  };
  const removeRole = (unitId: string) => {
    setMenuVisible(false);
    onRemove && onRemove(unitId);
  };
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Dropdown
          overlayStyle={{
            minWidth: 'auto',
            right: 0,
          }}
          placement={'bottomRight'}
          trigger={['click']}
          visible={menuVisible}
          onVisibleChange={setMenuVisible}
          disabled={disabled}
          overlay={
            <div style={{ maxWidth: '240px' }}>
              <Menu>
                {roleOptions.map((v) => (
                  <MenuItem key={v.value} onClick={() => clickRole(unit.id, v.value)} active={role === v.value} item={v} />
                ))}
                <MenuItem
                  className={styles.delete}
                  item={{ label: t(Strings.remove_role), value: 'remove' }}
                  option={{ labelColor: colors.textDangerDefault }}
                  onClick={() => removeRole(unit.id)}
                >
                  {t(Strings.remove_role)}
                </MenuItem>
              </Menu>
            </div>
          }
        >
          {itemContent}
        </Dropdown>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <PermissionSelectMobile role={role} onChange={onChange} unitId={unit.id} onRemove={removeRole} roleOptions={roleOptions}>
          {itemContent}
        </PermissionSelectMobile>
      </ComponentDisplay>
    </>
  );
};
