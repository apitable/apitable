
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const HidefieldOffFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="32" height="18" rx="9" fill={ colors[0] }/>
    <path d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_off_filled',
  defaultColors: ['#C9C9C9', 'white'],
  colorful: true,
  allPathData: ['M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z'],
  width: '18',
  height: '18',
  viewBox: '0 0 18 18',
});
