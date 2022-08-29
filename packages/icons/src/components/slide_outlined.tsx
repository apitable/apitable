
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const SlideOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 7C7.7 7 7.5 6.9 7.3 6.7L3.3 2.7C2.9 2.3 2.9 1.7 3.3 1.3C3.7 0.9 4.3 0.9 4.7 1.3L8 4.6L11.3 1.3C11.7 0.9 12.3 0.9 12.7 1.3C13.1 1.7 13.1 2.3 12.7 2.7L8.7 6.7C8.5 6.9 8.3 7 8 7ZM8 12.6L11.3 9.3C11.7 8.9 12.3 8.9 12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7L8.7 14.7C8.5 14.9 8.3 15 8 15C7.7 15 7.5 14.9 7.3 14.7L3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3C3.7 8.9 4.3 8.9 4.7 9.3L8 12.6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'slide_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 7C7.7 7 7.5 6.9 7.3 6.7L3.3 2.7C2.9 2.3 2.9 1.7 3.3 1.3C3.7 0.9 4.3 0.9 4.7 1.3L8 4.6L11.3 1.3C11.7 0.9 12.3 0.9 12.7 1.3C13.1 1.7 13.1 2.3 12.7 2.7L8.7 6.7C8.5 6.9 8.3 7 8 7ZM8 12.6L11.3 9.3C11.7 8.9 12.3 8.9 12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7L8.7 14.7C8.5 14.9 8.3 15 8 15C7.7 15 7.5 14.9 7.3 14.7L3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3C3.7 8.9 4.3 8.9 4.7 9.3L8 12.6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
