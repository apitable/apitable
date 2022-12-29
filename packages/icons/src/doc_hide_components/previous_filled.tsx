
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const PreviousFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="24" cy="24" r="20" fill={ colors[0] }/>
    <path d="M25 20L21 24L25 28" stroke={ colors[1] } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'previous_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M25 20L21 24L25 28'],
  width: '48',
  height: '48',
  viewBox: '0 0 48 48',
});
