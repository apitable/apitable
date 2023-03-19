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
import { Emoji } from '../../_private/emoji';
import { RatingItemStyled, RatingStyled } from './styled';

interface ICellRating {
  field: {
    max: number;
    icon: string;
  };
  count: number | null;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellRating = (props: ICellRating) => {
  const { field, count, className, style, cellClassName, cellStyle } = props;
  return (
    <RatingStyled className={className} style={style}>
      {new Array(field.max).fill(null).map((_key, index) => (
        <RatingItemStyled key={index} checked={count ? index < count : false} className={cellClassName} style={cellStyle}>
          <Emoji emoji={field.icon} size={16} />
        </RatingItemStyled>
      ))}
    </RatingStyled>
  );
};