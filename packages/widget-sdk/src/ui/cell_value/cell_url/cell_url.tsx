import React, { CSSProperties } from 'react';
import { UrlStyled } from './styled';

interface ICellUrl {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellUrl = (props: ICellUrl) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    let url = '';
    try {
      // use URL Verifying Address Legitimacy with URL Constructors.
      const testURL = new URL(value);
      if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
        url = testURL.href;
      } else {
        console.log('error', 'Illegal links');
        return;
      }
    } catch (error) {
      // No protocol header, add http protocol header by default.
      try {
        const testURL = new URL(`http://${value}`);
        url = testURL.href;
      } catch (error) {
        console.log('error', 'Illegal links');
        return;
      }
    }
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <UrlStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </UrlStyled>
  );
};