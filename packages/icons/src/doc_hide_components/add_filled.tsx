
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const AddFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="7.5" cy="8.5" r="6.5" fill={ colors[0] }/>
    <rect x="4" y="8" width="7" height="1" rx="0.5" fill={ colors[1] }/>
    <rect width="7" height="1" rx="0.5" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 5)" fill={ colors[1] }/>

  </>,
  name: 'add_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
