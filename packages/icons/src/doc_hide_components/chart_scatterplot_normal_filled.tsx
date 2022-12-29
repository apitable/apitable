
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartScatterplotNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="63" y="14" width="18" height="18" rx="9" transform="rotate(90 63 14)" fill={ colors[1] }/>
    <rect x="63" y="40" width="18" height="18" rx="9" transform="rotate(90 63 40)" fill={ colors[0] }/>
    <rect x="35" y="22" width="18" height="18" rx="9" transform="rotate(90 35 22)" fill={ colors[0] }/>
    <rect x="35" y="48" width="18" height="18" rx="9" transform="rotate(90 35 48)" fill={ colors[2] }/>

  </>,
  name: 'chart_scatterplot_normal_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: [],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
