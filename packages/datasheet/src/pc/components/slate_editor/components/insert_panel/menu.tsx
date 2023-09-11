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

import { FC } from 'react';
import * as React from 'react';

import styles from './style.module.less';

type TMenuItem = { value: string; option: React.ReactNode };

export enum MenuType {
  FORMAT = 'format',
  MEDIA = 'media',
}

interface IMenuGroup {
  weight: number;
  title: string;
  type: MenuType;
  list: Array<TMenuItem>;
}

interface IMenuProps {
  menus: IMenuGroup[];
  active: string;
  onMenuClick: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const Menu: FC<React.PropsWithChildren<IMenuProps>> = ({ menus, active, onMenuClick }) => {
  const lastMenuGroupIdx = menus.length - 1;

  const renderMenuGroup = (list: Array<TMenuItem>, groupIndex: number) => {
    return (
      <ul className={styles.menuGroup} data-is-last={lastMenuGroupIdx === groupIndex}>
        {list.map((item, menuIdx) => {
          const key = `${groupIndex}-${menuIdx}`;
          return (
            <li
              className={styles.menuItem}
              // Prevent the editor from losing focus
              onMouseDown={onMenuClick}
              data-active={key === active}
              key={key}
              data-key={key}
            >
              {item.option}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <dl className={styles.menuWrap}>
      {menus.map((menuGroupItem, groupIndex) => (
        <dd key={menuGroupItem.title}>
          {/* <h5 className={styles.menuTitle}>{menuGroupItem.title}</h5> */}
          {renderMenuGroup(menuGroupItem.list, groupIndex)}
        </dd>
      ))}
    </dl>
  );
};
