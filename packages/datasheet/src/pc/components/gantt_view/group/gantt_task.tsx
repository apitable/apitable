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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { ILightOrDarkThemeColors } from '@apitable/components';
import { Rect, Text } from 'pc/components/konva_components';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface IGanttTask {
  colors: ILightOrDarkThemeColors;
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  fill: string;
  opacity: number;
  cornerRadius: number;
}

const GanttTask = (props: IGanttTask) => {
  const { colors, x, y, text, width, height, fill, opacity, cornerRadius } = props;
  return (
    <Group x={x} y={y} listening={false}>
      <Rect width={width} height={height} cornerRadius={cornerRadius} fill={fill} opacity={opacity} />
      <Text x={10} height={height} text={text} fill={colors.fc1} />
    </Group>
  );
};

export default GanttTask;
