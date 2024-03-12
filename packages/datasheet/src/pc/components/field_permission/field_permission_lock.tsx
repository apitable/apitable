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

import * as React from 'react';
import { Tooltip, useThemeColors } from '@apitable/components';
import { ConfigConstant, Selectors, Strings, t } from '@apitable/core';
import { EditOutlined, EyeOpenOutlined, LockOutlined } from '@apitable/icons';

import { useAppSelector } from 'pc/store/react-redux';

export const FieldPermissionLock = (props: {
  fieldId?: string;
  isLock?: boolean;
  tooltip?: string;
  style?: React.CSSProperties;
  color?: string;
  className?: string;
}) => {
  const colors = useThemeColors();
  const { fieldId, tooltip, isLock, style, color, className } = props;

  const fieldPermissionMap = useAppSelector((state) => {
    return Selectors.getFieldPermissionMap(state);
  });

  const isLockedField = fieldId ? Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId) : isLock;

  return (
    <>
      {isLockedField && (
        <Tooltip content={tooltip || t(Strings.field_permission_lock_tips)}>
          <span className={className} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ...style }}>
            <LockOutlined color={color || colors.fourthLevelText} />
          </span>
        </Tooltip>
      )}
    </>
  );
};

export const getFieldLock = (permissionType: ConfigConstant.Role) => {
  switch (permissionType) {
    case ConfigConstant.Role.Manager: {
      return [LockOutlined, t(Strings.field_permission_manager_lock_tips)];
    }
    case ConfigConstant.Role.Editor: {
      return [EditOutlined, t(Strings.field_permission_editor_lock_tips)];
    }
    default:
    case ConfigConstant.Role.Reader: {
      return [EyeOpenOutlined, t(Strings.field_permission_reader_lock_tips)];
    }
  }
};

export const FieldPermissionLockEnhance = (props: { fieldId: string; style?: React.CSSProperties; color?: string; className?: string }) => {
  const colors = useThemeColors();
  const { fieldId, style, color } = props;

  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);

  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);

  if (!fieldPermissionMap || !fieldRole) {
    return null;
  }

  const [Icon, tip] = getFieldLock(fieldPermissionMap[fieldId].manageable ? ConfigConstant.Role.Manager : fieldRole);

  return (
    <>
      <Tooltip content={tip as string}>
        <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ...style }}>
          <Icon color={color || colors.fourthLevelText} />
        </span>
      </Tooltip>
    </>
  );
};
