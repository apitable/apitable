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

import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { IAvatarProps } from './interface';
import { Box } from 'components';
import { AvatarChildWrapper, AvatarSizeConfig, AvatarWrapper } from './styled';

export const Avatar: FC<React.PropsWithChildren<IAvatarProps>> = ({
  size = 'm',
  icon,
  src,
  alt,
  children,
  style,
  shape = 'circle',
  onClick
}) => {
  const avatarNodeRef = useRef<HTMLSpanElement>(null);
  const avatarChildrenRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  let childrenToRender;
  if (typeof src === 'string') {
    childrenToRender = (
      <Box
        as="img"
        width="100%"
        height="100%"
        src={src}
        alt={alt}
        display="flex"
      />
    );
  } else if (icon) {
    childrenToRender = React.isValidElement(icon)
      ? React.cloneElement<any>(icon, {
        size: AvatarSizeConfig[size].size * 0.6,
        color: (style && style.color) || '#fff',
        className: 'avatar-icon'
      })
      : icon;
  } else {
    childrenToRender = (
      <AvatarChildWrapper
        ref={avatarChildrenRef}
        style={{ transform: `scale(${scale}) translateX(-50%)` }}
      >
        {children}
      </AvatarChildWrapper>
    );
  }

  useLayoutEffect(() => {
    const scale = () => {
      if (typeof src === 'string' || icon) return 1;
      if (!avatarChildrenRef.current || !avatarNodeRef.current) return 1;
      const childrenWidth = avatarChildrenRef.current?.offsetWidth;
      const gap = AvatarSizeConfig[size].gap;
      const nodeWidth = avatarNodeRef.current?.offsetWidth - gap;
      return nodeWidth < childrenWidth ? nodeWidth / childrenWidth : 1;
    };
    setScale(scale());
  }, [src, icon, size]);

  const wrapperProps = { size, src, shape, icon, style, onClick };

  return (
    <AvatarWrapper {...wrapperProps} ref={avatarNodeRef}>
      {childrenToRender}
    </AvatarWrapper>
  );
};
