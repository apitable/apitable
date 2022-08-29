import { FC } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import styles from './style.module.less';
import { getElementDataset } from 'pc/utils';

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

export const Nav: FC<INavProps> = props => {
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
    <div
      onClick={handleClick}
    >
      {navlist.map((item, index) => 
      {
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
      }
      )}
    </div>
  );
};
