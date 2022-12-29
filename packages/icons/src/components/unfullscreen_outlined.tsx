
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const UnfullscreenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 8C8.5 8 8.1 7.6 8 7.1V7L8 3C8 2.4 8.4 2 9 2C9.5 2 9.9 2.4 10 2.9V3V6H13C13.5 6 13.9 6.4 14 6.9V7C14 7.5 13.6 7.9 13.1 8H13L9 8ZM6 10H3C2.5 10 2.1 9.6 2 9.1V9C2 8.5 2.4 8.1 2.9 8H3L7 8C7.5 8 7.9 8.4 8 8.9V9L8 13C8 13.6 7.6 14 7 14C6.5 14 6.1 13.6 6 13.1V13L6 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'unfullscreen_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 8C8.5 8 8.1 7.6 8 7.1V7L8 3C8 2.4 8.4 2 9 2C9.5 2 9.9 2.4 10 2.9V3V6H13C13.5 6 13.9 6.4 14 6.9V7C14 7.5 13.6 7.9 13.1 8H13L9 8ZM6 10H3C2.5 10 2.1 9.6 2 9.1V9C2 8.5 2.4 8.1 2.9 8H3L7 8C7.5 8 7.9 8.4 8 8.9V9L8 13C8 13.6 7.6 14 7 14C6.5 14 6.1 13.6 6 13.1V13L6 10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
