
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartLinePercentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M16.5 64.0088L32.5 49.5088L54 58.5088L69.5 45.0088" stroke={ colors[2] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 47.0088L29 32.5088L50.5 41.5088L66 28.0088" stroke={ colors[0] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 15.0088L67.0001 15" stroke={ colors[1] } strokeWidth="3" strokeLinecap="round"/>

  </>,
  name: 'chart_line_percent_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M16.5 64.0088L32.5 49.5088L54 58.5088L69.5 45.0088', 'M13 47.0088L29 32.5088L50.5 41.5088L66 28.0088', 'M13 15.0088L67.0001 15'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
