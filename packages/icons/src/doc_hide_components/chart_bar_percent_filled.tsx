
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartBarPercentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="68" y="12" width="12" height="56" rx="1" transform="rotate(90 68 12)" fill={ colors[2] }/>
    <path d="M26 12L26 24L13 24C12.4477 24 12 23.5523 12 23L12 13C12 12.4477 12.4477 12 13 12L26 12Z" fill={ colors[0] }/>
    <rect x="50" y="12" width="12" height="24" transform="rotate(90 50 12)" fill={ colors[1] }/>
    <rect x="68" y="34" width="12" height="56" rx="1" transform="rotate(90 68 34)" fill={ colors[2] }/>
    <path d="M45 34L45 46L13 46C12.4477 46 12 45.5523 12 45L12 35C12 34.4477 12.4477 34 13 34L45 34Z" fill={ colors[0] }/>
    <rect x="56" y="34" width="12" height="11" transform="rotate(90 56 34)" fill={ colors[1] }/>
    <rect x="68" y="56" width="12" height="56" rx="1" transform="rotate(90 68 56)" fill={ colors[2] }/>
    <path d="M32 56L32 68L13 68C12.4477 68 12 67.5523 12 67L12 57C12 56.4477 12.4477 56 13 56L32 56Z" fill={ colors[0] }/>
    <rect x="46" y="56" width="12" height="14" transform="rotate(90 46 56)" fill={ colors[1] }/>

  </>,
  name: 'chart_bar_percent_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M26 12L26 24L13 24C12.4477 24 12 23.5523 12 23L12 13C12 12.4477 12.4477 12 13 12L26 12Z', 'M45 34L45 46L13 46C12.4477 46 12 45.5523 12 45L12 35C12 34.4477 12.4477 34 13 34L45 34Z', 'M32 56L32 68L13 68C12.4477 68 12 67.5523 12 67L12 57C12 56.4477 12.4477 56 13 56L32 56Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
