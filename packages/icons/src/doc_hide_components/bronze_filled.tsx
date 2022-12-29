
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const BronzeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="16" cy="16" r="11.5" fill={ colors[1] } stroke={ colors[0] }/>
    <path d="M16 11L15 10V14H16V11Z" fill={ colors[0] }/>
    <path d="M15 10H11V14V18V22L15 18L19 14L23 10H19L15 14V10Z" fill={ colors[2] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M23 11V10L11 22V23L23 11Z" fill={ colors[0] }/>

  </>,
  name: 'bronze_filled',
  defaultColors: ['#C18769', '#EFC8AC', 'white'],
  colorful: true,
  allPathData: ['M16 11L15 10V14H16V11Z', 'M15 10H11V14V18V22L15 18L19 14L23 10H19L15 14V10Z', 'M23 11V10L11 22V23L23 11Z'],
  width: '32',
  height: '32',
  viewBox: '0 0 32 32',
});
