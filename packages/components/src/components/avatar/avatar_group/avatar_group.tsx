import React, { cloneElement, FC, ReactElement } from 'react';
import { IAvatarGroup } from './intarface';
import { AvatarGroupStyled } from './styled';
import { Avatar } from '../index';

export const AvatarGroup: FC<IAvatarGroup> = ({
  max = 5, children, maxStyle, size
}) => {
  const childrenArr = (Array.isArray(children) ? children : [children]).map((child, index) =>
    cloneElement((child as ReactElement), {
      key: `avatar-key-${index}`,
      size,
    }),
  );
  const numOfChildren = childrenArr.length;
  const isHidden = numOfChildren > max;
  const childrenShow = isHidden ? childrenArr.slice(0, max) : children;
  return (
    <AvatarGroupStyled size={size}>
      {childrenShow}
      {isHidden && <Avatar style={maxStyle} size={size}>+{numOfChildren - max}</Avatar>}
    </AvatarGroupStyled>
  );
};