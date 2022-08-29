import { compact } from 'lodash';
import React, { CSSProperties } from 'react';
import { Emoji } from '../cell_rating/emoji';
import { CheckboxStyled, CheckboxWrapperStyled } from './styled';

interface ICellCheckbox {
  field: {
    icon: string
  };
  checked: boolean | boolean[];
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellCheckbox = (props: ICellCheckbox) => {
  const { field, checked, className, style, cellClassName, cellStyle } = props;
  const renderCheckbox = (status: boolean, idx?: number) => (
    <CheckboxStyled checked={status} className={cellClassName} style={cellStyle}>
      <Emoji emoji={field.icon} size={16} />
    </CheckboxStyled>
  );
  return Array.isArray(checked) ? (
    <CheckboxWrapperStyled className={className} style={style}>
      {compact(checked).map(renderCheckbox)}
    </CheckboxWrapperStyled>
  ) : renderCheckbox(checked);
};