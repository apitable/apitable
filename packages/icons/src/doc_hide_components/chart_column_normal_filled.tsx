
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartColumnNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="12" y="39" width="12" height="29" rx="1" fill={ colors[0] }/>
    <rect x="34" y="12" width="12" height="56" rx="1" fill={ colors[0] }/>
    <rect x="56" y="29" width="12" height="39" rx="1" fill={ colors[0] }/>

  </>,
  name: 'chart_column_normal_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: [],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
