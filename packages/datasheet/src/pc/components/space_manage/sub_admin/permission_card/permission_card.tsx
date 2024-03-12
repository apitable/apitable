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

import { Checkbox } from 'antd';
import { FC } from 'react';
import { Strings, t, IReduxState } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { isSocialDingTalk, isSocialPlatformEnabled, isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

interface IPermissionCardProps {
  defaultChecked?: string[];
  checked?: string[];
  onChange?: (value: string, checked: boolean) => void;
  inRead?: boolean;
}

export const PermissionCard: FC<React.PropsWithChildren<IPermissionCardProps>> = ({ defaultChecked, checked, onChange, inRead }) => {
  const spaceInfo = useAppSelector((state: IReduxState) => state.space.curSpaceInfo);

  const onCheckChange = (value: string, checked: boolean) => {
    if (onChange) {
      onChange(value, checked);
    }
  };
  const checkData = [
    {
      title: t(Strings.add_sub_admin_title_workbench),
      key: 'workbench',
      desc: t(Strings.add_sub_admin_workbench_configuration),
      checkList: [
        {
          name: t(Strings.role_permission_manage_workbench),
          value: 'MANAGE_WORKBENCH',
          disabled: false,
        },
      ],
    },
    {
      title: t(Strings.add_sub_admin_title_member_team),
      desc: t(Strings.add_sub_admin_contacts_configuration),
      key: 'address',
      checkList: [
        {
          name: t(Strings.role_permission_manage_team),
          value: 'MANAGE_TEAM',
          disabled: !spaceInfo || (isSocialPlatformEnabled?.(spaceInfo) && !isSocialDingTalk?.(spaceInfo) && !isSocialWecom?.(spaceInfo)),
        },
        {
          name: t(Strings.role_permission_manage_member),
          value: 'MANAGE_MEMBER',
          disabled: !spaceInfo || (isSocialPlatformEnabled?.(spaceInfo) && !isSocialDingTalk?.(spaceInfo) && !isSocialWecom?.(spaceInfo)),
        },
        {
          name: t(Strings.role_permission_manage_role),
          value: 'MANAGE_ROLE',
          disabled: !spaceInfo || (isSocialPlatformEnabled?.(spaceInfo) && !isSocialDingTalk?.(spaceInfo) && !isSocialWecom?.(spaceInfo)),
        },
      ],
    },
    {
      title: t(Strings.company_security),
      desc: t(Strings.add_sub_admin_permissions_configuration),
      key: 'security',
      checkList: [
        {
          name: t(Strings.role_permission_manage_security),
          value: 'MANAGE_SECURITY',
          disabled: false,
        },
      ],
    },
    {
      title: t(Strings.more_setting),
      desc: t(Strings.more_setting_tip),
      key: 'shelfManage',
      checkList: [
        {
          name: t(Strings.manage_template_center),
          value: 'MANAGE_TEMPLATE',
          disabled: false,
        },
        {
          name: t(Strings.manage_widget_center),
          value: 'MANAGE_WIDGET',
          disabled: false,
        },
      ],
    },
  ];

  return (
    <div className={styles.cardWrap}>
      {checkData.map((item) => (
        <div className={styles.permissionCard} key={item.key}>
          <div className={styles.title}>
            <span>{item.title}</span>
            <Tooltip title={item.desc} placement="top" trigger="click" showTipAnyway>
              <span>
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          </div>
          <div className={styles.checkboxWrap}>
            {item.checkList.map((_item) => (
              <div className={styles.checkboxItem} key={_item.value} style={{ width: `${100 / item.checkList.length}%` }}>
                <Checkbox
                  onChange={(e) => onCheckChange(e.target.value, e.target.checked)}
                  value={_item.value}
                  defaultChecked={defaultChecked ? defaultChecked.includes(_item.value) : undefined}
                  checked={checked ? checked.includes(_item.value) : undefined}
                  disabled={Boolean(inRead || _item.disabled)}
                >
                  {_item.name.toString()}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
