
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const FolderNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2C1.9 2 1 2.9 1 4V12C1 13.1 1.9 14 3 14H11C13.2 14 15 12.2 15 10V5C15 3.9 14.1 3 13 3H7L5.4 2.2C5.1 2.1 4.8 2 4.5 2H3ZM4 6C3.4 6 3 6.4 3 7C3 7.6 3.4 8 4 8H12C12.6 8 13 7.6 13 7C13 6.4 12.6 6 12 6H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_normal_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 2C1.9 2 1 2.9 1 4V12C1 13.1 1.9 14 3 14H11C13.2 14 15 12.2 15 10V5C15 3.9 14.1 3 13 3H7L5.4 2.2C5.1 2.1 4.8 2 4.5 2H3ZM4 6C3.4 6 3 6.4 3 7C3 7.6 3.4 8 4 8H12C12.6 8 13 7.6 13 7C13 6.4 12.6 6 12 6H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
