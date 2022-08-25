import { FC, ReactNode } from 'react';
import cls from 'classnames';

import { CloseMiddleOutlined } from '@vikadata/icons';

import { ITag } from './interface';

import styles from './style.module.less';

export const Tag: FC<ITag> = ({
  children,
  closable,
  icon,
  color,
  className,
  childrenInDangerHTML,
  onClose,
}) => {
  const handleClose = (e) => {
    onClose && onClose(e);
  };

  const renderIcon = (icon?: string | ReactNode) => {
    if (!icon) {
      return null;
    }
    const iconEle = typeof icon === 'string' ? <img src={icon} alt="" /> : icon;
    return <div className={styles.tagIcon}>{iconEle}</div>;
  };

  return (
    <span className={cls({
      [styles.tag]: true,
      [styles.tagDefault]: !color,
    }, className)}>
      {renderIcon(icon)}
      {childrenInDangerHTML ? <div dangerouslySetInnerHTML={{ __html: (children as string) }} /> : <span>{children}</span>}
      {closable && <span className={styles.tagClose} onClick={handleClose}><CloseMiddleOutlined /></span>}
    </span>
  );
};