import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './style.module.less';

interface IMenuItem {
  className?: string;
  active?: boolean;
  label: React.ReactNode;
  value: any;
  onClick?: (value: any) => void;
}
export const MenuItem: React.FC<IMenuItem> = (props) => {
  const { label, value, onClick, active, className } = props;
  return (
    <div className={classNames(
      className,
      styles.permissionSettingMenuItem,
      active && styles.permissionSettingMenuItemActive
    )} onClick={() => onClick?.(value)}>
      {label}
    </div>
  );
};

export const Menu = (props: {
  children: ReactNode[];
  onClick?: () => void;
}) => {
  return (
    <div className={styles.permissionSettingMenu} onClick={props.onClick}>{props.children}</div>
  );
};