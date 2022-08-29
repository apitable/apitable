import React, { CSSProperties } from 'react';
import { EmailStyled } from './styled';

interface ICellEmail {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellEmail = (props: ICellEmail) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    const url = `mailto:${value}`;
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <EmailStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </EmailStyled>
  );
};