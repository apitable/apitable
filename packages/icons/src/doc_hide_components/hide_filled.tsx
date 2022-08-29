
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const HideFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 3C3.54545 3 1 8 1 8C1 8 3.54545 13 8 13C12.4545 13 15 8 15 8C15 8 12.4545 3 8 3ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <circle cx="8" cy="8" r="2" fill={ colors[0] }/>

  </>,
  name: 'hide_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M8 3C3.54545 3 1 8 1 8C1 8 3.54545 13 8 13C12.4545 13 15 8 15 8C15 8 12.4545 3 8 3ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
