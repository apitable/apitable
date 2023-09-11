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

import { Popover } from 'antd';
import { FC, useState } from 'react';
import { ContextmenuItem } from 'pc/components/common';
import styles from './style.module.less';

export interface ITrashContextMenuProps {
  nodeId: string;
  data: any[];
}

export const TrashContextMenu: FC<React.PropsWithChildren<ITrashContextMenuProps>> = ({ children, nodeId, data }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      overlayClassName={styles.trashContextMenu}
      content={data.map((item) => (
        <div
          key={item.text}
          onClick={() => {
            setVisible(false);
            item.onClick && item.onClick(nodeId);
          }}
        >
          <ContextmenuItem icon={item.icon} name={item.text} />
        </div>
      ))}
      trigger="click"
      visible={visible}
      arrowPointAtCenter={false}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      onVisibleChange={(visible) => setVisible(visible)}
      destroyTooltipOnHide={{ keepParent: false }}
      align={{
        points: ['tl', 'bl'],
      }}
    >
      <div>{children}</div>
    </Popover>
  );
};
