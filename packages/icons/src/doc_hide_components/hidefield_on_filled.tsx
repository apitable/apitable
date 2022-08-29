
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const HidefieldOnFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="32" height="18" rx="9" fill={ colors[0] }/>
    <path d="M23 16C26.866 16 30 12.866 30 9C30 5.13401 26.866 2 23 2C19.134 2 16 5.13401 16 9C16 12.866 19.134 16 23 16Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_on_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M23 16C26.866 16 30 12.866 30 9C30 5.13401 26.866 2 23 2C19.134 2 16 5.13401 16 9C16 12.866 19.134 16 23 16Z'],
  width: '18',
  height: '18',
  viewBox: '0 0 18 18',
});
