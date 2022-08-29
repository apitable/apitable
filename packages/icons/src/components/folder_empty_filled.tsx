
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const FolderEmptyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 3H2.3C1.6 3 1 3.6 1 4.3V12.7C1 14 2 15 3.2 15H12.8C14 15 15 14 15 12.7V6C15 4.9 14.1 4 13 4H6C6 3.5 5.6 3 5 3Z" fill={ colors[0] }/>

  </>,
  name: 'folder_empty_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5 3H2.3C1.6 3 1 3.6 1 4.3V12.7C1 14 2 15 3.2 15H12.8C14 15 15 14 15 12.7V6C15 4.9 14.1 4 13 4H6C6 3.5 5.6 3 5 3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
