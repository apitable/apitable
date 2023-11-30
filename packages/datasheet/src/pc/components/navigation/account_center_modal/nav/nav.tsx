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
import { FC } from 'react';
import * as React from 'react';
import { getElementDataset } from 'pc/utils/dom';
import styles from './style.module.less';

interface INavItem {
  key: string;
  name: string;
  hidden?: boolean;
}

export interface INavProps {
  activeItem: number;
  setActiveItem: React.Dispatch<React.SetStateAction<number>>;
  navlist: INavItem[];
}

export const Nav: FC<React.PropsWithChildren<INavProps>> = (props) => {
  const { activeItem, setActiveItem, navlist } = props;

  const handleClick = (e: React.MouseEvent) => {
    const index = getElementDataset(e.target as HTMLDivElement, 'index');
    if (!index) {
      return;
    }
    const idx = parseInt(index, 10);
    if (idx === activeItem) {
      return;
    }
    setActiveItem(idx);
  };

  return (
    <div onClick={handleClick}>
      {navlist.map((item, index) => {
        return item.hidden ? null : (
          <div
            className={classNames({
              [styles.navItem]: true,
              [styles.activeNavItem]: activeItem === index,
            })}
            key={index}
            data-index={index}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};
