
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ChartLineStackFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15.5 57L31.5 42.5L53 51.5L68.5 38" stroke={ colors[1] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 40L28 25.5L49.5 34.5L65 21" stroke={ colors[0] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'chart_line_stack_filled',
  defaultColors: ['#7B67EE', '#FFBA2E'],
  colorful: true,
  allPathData: ['M15.5 57L31.5 42.5L53 51.5L68.5 38', 'M12 40L28 25.5L49.5 34.5L65 21'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
