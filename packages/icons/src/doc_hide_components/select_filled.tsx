
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const SelectFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="1" y="1" width="14" height="14" rx="7" stroke={ colors[0] } strokeWidth="1.5"/>
    <rect x="4" y="4" width="8" height="8" rx="4" fill={ colors[0] }/>

  </>,
  name: 'select_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
