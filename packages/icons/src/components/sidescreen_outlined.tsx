
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const SidescreenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 1.5H11V14.5H2C1.72386 14.5 1.5 14.2761 1.5 14V2C1.5 1.72386 1.72386 1.5 2 1.5ZM0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'sidescreen_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 1.5H11V14.5H2C1.72386 14.5 1.5 14.2761 1.5 14V2C1.5 1.72386 1.72386 1.5 2 1.5ZM0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
