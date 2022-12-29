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