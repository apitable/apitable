
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const BookOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.9 1.3C2.79543 1.3 1.9 2.19543 1.9 3.3V11.8C1.9 13.4569 3.24315 14.8 4.9 14.8H12.9C13.4523 14.8 13.9 14.3523 13.9 13.8V2.3C13.9 1.74772 13.4523 1.3 12.9 1.3H3.9ZM3.9 3.3L11.9 3.3V9.3H3.9V3.3ZM3.9 11.3V11.8C3.9 12.3523 4.34772 12.8 4.9 12.8H11.9V11.3H3.9Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'book_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.9 1.3C2.79543 1.3 1.9 2.19543 1.9 3.3V11.8C1.9 13.4569 3.24315 14.8 4.9 14.8H12.9C13.4523 14.8 13.9 14.3523 13.9 13.8V2.3C13.9 1.74772 13.4523 1.3 12.9 1.3H3.9ZM3.9 3.3L11.9 3.3V9.3H3.9V3.3ZM3.9 11.3V11.8C3.9 12.3523 4.34772 12.8 4.9 12.8H11.9V11.3H3.9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
