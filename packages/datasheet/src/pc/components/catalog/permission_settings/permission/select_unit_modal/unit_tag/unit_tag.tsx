import { FC } from 'react';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common';
import CloseIcon from 'static/icon/datasheet/datasheet_icon_exit.svg';
import styles from './style.module.less';
import classNames from 'classnames';

export interface IUnitTagProps {
  unitId: string;
  avatar: string;
  name: string;
  title?: string | JSX.Element;
  isTeam?: boolean;
  className?: string;
  deletable?: boolean;
  onClose?: (id: string) => void;
  isLeave?: boolean;
}

export const UnitTag: FC<IUnitTagProps> = props => {
  const { deletable = true, avatar, name, isTeam = false, onClose, unitId, isLeave, title } = props;
  return (
    <div className={classNames(styles.unitTag, props.className, { [styles.isLeave]: isLeave })}>
      <div className={classNames([styles.wrapper, isTeam ? styles.rect : styles.circle])}>
        <Avatar
          id={unitId}
          src={avatar}
          title={name}
          size={AvatarSize.Size20}
          type={isTeam ? AvatarType.Team : AvatarType.Member}
        />
        <div className={styles.name}>{title || name}</div>
        {
          deletable &&
          <CloseIcon className={styles.closeBtn} width={8} height={8} onClick={() => onClose && onClose(unitId)} />
        }
      </div>
    </div>
  );
};
