import * as React from 'react';
import { AvatarSize } from '../avatar';
import classNames from 'classnames';
import styles from '../style.module.less';

export interface IAvatarBaseProps {
  size?: AvatarSize;
  style?: React.CSSProperties;
  shape?: 'circle' | 'square';
  src?: string;
  className?: string;
}

export const AvatarBase: React.FC<IAvatarBaseProps> = ({
  src,
  size = AvatarSize.Size32,
  style,
  shape = 'circle',
  children,
  className,
}) => {
  return (
    <span
      style={{
        backgroundImage: src ? `url(${src})` : undefined,
        fontSize: size / 2,
        width: size,
        height: size,
        ...style,
        borderRadius: shape === 'square' ? '4px' : '50%',
      }}
      className={classNames(styles.avatar, className)}
    >
      {children}
    </span>
  );
};
