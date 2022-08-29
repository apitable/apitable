
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const InvitecodeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 3H1.5L6 12L9.5 5H11L7 13H9.5L14.5 3H12H8L6 7L4 3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'invitecode_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 3H1.5L6 12L9.5 5H11L7 13H9.5L14.5 3H12H8L6 7L4 3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
