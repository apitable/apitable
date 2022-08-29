
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const FormOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13 8H12V3C12 1.9 11.1 1 10 1H3C1.9 1 1 1.9 1 3V13C1 14.1 1.9 15 3 15H11H12C13.7 15 15 13.7 15 12V10C15 8.9 14.1 8 13 8ZM10 3V9V13H3V3H10ZM13 12C13 12.6 12.6 13 12 13V10H13V12ZM5 7H8C8.6 7 9 6.6 9 6C9 5.4 8.6 5 8 5H5C4.4 5 4 5.4 4 6C4 6.6 4.4 7 5 7ZM8 11H5C4.4 11 4 10.6 4 10C4 9.4 4.4 9 5 9H8C8.6 9 9 9.4 9 10C9 10.6 8.6 11 8 11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'form_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13 8H12V3C12 1.9 11.1 1 10 1H3C1.9 1 1 1.9 1 3V13C1 14.1 1.9 15 3 15H11H12C13.7 15 15 13.7 15 12V10C15 8.9 14.1 8 13 8ZM10 3V9V13H3V3H10ZM13 12C13 12.6 12.6 13 12 13V10H13V12ZM5 7H8C8.6 7 9 6.6 9 6C9 5.4 8.6 5 8 5H5C4.4 5 4 5.4 4 6C4 6.6 4.4 7 5 7ZM8 11H5C4.4 11 4 10.6 4 10C4 9.4 4.4 9 5 9H8C8.6 9 9 9.4 9 10C9 10.6 8.6 11 8 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
