
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const DescriptionFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="2" y="2" width="12" height="12" rx="1" fill={ colors[0] } stroke={ colors[0] } strokeWidth="2" strokeLinejoin="round"/>
    <rect x="4" y="5" width="5" height="2" rx="1" fill={ colors[1] }/>
    <rect x="4" y="9" width="8" height="2" rx="1" fill={ colors[1] }/>

  </>,
  name: 'description_filled',
  defaultColors: ['#30C28B', 'white'],
  colorful: true,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
