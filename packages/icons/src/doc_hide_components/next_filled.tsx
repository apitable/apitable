
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const NextFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle r="20" transform="matrix(-1 0 0 1 24 24)" fill={ colors[0] }/>
    <path d="M23 20L27 24L23 28" stroke={ colors[1] } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'next_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M23 20L27 24L23 28'],
  width: '48',
  height: '48',
  viewBox: '0 0 48 48',
});
