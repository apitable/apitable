
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ColumnEmailFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11C14 12.1046 13.1046 13 12 13H4C2.89543 13 2 12.1046 2 11V5Z" fill={ colors[0] }/>
    <path d="M10.9142 6.84703L8 9.00006L5.08576 6.84703" stroke={ colors[1] } strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'column_email_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M2 5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11C14 12.1046 13.1046 13 12 13H4C2.89543 13 2 12.1046 2 11V5Z', 'M10.9142 6.84703L8 9.00006L5.08576 6.84703'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
