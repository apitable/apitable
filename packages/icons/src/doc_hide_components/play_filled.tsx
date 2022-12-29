
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const PlayFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.0884 7.43025C12.5094 7.69341 12.5094 8.30662 12.0884 8.56978L6.02799 12.3575C5.58048 12.6372 5 12.3155 5 11.7878V4.21227C5 3.68454 5.58048 3.36281 6.02799 3.64251L12.0884 7.43025Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'play_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.0884 7.43025C12.5094 7.69341 12.5094 8.30662 12.0884 8.56978L6.02799 12.3575C5.58048 12.6372 5 12.3155 5 11.7878V4.21227C5 3.68454 5.58048 3.36281 6.02799 3.64251L12.0884 7.43025Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
