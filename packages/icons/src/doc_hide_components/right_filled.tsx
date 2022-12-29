
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const RightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="16" height="16" rx="8" fill={ colors[0] }/>
    <path d="M6.80092 4.98301L9.81791 8L6.80092 11.017" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'right_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M6.80092 4.98301L9.81791 8L6.80092 11.017'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
