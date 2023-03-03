/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useThemeColors } from '@apitable/components';
import { ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';
import { Rect } from './rect';

const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Path = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/path'), { ssr: false });

export enum IconType {
  Unchecked = 'Unchecked',
  Checked = 'Checked',
  TeamAvatar = 'TeamAvatar',
  MemberAvatar = 'MemberAvatar',
  GanttLeftButton = 'GanttLeftButton',
}

const dataMap = {
  [IconType.Unchecked]: `
    M12.2,1H2.8C1.8,1,1,1.8,1,2.8v9.5c0,1,0.8,1.8,1.8,1.8h9.5c1,0,1.8-0.8,1.8-1.8V2.8C14,1.8,13.2,1,12.2,1z
    M12.5,12.2c0,0.1-0.1,0.2-0.2,0.2H2.8c-0.1,0-0.2-0.1-0.2-0.2V2.8c0-0.1,0.1-0.2,0.2-0.2h9.5c0.1,0,0.2,0.1,0.2,0.2V12.2z
  `,
  [IconType.Checked]: `
    M13,1H2C1.4,1,1,1.4,1,2v11c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V2C14,1.4,13.6,1,13,1z M11.6,6l-4.3,4.2
    c-0.1,0.1-0.3,0.2-0.5,0.2c-0.2,0-0.4-0.1-0.5-0.2L3.5,7.4c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.3,2.3l3.7-3.7
    c0.3-0.3,0.8-0.3,1.1,0C11.9,5.2,11.9,5.7,11.6,6z
  `,
  [IconType.TeamAvatar]: `
    M22.9,16c1.1-0.8,1.9-2.1,1.9-3.6c0-2.4-2-4.4-4.3-4.4c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8
    c1.6,0,2.8,1.3,2.8,2.9s-1.3,2.9-2.8,2.9c0,0-0.1,0-0.1,0c-0.1,0-0.2,0-0.3,0c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8
    c2.7,0,4.8,2.2,4.8,4.8c0,0.2,0,0.3,0,0.5c0,0.4,0.3,0.8,0.7,0.8c0,0,0.1,0,0.1,0c0.4,0,0.7-0.3,0.7-0.7c0-0.2,0-0.4,0-0.7
    C26.3,19.1,24.9,17,22.9,16z
    M16.5,16.6c1.3-0.9,2.2-2.5,2.2-4.2c0-2.8-2.3-5.1-5.1-5.1s-5.1,2.3-5.1,5.1c0,1.7,0.9,3.3,2.2,4.2
		c-2.9,1.2-5,4-5,7.4c0,0.4,0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8c0-3.6,2.9-6.5,6.5-6.5c3.6,0,6.4,2.9,6.4,6.5c0,0.4,0.3,0.8,0.8,0.8
		s0.8-0.3,0.8-0.8C21.5,20.7,19.5,17.8,16.5,16.6z M10,12.4c0-2,1.6-3.6,3.6-3.6s3.6,1.6,3.6,3.6S15.6,16,13.6,16S10,14.4,10,12.4z
  `,
  [IconType.MemberAvatar]: `
    M11,8.2c0.7-0.8,1.2-1.8,1.2-2.9c0-2.3-1.9-4.2-4.2-4.2C5.7,1.1,3.8,3,3.8,5.3c0,1.1,0.5,2.2,1.2,2.9
    c-2.3,1.1-3.8,3.5-3.8,6.2c0,0.6,0.4,1,1,1s1-0.4,1-1c0-2.7,2.2-4.9,4.9-4.9c0,0,0,0,0,0s0,0,0,0c2.7,0,4.9,2.2,4.9,4.9
    c0,0.6,0.4,1,1,1s1-0.4,1-1C14.9,11.7,13.3,9.4,11,8.2z M5.8,5.3c0-1.2,1-2.2,2.2-2.2c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2
    C6.8,7.5,5.8,6.5,5.8,5.3z
  `,
  [IconType.GanttLeftButton]: `
    M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4C2 2.89543 2.89543 
    2 4 2H12ZM3.58565 7.53151L7.02518 4.77988C7.41804 4.4656 8 4.7453 8 5.2484V7.00003L12 7.00003C12.5523 7.00003 13 7.44774 
    13 8.00003C13 8.55231 12.5523 9.00003 12 9.00003L8 9.00003V10.7517C8 11.2548 7.41804 11.5345 7.02518 11.2202L3.58565 
    8.46855C3.28541 8.22835 3.28541 7.7717 3.58565 7.53151Z
  `,
};

interface IIconProps extends ShapeConfig {
  type?: IconType;
  size?: number;
  backgroundWidth?: number;
  backgroundHeight?: number;
}

type Shape = 'square' | 'circle';

export const Icon: FC<React.PropsWithChildren<IIconProps & { id?: string, background?: string; shape?: Shape; }>> = memo((props) => {
  const colors = useThemeColors();
  const {
    name,
    data,
    type,
    shape = 'square',
    x,
    y,
    size = 16,
    backgroundWidth,
    backgroundHeight,
    fill = colors.thirdLevelText,
    stroke,
    background = 'transparent',
    rotation,
    scaleX,
    scaleY,
    offsetX,
    offsetY,
    cornerRadius,
    opacity,
    listening,
    transformsEnabled = 'position',
    ...rest
  } = props;

  return (
    <Group
      x={x}
      y={y}
      listening={listening}
      {...rest}
    >
      {
        shape === 'circle' &&
        <Circle
          x={(backgroundWidth || size) / 2}
          y={(backgroundWidth || size) / 2}
          name={name}
          radius={(backgroundWidth || size) / 2}
          fill={background}
          opacity={opacity}
          perfectDrawEnabled={false}
        />
      }
      {
        shape === 'square' &&
        <Rect
          name={name}
          width={backgroundWidth || size}
          height={backgroundHeight || size}
          fill={background}
          cornerRadius={cornerRadius}
          opacity={opacity}
        />
      }
      <Path
        x={backgroundWidth && (backgroundWidth - size * (scaleX || 1)) / 2}
        y={backgroundHeight && (backgroundHeight - size * (scaleY || 1)) / 2}
        data={type ? dataMap[type] : data}
        width={size}
        height={size}
        fill={fill}
        offsetX={offsetX}
        offsetY={offsetY}
        scaleX={scaleX}
        scaleY={scaleY}
        rotation={rotation}
        stroke={stroke}
        transformsEnabled={transformsEnabled}
        perfectDrawEnabled={false}
        listening={false}
      />
    </Group>
  );
});
