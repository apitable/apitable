import React, { CSSProperties } from 'react';
import { PhoneStyled } from './styled';

interface ICellPhone {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellPhone = (props: ICellPhone) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    const url = `tel:${value}`;
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <PhoneStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </PhoneStyled>
  );
};