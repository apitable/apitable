
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartLineNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.5 25.5L28 49L51.5 55.5L69 40" stroke={ colors[1] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 45L27.5 26.5L49 35.5L66.5 20" stroke={ colors[0] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'chart_line_normal_filled',
  defaultColors: ['#7B67EE', '#FFBA2E'],
  colorful: true,
  allPathData: ['M8.5 25.5L28 49L51.5 55.5L69 40', 'M9 45L27.5 26.5L49 35.5L66.5 20'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
