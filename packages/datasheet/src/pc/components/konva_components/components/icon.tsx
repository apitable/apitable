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

import { ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';
import { useThemeColors } from '@apitable/components';
import { UserGroupOutlined } from '@apitable/icons';
import { Rect } from './rect';

const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Path = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/path'), { ssr: false });

const UserGroupOutlinedPath = UserGroupOutlined.toString();

export enum IconType {
  Unchecked = 'Unchecked',
  Checked = 'Checked',
  TeamAvatar = 'TeamAvatar',
  MemberAvatar = 'MemberAvatar',
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
  [IconType.TeamAvatar]: UserGroupOutlinedPath,
  [IconType.MemberAvatar]: `
    M11,8.2c0.7-0.8,1.2-1.8,1.2-2.9c0-2.3-1.9-4.2-4.2-4.2C5.7,1.1,3.8,3,3.8,5.3c0,1.1,0.5,2.2,1.2,2.9
    c-2.3,1.1-3.8,3.5-3.8,6.2c0,0.6,0.4,1,1,1s1-0.4,1-1c0-2.7,2.2-4.9,4.9-4.9c0,0,0,0,0,0s0,0,0,0c2.7,0,4.9,2.2,4.9,4.9
    c0,0.6,0.4,1,1,1s1-0.4,1-1C14.9,11.7,13.3,9.4,11,8.2z M5.8,5.3c0-1.2,1-2.2,2.2-2.2c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2
    C6.8,7.5,5.8,6.5,5.8,5.3z
  `,
};

interface IIconProps extends ShapeConfig {
  type?: IconType;
  size?: number;
  backgroundWidth?: number;
  backgroundHeight?: number;
}

export type Shape = 'square' | 'circle';

export const Icon: FC<React.PropsWithChildren<IIconProps & { id?: string; background?: string; shape?: Shape }>> = memo((props) => {
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
    <Group x={x} y={y} listening={listening} {...rest}>
      {shape === 'circle' && (
        <Circle
          x={(backgroundWidth || size) / 2}
          y={(backgroundWidth || size) / 2}
          name={name}
          radius={(backgroundWidth || size) / 2}
          fill={background}
          opacity={opacity}
          perfectDrawEnabled={false}
        />
      )}
      {shape === 'square' && (
        <Rect
          name={name}
          width={backgroundWidth || size}
          height={backgroundHeight || size}
          fill={background}
          cornerRadius={cornerRadius}
          opacity={opacity}
        />
      )}
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
