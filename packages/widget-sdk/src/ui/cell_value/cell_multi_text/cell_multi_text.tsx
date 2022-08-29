import React, { CSSProperties } from 'react';
import { CellEnhanceText } from '../cell_enhance_text';

interface ICellMultiText {
  text: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellMultiText = (props: ICellMultiText) => {
  const { text, cellClassName, cellStyle } = props;
  if (!text) {
    return null;
  }
  const multiTexts = text.split(/\n/g);
  return (
    <div className={cellClassName} style={cellStyle}>
      {multiTexts.map((multiText, index) => (
        <CellEnhanceText key={index} text={multiText} />
      ))}
    </div>
  );
};