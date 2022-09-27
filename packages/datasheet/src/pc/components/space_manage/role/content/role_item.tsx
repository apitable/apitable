import { DeleteOutlined, EditOutlined, MoreStandOutlined, MultiplemembersFilled } from '@vikadata/icons';
import { ContextMenu, Typography, useContextMenu } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { useContext } from 'react';
import classNames from 'classnames';

import { RoleContext } from '../context';
import { IRoleItem } from '../interface';
import styles from './style.module.less';
import { expandEditRoleModal } from './edit_role_modal';
import { flatContextData } from 'pc/utils';

const ROLE_MENU_EDIT_ID = 'ROLE_MENU_EDIT';

export const RoleItem: React.FC<{
  selected?: boolean;
  role: IRoleItem;
  icon?: React.ReactElement;
  roleNameArray?: string[];
  onEdit?: (role: IRoleItem, roleName: string) => void;
  onDelete?: (role: IRoleItem) => void;
  onClick?: (roleId: string) => void;
}> = props => {
  const { selected, role, icon, roleNameArray = [], onEdit, onDelete, onClick } = props;
  const { roleName, roleId } = role;
  const { manageable } = useContext(RoleContext);
  const showMore = manageable && (onEdit || onDelete);
  const { show } = useContextMenu({ id: ROLE_MENU_EDIT_ID });
  const menuData = [
    [
      {
        icon: <EditOutlined/>,
        text: t(Strings.role_context_item_rename),
        onClick: () => {
          expandEditRoleModal({
            value: roleName,
            title: t(Strings.rename_role_title),
            onChange: value => onEdit?.(role, value),
            existed: roleNameArray,
          });
        },
        hidden: !onEdit,
      },
      {
        icon: <DeleteOutlined/>,
        text: t(Strings.role_context_item_delete),
        onClick: () => {
          onDelete?.(role);
        },
        hidden: !onDelete,
      }
    ]
  ];
  return (
    <div className={classNames(styles.roleItem, selected && styles.roleItemSelected)} onClick={() => onClick && onClick(roleId)}>
      {icon ? icon : <MultiplemembersFilled className={styles.roleItemIcon} size={16} />}
      <Typography className={styles.roleItemContent} ellipsis variant="body3">
        {roleName}
      </Typography>
      {showMore && (
        <div onClick={show}>
          <MoreStandOutlined className={styles.roleItemIcon} size={16} />
        </div>
      )}
      <ContextMenu overlay={flatContextData(menuData, true)} menuId={ROLE_MENU_EDIT_ID} />
    </div>
  );
};
