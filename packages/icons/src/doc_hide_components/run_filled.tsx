
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const RunFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <rect x="9" y="8" width="2" height="8" rx="1" fill={ colors[1] }/>
    <rect x="13" y="8" width="2" height="8" rx="1" fill={ colors[1] }/>

  </>,
  name: 'run_filled',
  defaultColors: ['#30C28B', 'white'],
  colorful: true,
  allPathData: ['M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
