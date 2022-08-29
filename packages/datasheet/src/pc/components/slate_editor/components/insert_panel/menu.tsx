import { FC } from 'react';
import * as React from 'react';

import styles from './style.module.less';

type TMenuItem = { value: string, option: React.ReactNode };

export enum MenuType {
  FORMAT = 'format',
  MEDIA = 'media',
}

interface IMenuGroup {
  weight: number;
  title: string;
  type: MenuType;
  list: Array<TMenuItem>
}

interface IMenuProps {
  menus: IMenuGroup[];
  active: string;
  onMenuClick: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const Menu: FC<IMenuProps> = (({ menus, active, onMenuClick }) => {

  const lastMenuGroupIdx = menus.length - 1;

  const renderMenuGroup = (list: Array<TMenuItem>, groupIndex: number) => {
    return <ul className={styles.menuGroup} data-is-last={lastMenuGroupIdx === groupIndex}>
      {
        list.map((item, menuIdx) => {
          const key = `${groupIndex}-${menuIdx}`;
          return <li
            className={styles.menuItem}
            // 防止编辑器失焦
            onMouseDown={onMenuClick}
            data-active={key === active}
            key={key}
            data-key={key}>{item.option}</li>;
        })
      }
    </ul>;
  };

  return <dl className={styles.menuWrap}>
    {
      menus.map((menuGroupItem, groupIndex) => <dd key={menuGroupItem.title}>
        {/* <h5 className={styles.menuTitle}>{menuGroupItem.title}</h5> */}
        {renderMenuGroup(menuGroupItem.list, groupIndex)}
      </dd>)
    }
  </dl>;
});