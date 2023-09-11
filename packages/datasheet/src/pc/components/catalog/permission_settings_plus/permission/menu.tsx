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
import { ReactNode } from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import styles from './style.module.less';

interface IMenuItem {
  className?: string;
  item: {
    label: React.ReactNode;
    subLabel?: string;
    value: any;
  };
  active?: boolean;
  option?: {
    labelColor?: string;
  };
  onClick?: (value: any) => void;
}
export const MenuItem: React.FC<React.PropsWithChildren<IMenuItem>> = (props) => {
  const { item, option, onClick, active, className } = props;
  const { label, value, subLabel } = item;
  const colors = useThemeColors();
  return (
    <div
      className={classNames(className, styles.permissionSettingMenuItem, active && styles.permissionSettingMenuItemActive)}
      onClick={() => onClick?.(value)}
    >
      <Typography color={option?.labelColor || colors.textCommonPrimary} variant="body2">
        {label}
      </Typography>
      <Typography variant="body4" color={colors.textCommonTertiary}>
        {subLabel}
      </Typography>
    </div>
  );
};

export const Menu = (props: { children: ReactNode[]; onClick?: () => void }) => {
  return (
    <div className={styles.permissionSettingMenu} onClick={props.onClick}>
      {props.children}
    </div>
  );
};
