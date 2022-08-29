import { FC } from 'react';
import * as React from 'react';
import { NodeIcon } from 'pc/components/catalog/node_context_menu/node_icons';
import styles from './style.module.less';
import RightArrowIcon from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import classnames from 'classnames';

export interface IContextmenuItemProps {
  className?: string;
  icon?: NodeIcon | React.ReactElement;
  name: string;
  shortcutKey?: string;
  arrow?: boolean;
  onClick?: ({ event }: { event: any, triggerEvent: any }) => void;
}

export const ContextmenuItem: FC<IContextmenuItemProps> = ({
  icon,
  name,
  shortcutKey,
  arrow = false,
  onClick,
  className,
  ...rest
}) => {
  return (
    <div className={classnames(styles.contextmenuItem, className)} onClick={(e) => {onClick?.({ event: e, triggerEvent: e });}}
      {...rest}>
      {icon}
      <div className={styles.name}>{name}</div>
      <div className={styles.shortcutKey}>{shortcutKey}</div>
      {arrow && <RightArrowIcon className={styles.arrow} />}
    </div>
  );
};
