
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChevronLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 13C9.7 13 9.5 12.9 9.3 12.7L5.3 8.7C4.9 8.3 4.9 7.7 5.3 7.3L9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3C11.1 3.7 11.1 4.3 10.7 4.7L7.4 8L10.7 11.3C11.1 11.7 11.1 12.3 10.7 12.7C10.5 12.9 10.3 13 10 13Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_left_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 13C9.7 13 9.5 12.9 9.3 12.7L5.3 8.7C4.9 8.3 4.9 7.7 5.3 7.3L9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3C11.1 3.7 11.1 4.3 10.7 4.7L7.4 8L10.7 11.3C11.1 11.7 11.1 12.3 10.7 12.7C10.5 12.9 10.3 13 10 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
