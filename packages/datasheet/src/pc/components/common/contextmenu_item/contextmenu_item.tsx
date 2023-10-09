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

import classnames from 'classnames';
import { FC } from 'react';
import * as React from 'react';
import { NodeIcon } from 'pc/components/catalog/node_context_menu/node_icons';
import RightArrowIcon from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import styles from './style.module.less';

export interface IContextmenuItemProps {
  className?: string;
  icon?: NodeIcon | React.ReactElement;
  name: string | (() => React.ReactElement);
  shortcutKey?: string;
  arrow?: boolean;
  onClick?: ({ event }: { event: any; triggerEvent: any }) => void;
}

export const ContextmenuItem: FC<React.PropsWithChildren<IContextmenuItemProps>> = ({
  icon,
  name,
  shortcutKey,
  arrow = false,
  onClick,
  className,
  ...rest
}) => {
  return (
    <div
      className={classnames(styles.contextmenuItem, className)}
      onClick={(e) => {
        onClick?.({ event: e, triggerEvent: e });
      }}
      {...rest}
    >
      {icon}
      <div className={styles.name}>{typeof name === 'string' ? name : name()}</div>
      <div className={styles.shortcutKey}>{shortcutKey}</div>
      {arrow && <RightArrowIcon className={styles.arrow} />}
    </div>
  );
};
