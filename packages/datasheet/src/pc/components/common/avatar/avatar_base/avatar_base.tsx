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

import classNames from 'classnames';
import * as React from 'react';
import { AvatarSize } from '../avatar';
import styles from '../style.module.less';

export interface IAvatarBaseProps {
  size?: AvatarSize;
  style?: React.CSSProperties;
  shape?: 'circle' | 'square';
  src?: string;
  className?: string;
}

export const AvatarBase: React.FC<React.PropsWithChildren<IAvatarBaseProps>> = ({
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
