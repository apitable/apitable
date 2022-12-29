
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const TextRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 4C7 3.44772 7.44772 3 8 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H8C7.44772 5 7 4.55228 7 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H14C14.5523 13 15 12.5523 15 12C15 11.4477 14.5523 11 14 11H6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'text_right_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7 4C7 3.44772 7.44772 3 8 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H8C7.44772 5 7 4.55228 7 4ZM1 8C1 7.44772 1.44772 7 2 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H2C1.44772 9 1 8.55228 1 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H14C14.5523 13 15 12.5523 15 12C15 11.4477 14.5523 11 14 11H6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
