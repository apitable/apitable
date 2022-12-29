import React, { CSSProperties } from 'react';

interface ICellText {
  text: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellText = (props: ICellText) => {
  const { text, cellClassName, cellStyle } = props;
  if (!text) {
    return null;
  }
  return (
    <span className={cellClassName} style={cellStyle}>
      {text}
    </span>
  );
};