
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const PauseFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.5 4C4.22386 4 4 4.22386 4 4.5V11.5C4 11.7761 4.22386 12 4.5 12H6.5C6.77614 12 7 11.7761 7 11.5V4.5C7 4.22386 6.77614 4 6.5 4H4.5ZM9.5 4C9.22386 4 9 4.22386 9 4.5V11.5C9 11.7761 9.22386 12 9.5 12H11.5C11.7761 12 12 11.7761 12 11.5V4.5C12 4.22386 11.7761 4 11.5 4H9.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'Pause_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.5 4C4.22386 4 4 4.22386 4 4.5V11.5C4 11.7761 4.22386 12 4.5 12H6.5C6.77614 12 7 11.7761 7 11.5V4.5C7 4.22386 6.77614 4 6.5 4H4.5ZM9.5 4C9.22386 4 9 4.22386 9 4.5V11.5C9 11.7761 9.22386 12 9.5 12H11.5C11.7761 12 12 11.7761 12 11.5V4.5C12 4.22386 11.7761 4 11.5 4H9.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
