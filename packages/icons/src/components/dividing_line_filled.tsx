
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const DividingLineFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 7H1V9H10V7ZM15 7H11V9H15V7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'dividing_line_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 7H1V9H10V7ZM15 7H11V9H15V7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
