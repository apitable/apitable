import { string2Segment, SegmentType } from '@vikadata/core';
import React, { CSSProperties } from 'react';
import { CellEmail } from '../cell_email';
import { CellText } from '../cell_text';
import { CellUrl } from '../cell_url';

interface ICellEnhanceText {
  text: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellEnhanceText = (props: ICellEnhanceText) => {
  const { text, cellClassName, cellStyle } = props;
  if (!text) {
    return null;
  }
  const enhanceTexts = string2Segment(text);
  return (
    <div className={cellClassName} style={cellStyle}>
      {enhanceTexts.map((enhanceText, index) => {
        if (enhanceText.type === SegmentType.Url) {
          return <CellUrl key={index} value={enhanceText.link} />;
        }
        if (enhanceText.type === SegmentType.Email) {
          return <CellEmail key={index} value={enhanceText.link} />;
        }
        return <CellText key={index} text={enhanceText.text}/>;
      })}
    </div>
  );
};