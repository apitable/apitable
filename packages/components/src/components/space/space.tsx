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

import React from 'react';
import { ISpaceProps } from './interface';
import { SpaceStyled, SpaceItemStyled, SplitStyled } from './styled';

// Temporarily used for component layout in documents
export const Space: React.FC<React.PropsWithChildren<ISpaceProps>> = props => {
  const { component = 'div', children, split, ...restProps } = props;
  
  return (
    <SpaceStyled as={component as any} {...restProps}>
      {Array.isArray(children) ? children.map((child, index) => (
        <SpaceItemStyled key={index}>
          {index !== 0 && split && <SplitStyled size={restProps.size} />}
          {child}
        </SpaceItemStyled>
      )) : children}
    </SpaceStyled>
  );
};