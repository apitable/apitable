
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ColumnSingleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8.4 9.96667C8.2 10.2333 7.8 10.2333 7.6 9.96667L5.60002 7.3C5.35281 6.97038 5.588 6.5 6.00002 6.5H10C10.412 6.5 10.6472 6.97038 10.4 7.3L8.4 9.96667Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_single_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8.4 9.96667C8.2 10.2333 7.8 10.2333 7.6 9.96667L5.60002 7.3C5.35281 6.97038 5.588 6.5 6.00002 6.5H10C10.412 6.5 10.6472 6.97038 10.4 7.3L8.4 9.96667Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
