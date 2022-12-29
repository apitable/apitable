
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChevronDownOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 11C7.7 11 7.5 10.9 7.3 10.7L3.3 6.7C2.9 6.3 2.9 5.7 3.3 5.3C3.7 4.9 4.3 4.9 4.7 5.3L8 8.6L11.3 5.3C11.7 4.9 12.3 4.9 12.7 5.3C13.1 5.7 13.1 6.3 12.7 6.7L8.7 10.7C8.5 10.9 8.3 11 8 11Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_down_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 11C7.7 11 7.5 10.9 7.3 10.7L3.3 6.7C2.9 6.3 2.9 5.7 3.3 5.3C3.7 4.9 4.3 4.9 4.7 5.3L8 8.6L11.3 5.3C11.7 4.9 12.3 4.9 12.7 5.3C13.1 5.7 13.1 6.3 12.7 6.7L8.7 10.7C8.5 10.9 8.3 11 8 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
