
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const TextMiddleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 4C4 3.44772 4.44772 3 5 3H11C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5H5C4.44772 5 4 4.55228 4 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'text_middle_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 4C4 3.44772 4.44772 3 5 3H11C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5H5C4.44772 5 4 4.55228 4 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
