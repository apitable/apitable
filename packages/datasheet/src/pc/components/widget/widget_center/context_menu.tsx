import { ContextmenuItem } from 'pc/components/common';
import { useRef, useState, useImperativeHandle } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { useClickAway } from 'ahooks';

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
  show(e: React.MouseEvent, props?: any): void
}

const ContextMenuBase: React.ForwardRefRenderFunction<{}, IContextMenuProps> = (props, ref) => {
  const { menuData } = props;
  const currentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const currentProps = useRef(null);
  useImperativeHandle(ref, () => ({
    show: (e: React.MouseEvent, props) => {
      currentProps.current = props;
      setPos({ top: e.clientY + 10, left: e.clientX + 10 });
      setVisible(true);
    }
  }));

  useClickAway((e) => {
    setVisible(false);
  }, currentRef);

  return (
    <>
      { visible && <div style={{
        left: pos.left,
        top: pos.top
      }} className={styles.widgetContextMenu} ref={currentRef}>
        {
          visible && menuData.map((menu, index) => !menu.hidden &&
          <ContextmenuItem className={styles.contextMenuItem} key={index} {...menu} onClick={() => {
            setVisible(false);
            menu.onClick && menu.onClick(currentProps.current);
          }}/>)
        }
      </div> }
    </>
  );
};

export const ContextMenu = React.forwardRef(ContextMenuBase);
