import styles from './style.module.css';
import { ITag } from './interface';
import cls from 'classnames';

export const Tag = (props: ITag) => {
  const { children, closable, onClose, icon, color, className } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <img src={icon} alt="" />;
    }
    return icon;
  };

  return (
    <span className={cls({
      [styles.tag]: true,
      [styles.tagDefault]: !color,
    }, className)}>
      {renderIcon()}
      <span>{children}</span>
      {closable && <span onClick={handleClose}>x</span>}
    </span>
  );
};