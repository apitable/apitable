import { FC, useState } from 'react';
import { Popover } from 'antd';
import styles from './style.module.less';
import { ContextmenuItem } from 'pc/components/common';

export interface ITrashContextMenuProps {
  nodeId: string;
  data: any[];
}

export const TrashContextMenu: FC<ITrashContextMenuProps> = ({
  children,
  nodeId,
  data,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      overlayClassName={styles.trashContextMenu}
      content={data.map(item => <div key={item.text} onClick={() => { setVisible(false); item.onClick && item.onClick(nodeId); }}>
        <ContextmenuItem icon={item.icon} name={item.text} />
      </div>)}
      trigger="click"
      visible={visible}
      arrowPointAtCenter={false}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      onVisibleChange={visible => setVisible(visible)}
      destroyTooltipOnHide={{ keepParent: false }}
      align={{
        points: ['tl', 'bl'],
      }}
    >
      <div>{children}</div>
    </Popover>
  );
};
