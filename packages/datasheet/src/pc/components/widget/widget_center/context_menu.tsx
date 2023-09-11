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

import { useClickAway } from 'ahooks';
import { useRef, useState, useImperativeHandle } from 'react';
import * as React from 'react';
import { ContextmenuItem } from 'pc/components/common';
import styles from './style.module.less';

export interface IContextMenuItem {
  className?: string;
  icon?: React.ReactElement;
  name: string;
  hidden?: boolean;
  onClick?: (props: any) => void;
}

export interface IContextMenuProps {
  menuData: IContextMenuItem[];
}

export interface IContextMenuMethods {
  show(e: React.MouseEvent, props?: any): void;
}

const ContextMenuBase: React.ForwardRefRenderFunction<{}, IContextMenuProps> = (props, ref) => {
  const { menuData } = props;
  const currentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const currentProps = useRef(null);
  useImperativeHandle(ref, () => ({
    show: (e: React.MouseEvent, props: null) => {
      currentProps.current = props;
      setPos({ top: e.clientY + 10, left: e.clientX + 10 });
      setVisible(true);
    },
  }));

  useClickAway(() => {
    setVisible(false);
  }, currentRef);

  return (
    <>
      {visible && (
        <div
          style={{
            left: pos.left,
            top: pos.top,
          }}
          className={styles.widgetContextMenu}
          ref={currentRef}
        >
          {visible &&
            menuData.map(
              (menu, index) =>
                !menu.hidden && (
                  <ContextmenuItem
                    className={styles.contextMenuItem}
                    key={index}
                    {...menu}
                    onClick={() => {
                      setVisible(false);
                      menu.onClick && menu.onClick(currentProps.current);
                    }}
                  />
                ),
            )}
        </div>
      )}
    </>
  );
};

export const ContextMenu = React.forwardRef(ContextMenuBase);
