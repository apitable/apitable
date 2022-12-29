
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const GanttRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="16" height="16" fill={ colors[1] }/>
    <path d="M8.97482 4.77988L12.4143 7.53151C12.7146 7.7717 12.7146 8.22836 12.4143 8.46855L8.97482 11.2202C8.58196 11.5345 8 11.2548 8 10.7517V9.00003L4 9.00003C3.44772 9.00003 3 8.55231 3 8.00003C3 7.44774 3.44772 7.00003 4 7.00003L8 7.00003V5.2484C8 4.7453 8.58196 4.4656 8.97482 4.77988Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gantt_right_filled',
  defaultColors: ['#C4C4C4', 'white'],
  colorful: true,
  allPathData: ['M8.97482 4.77988L12.4143 7.53151C12.7146 7.7717 12.7146 8.22836 12.4143 8.46855L8.97482 11.2202C8.58196 11.5345 8 11.2548 8 10.7517V9.00003L4 9.00003C3.44772 9.00003 3 8.55231 3 8.00003C3 7.44774 3.44772 7.00003 4 7.00003L8 7.00003V5.2484C8 4.7453 8.58196 4.4656 8.97482 4.77988Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
