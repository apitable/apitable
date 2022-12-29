
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const FreezeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 1C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V2C15 1.44772 14.5523 1 14 1H2ZM3 11.238V8.36205L6 4.76205V7.63795L3 11.238ZM4.13504 13H6V10.762L4.13504 13ZM4.86496 3L3 5.23795V3H4.86496ZM8 13H13V3H8V13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'freeze_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 1C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V2C15 1.44772 14.5523 1 14 1H2ZM3 11.238V8.36205L6 4.76205V7.63795L3 11.238ZM4.13504 13H6V10.762L4.13504 13ZM4.86496 3L3 5.23795V3H4.86496ZM8 13H13V3H8V13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
