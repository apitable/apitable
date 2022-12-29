
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ItalicsFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.84894 3.45428L8.56771 12.5H9.84896L9.64328 13.9543H5.30734L5.51302 12.5H6.78646L8.06769 3.45428H6.79426L6.99994 2H11.3359L11.1302 3.45428H9.84894Z" fill={ colors[0] }/>

  </>,
  name: 'italics_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9.84894 3.45428L8.56771 12.5H9.84896L9.64328 13.9543H5.30734L5.51302 12.5H6.78646L8.06769 3.45428H6.79426L6.99994 2H11.3359L11.1302 3.45428H9.84894Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
