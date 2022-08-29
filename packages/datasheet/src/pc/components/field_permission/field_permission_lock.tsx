import * as React from 'react';
import { EditOutlined, EyeNormalOutlined, LockNonzeroOutlined } from '@vikadata/icons';
import { useSelector } from 'react-redux';
import { ConfigConstant, Selectors, Strings, t } from '@vikadata/core';
import { Tooltip, useThemeColors } from '@vikadata/components';

export const FieldPermissionLock = (props: {
  fieldId?: string;
  isLock?: boolean;
  tooltip?: string;
  style?: React.CSSProperties;
  color?: string;
  className?: string;
}) => {
  const colors = useThemeColors();
  const {
    fieldId,
    tooltip,
    isLock,
    style,
    color,
    className
  } = props;

  const fieldPermissionMap = useSelector(state => { return Selectors.getFieldPermissionMap(state); });

  const isLockedField = fieldId ? Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId) : isLock;

  return <>
    {
      isLockedField &&
      <Tooltip content={tooltip || t(Strings.field_permission_lock_tips)}>
        <span className={className} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ...style }}>
          <LockNonzeroOutlined color={color || colors.fourthLevelText} />
        </span>
      </Tooltip>
    }
  </>;
};

export const getFieldLock = (permissionType: ConfigConstant.Role) => {
  switch (permissionType) {
    case ConfigConstant.Role.Manager: {
      return [
        LockNonzeroOutlined,
        t(Strings.field_permission_manager_lock_tips)
      ];
    }
    case ConfigConstant.Role.Editor: {
      return [
        EditOutlined,
        t(Strings.field_permission_editor_lock_tips)
      ];
    }
    default:
    case ConfigConstant.Role.Reader: {
      return [
        EyeNormalOutlined,
        t(Strings.field_permission_reader_lock_tips)
      ];
    }
  }
};

export const FieldPermissionLockEnhance = (props: {
  fieldId: string;
  style?: React.CSSProperties;
  color?: string;
  className?: string;
}) => {
  const colors = useThemeColors();
  const {
    fieldId,
    style,
    color,
  } = props;

  const fieldPermissionMap = useSelector(Selectors.getFieldPermissionMap);

  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);

  if (!fieldPermissionMap || !fieldRole) {
    return null;
  }

  const [Icon, tip] = getFieldLock(fieldPermissionMap[fieldId].manageable ? ConfigConstant.Role.Manager : fieldRole);

  return <>
    <Tooltip content={tip as string}>
      <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ...style }}>
        <Icon color={color || colors.fourthLevelText} />
      </span>
    </Tooltip>
  </>;
};
