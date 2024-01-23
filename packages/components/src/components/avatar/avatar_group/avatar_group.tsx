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

import React, { cloneElement, FC, ReactElement } from 'react';
import { IAvatarGroup } from './interface';
import { AvatarGroupStyled } from './styled';
import { Avatar } from '../index';
import { Popover } from 'antd';

export const AvatarGroup: FC<React.PropsWithChildren<IAvatarGroup>> = ({ max = 5, children, maxStyle, size, popoverContent }) => {
  const childrenArr = (Array.isArray(children) ? children : [children]).map((child, index) =>
    cloneElement(child as ReactElement, {
      key: `avatar-key-${index}`,
      size,
    })
  );

  const numOfChildren = childrenArr.length;
  const isOverMax = numOfChildren > max;
  const childrenShow = isOverMax ? childrenArr.slice(0, max) : children;

  return (
    <AvatarGroupStyled size={size}>
      {childrenShow}
      {isOverMax && (
        <Popover trigger="click" placement="bottomRight" content={popoverContent}>
          <Avatar style={maxStyle} size={size}>
            +{numOfChildren - max}
          </Avatar>
        </Popover>
      )}
    </AvatarGroupStyled>
  );
};
