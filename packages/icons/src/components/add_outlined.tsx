
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const AddOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 3C7.44772 3 7 3.44772 7 4V7L4 7C3.44772 7 3 7.44771 3 8C3 8.55228 3.44772 9 4 9H7V12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12V9H12C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7L9 7V4C9 3.44772 8.55228 3 8 3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'add_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 3C7.44772 3 7 3.44772 7 4V7L4 7C3.44772 7 3 7.44771 3 8C3 8.55228 3.44772 9 4 9H7V12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12V9H12C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7L9 7V4C9 3.44772 8.55228 3 8 3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
