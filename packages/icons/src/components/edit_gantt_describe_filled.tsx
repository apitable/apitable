
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const EditGanttDescribeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 6C8.55228 6 9 5.55228 9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6ZM8 7C7.44772 7 7 7.44772 7 8V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V8C9 7.44772 8.55228 7 8 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'edit_gantt_describe_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 6C8.55228 6 9 5.55228 9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6ZM8 7C7.44772 7 7 7.44772 7 8V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V8C9 7.44772 8.55228 7 8 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
