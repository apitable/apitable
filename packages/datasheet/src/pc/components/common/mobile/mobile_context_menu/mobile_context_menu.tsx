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
import { Message } from 'pc/components/common';
import { ContextmenuItem } from '../../contextmenu_item';
import { Popup } from '../popup';
import { IMobileContextMenuProps } from './interface';
import styles from './style.module.less';

export const MobileContextMenu: FC<React.PropsWithChildren<IMobileContextMenuProps>> = (props) => {
  const { visible, data, height = '90%', title, onClose, params } = props;

  const hiddenItem = (hidden?: boolean | ((args: any) => boolean)) => {
    if (typeof hidden === 'function') {
      hidden({
        props: params,
      });
      return;
    }
    return hidden;
  };

  return (
    <Popup className={styles.mobileContextMenu} height={height} open={visible} title={title} onClose={() => onClose()}>
      <div onClick={onClose}>
        {data.map((group: any, index: number) => (
          <div className={styles.group} key={index}>
            {group.map((groupItem: any) => {
              if (!groupItem || hiddenItem(groupItem.hidden) || groupItem.unsupportable) {
                return null;
              }

              return (
                <ContextmenuItem
                  key={groupItem.text}
                  className={classnames(styles.item, {
                    [styles.warn]: groupItem.isWarn,
                    disabled: groupItem.disabled,
                  })}
                  icon={groupItem.icon}
                  name={groupItem.text}
                  onClick={
                    groupItem.disabled
                      ? () => {
                        Message.warning({
                          content: groupItem.disabledTip,
                        });
                      }
                      : groupItem.onClick
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </Popup>
  );
};
