
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const TextLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 4C1 3.44772 1.44772 3 2 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H2C1.44772 5 1 4.55228 1 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM2 11C1.44772 11 1 11.4477 1 12C1 12.5523 1.44772 13 2 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H2Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'text_left_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1 4C1 3.44772 1.44772 3 2 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H2C1.44772 5 1 4.55228 1 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM2 11C1.44772 11 1 11.4477 1 12C1 12.5523 1.44772 13 2 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H2Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
