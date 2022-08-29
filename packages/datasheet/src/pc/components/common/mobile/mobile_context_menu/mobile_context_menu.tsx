import classnames from 'classnames';
import { FC } from 'react';
import { ContextmenuItem } from '../../contextmenu_item';
import { Message } from 'pc/components/common';
import { Popup } from '../popup';
import styles from './style.module.less';
import { IMobileContextMenuProps } from './interface';

export const MobileContextMenu: FC<IMobileContextMenuProps> = (props) => {
  const { visible, data, height = '90%', title, onClose, params } = props;

  const hiddenItem = (hidden?: boolean | ((args: any) => boolean)) => {
    if (typeof hidden === 'function') {
      hidden({
        props: params
      });
      return;
    }
    return hidden;
  };

  return (
    <Popup
      className={styles.mobileContextMenu}
      height={height}
      visible={visible}
      title={title}
      onClose={() => onClose()}
    >
      <div onClick={onClose}>
        {data.map((group, index) => (
          <div className={styles.group} key={index}>
            {group.map(groupItem => {

              if (!groupItem || hiddenItem(groupItem.hidden) || groupItem.unsupportable) {
                return null;
              }

              return <ContextmenuItem
                key={groupItem.text}
                className={classnames(styles.item, {
                  [styles.warn]: groupItem.isWarn,
                  disabled: groupItem.disabled
                })}
                icon={groupItem.icon}
                name={groupItem.text}
                onClick={groupItem.disabled ? () => {
                  Message.warning({
                    content: groupItem.disabledTip,
                  });
                } : groupItem.onClick}
              />;
            })}
          </div>
        ))}
      </div>
    </Popup>
  );
};
