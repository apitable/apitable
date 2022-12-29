
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ViewKanbanFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.99353 1.00002C1.44422 1.0035 1 1.44987 1 2V10C1 10.5523 1.44772 11 2 11H5L5 14C5 14.5523 5.44771 15 6 15H10C10.5523 15 11 14.5523 11 14L11 1H2C1.99784 1 1.99569 1.00001 1.99353 1.00002ZM3 3L3 9H5L5 3H3ZM9 13H7L7 3H9L9 13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path opacity="0.6" d="M13 3H11V1H14C14.5523 1 15 1.44772 15 2V7C15 7.55228 14.5523 8 14 8H11V6H13V3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_kanban_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M1.99353 1.00002C1.44422 1.0035 1 1.44987 1 2V10C1 10.5523 1.44772 11 2 11H5L5 14C5 14.5523 5.44771 15 6 15H10C10.5523 15 11 14.5523 11 14L11 1H2C1.99784 1 1.99569 1.00001 1.99353 1.00002ZM3 3L3 9H5L5 3H3ZM9 13H7L7 3H9L9 13Z', 'M13 3H11V1H14C14.5523 1 15 1.44772 15 2V7C15 7.55228 14.5523 8 14 8H11V6H13V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
