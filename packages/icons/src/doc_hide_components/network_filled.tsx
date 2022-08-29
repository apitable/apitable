
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const NetworkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="9" cy="12" r="7" fill={ colors[0] }/>
    <rect x="5" y="11" width="17" height="8" rx="4" fill={ colors[0] }/>
    <circle cx="15" cy="11" r="4" fill={ colors[0] }/>
    <path d="M15 11.4467L11.4316 14.9849L9 12.5532" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'network_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M15 11.4467L11.4316 14.9849L9 12.5532'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
