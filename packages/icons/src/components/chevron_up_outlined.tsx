
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChevronUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 11C11.7 11 11.5 10.9 11.3 10.7L8 7.4L4.7 10.7C4.3 11.1 3.7 11.1 3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3L7.3 5.3C7.7 4.9 8.3 4.9 8.7 5.3L12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7C12.5 10.9 12.3 11 12 11Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_up_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12 11C11.7 11 11.5 10.9 11.3 10.7L8 7.4L4.7 10.7C4.3 11.1 3.7 11.1 3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3L7.3 5.3C7.7 4.9 8.3 4.9 8.7 5.3L12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7C12.5 10.9 12.3 11 12 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
