import { DeleteOutlined, EditOutlined, MoreStandOutlined, MultiplemembersFilled } from '@vikadata/icons';
import { stopPropagation, Typography } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { ContextmenuItem } from 'pc/components/common';
import { Dropdown } from 'antd';
import { useContext } from 'react';
import classNames from 'classnames';

import { RoleContext } from '../context';
import { IRoleItem } from '../interface';
import styles from './style.module.less';
import { expandEditRoleModal } from './edit_role_modal';

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
  return (
    <div className={classNames(styles.roleItem, selected && styles.roleItemSelected)} onClick={() => onClick && onClick(roleId)}>
      {icon ? icon : <MultiplemembersFilled className={styles.roleItemIcon} size={16} />}
      <Typography className={styles.roleItemContent} ellipsis variant="body3">
        {roleName}
      </Typography>
      {showMore && (
        <div onClick={stopPropagation}>
          <Dropdown
            overlayStyle={{
              minWidth: 'auto',
              right: 0,
            }}
            placement={'bottomLeft'}
            trigger={['click']}
            overlay={
              <div className={styles.roleItemMenu}>
                {onEdit && (
                  <ContextmenuItem
                    icon={<EditOutlined />}
                    name={t(Strings.role_context_item_rename)}
                    onClick={() =>
                      expandEditRoleModal({
                        value: roleName,
                        title: t(Strings.rename_role_title),
                        onChange: value => onEdit(role, value),
                        existed: roleNameArray,
                      })
                    }
                  />
                )}
                {onDelete && <ContextmenuItem icon={<DeleteOutlined />} name={t(Strings.role_context_item_delete)} onClick={() => onDelete(role)} />}
              </div>
            }
          >
            <MoreStandOutlined className={styles.roleItemIcon} size={16} />
          </Dropdown>
        </div>
      )}
    </div>
  );
};
