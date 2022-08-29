import React, { CSSProperties } from 'react';
import { Emoji } from './emoji';
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
      {new Array(field.max).fill(null).map((key, index) => (
        <RatingItemStyled key={index} checked={count ? index < count : false} className={cellClassName} style={cellStyle}>
          <Emoji emoji={field.icon} size={16} />
        </RatingItemStyled>
      ))}
    </RatingStyled>
  );
};