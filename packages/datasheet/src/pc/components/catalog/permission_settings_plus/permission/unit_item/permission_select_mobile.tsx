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
import { useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CheckOutlined } from '@apitable/icons';
import { IRoleOption } from 'pc/components/catalog/permission_settings_plus/permission/unit_item/interface';
import { MobileSelect } from 'pc/components/common';
import styles from './style.module.less';

interface IPermissionSelectProps {
  role: string;
  unitId: string;
  roleOptions: IRoleOption[];
  title?: string;
  onChange?: (unitId: string, role: string) => void;
  onRemove?: (unitId: string) => void;
}

export const PermissionSelectMobile: React.FC<React.PropsWithChildren<IPermissionSelectProps>> = (props) => {
  const { roleOptions, role, onChange, unitId, onRemove, children, title } = props;
  const colors = useThemeColors();
  return (
    <MobileSelect
      title={title}
      triggerComponent={<div className={styles.mobileRoleSelect}>{children}</div>}
      renderList={({ setVisible }) => {
        return (
          <>
            <div className={styles.mobileWrapper}>
              {roleOptions.map((item) => (
                <div
                  className={classNames(styles.mobileOption)}
                  key={item.value}
                  onClick={() => {
                    onChange?.(unitId, item.value);
                    setVisible(false);
                  }}
                >
                  {item.label}
                  {item.value === role && <CheckOutlined color={colors.primaryColor} />}
                </div>
              ))}
            </div>
            {onRemove && (
              <div
                className={classNames(styles.deleteItem, styles.group)}
                onClick={() => {
                  onRemove(unitId);
                }}
              >
                {t(Strings.delete)}
              </div>
            )}
          </>
        );
      }}
    />
  );
};
