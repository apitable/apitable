
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const DefaultFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M12 16.5L12 10.5" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'default_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z', 'M12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7Z', 'M12 16.5L12 10.5'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
