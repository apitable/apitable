
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const CoverDisOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.2483 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V12.4294L12.2483 2.5ZM3.55103 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3.36616L3.55103 13.5ZM1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'cover_dis_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12.2483 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V12.4294L12.2483 2.5ZM3.55103 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3.36616L3.55103 13.5ZM1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
