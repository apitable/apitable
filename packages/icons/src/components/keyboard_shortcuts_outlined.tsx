
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const KeyboardShortcutsOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2H2ZM3 12V4H13V12H3ZM5 9C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11H11C11.5523 11 12 10.5523 12 10C12 9.44772 11.5523 9 11 9H5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'keyboard_shortcuts_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2H2ZM3 12V4H13V12H3ZM5 9C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11H11C11.5523 11 12 10.5523 12 10C12 9.44772 11.5523 9 11 9H5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
