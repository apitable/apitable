
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const Headline1Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.00005 13V3H3V7H7V3H9.00005V13H7V9H3V13H1.00005ZM12.0176 6.35585C12.3776 6.13585 12.6776 5.90585 12.9176 5.65585H13.7976V12.7959H12.6276V7.06585C12.1976 7.45585 11.6576 7.74585 10.9976 7.93585V6.77585C11.3176 6.69585 11.6576 6.55585 12.0176 6.35585Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'headline_1_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.00005 13V3H3V7H7V3H9.00005V13H7V9H3V13H1.00005ZM12.0176 6.35585C12.3776 6.13585 12.6776 5.90585 12.9176 5.65585H13.7976V12.7959H12.6276V7.06585C12.1976 7.45585 11.6576 7.74585 10.9976 7.93585V6.77585C11.3176 6.69585 11.6576 6.55585 12.0176 6.35585Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
