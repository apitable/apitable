
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const RelationReduceFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M10.6666 8.00001H5.33325" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'relation_reduce_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z', 'M10.6666 8.00001H5.33325'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
