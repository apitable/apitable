
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const EditDescribeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8ZM9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11V8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'edit_describe_filled',
  defaultColors: ['#C9C9C9'],
  colorful: false,
  allPathData: ['M15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8ZM9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11V8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
