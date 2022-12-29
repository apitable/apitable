
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const RestingOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="1" y="1" width="14" height="14" rx="7" stroke={ colors[0] } strokeWidth="1.5"/>

  </>,
  name: 'resting_outlined',
  defaultColors: ['#666666'],
  colorful: false,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
