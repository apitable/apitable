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
import { useContext } from 'react';
import { Typography, useContextMenu } from '@apitable/components';
import { MoreStandOutlined, UserGroupOutlined } from '@apitable/icons';

import { RoleContext } from '../context';
import { IRoleItem } from '../interface';
import styles from './style.module.less';

export const ROLE_MENU_EDIT_ID = 'ROLE_MENU_EDIT';

export const RoleItem: React.FC<
  React.PropsWithChildren<{
    selected?: boolean;
    role: IRoleItem;
    icon?: React.ReactElement;
    onEdit?: (role: IRoleItem, roleName: string) => void;
    onDelete?: (role: IRoleItem) => void;
    onClick?: (roleId: string) => void;
  }>
> = (props) => {
  const { selected, role, icon, onEdit, onDelete, onClick } = props;
  const { roleName, roleId } = role;
  const { manageable } = useContext(RoleContext);
  const showMore = manageable && (onEdit || onDelete);
  const { show } = useContextMenu({ id: ROLE_MENU_EDIT_ID });

  return (
    <div className={classNames(styles.roleItem, selected && styles.roleItemSelected)} onClick={() => onClick && onClick(roleId)}>
      {icon ? icon : <UserGroupOutlined className={styles.roleItemIcon} size={16} />}
      <Typography className={styles.roleItemContent} ellipsis variant="body3">
        {roleName}
      </Typography>
      {showMore && (
        <div
          onClick={(e) => {
            show(e, {
              roleName,
              role,
              onEdit,
              onDelete,
            });
            e.stopPropagation();
          }}
          style={{ display: 'flex' }}
        >
          <MoreStandOutlined className={styles.roleItemIcon} size={16} />
        </div>
      )}
    </div>
  );
};
