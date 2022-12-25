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

import React, { CSSProperties } from 'react';
import { LinkStyled, LinkWrapperStyled } from './styled';

interface ICellLink {
  options: {
    recordId: string;
    title: string;
  }[] | null;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellLink = (props: ICellLink) => {
  const { options, className, style, cellClassName, cellStyle } = props;
  if (!options) {
    return null;
  }
  return (
    <LinkWrapperStyled className={className} style={style}>
      {options.map(opt => (
        <LinkStyled className={cellClassName} style={cellStyle} key={opt.recordId}>
          {opt.title}
        </LinkStyled>
      ))}
    </LinkWrapperStyled>
  );
};