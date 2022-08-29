
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const SuccessFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M16.8466 8.7737L11.0147 15.0469L7.58813 11.7558" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'success_filled',
  defaultColors: ['#30C28B', 'white'],
  colorful: true,
  allPathData: ['M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z', 'M16.8466 8.7737L11.0147 15.0469L7.58813 11.7558'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
