
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const LeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="16" height="16" rx="8" transform="matrix(-1 0 0 1 16 0)" fill={ colors[0] }/>
    <path d="M9.19908 4.98301L6.18209 8L9.19908 11.017" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'left_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M9.19908 4.98301L6.18209 8L9.19908 11.017'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
