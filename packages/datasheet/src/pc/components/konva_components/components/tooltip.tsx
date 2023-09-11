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
import { FC } from 'react';
import { useThemeColors } from '@apitable/components';
import { Text } from './text';

const Label = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/label'), { ssr: false });
const Tag = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/tag'), { ssr: false });

interface IToolTipProps extends ShapeConfig {
  text: string;
  background?: string | null;
}

export const ToolTip: FC<React.PropsWithChildren<IToolTipProps>> = (props) => {
  const colors = useThemeColors();
  const {
    x,
    y,
    text,
    background = colors.tooltipBg,
    fill = colors.defaultBg,
    padding = 10,
    cornerRadius = 4,
    pointerDirection = '',
    pointerWidth = 10,
    pointerHeight = 10,
  } = props;

  return (
    <Label x={x} y={y}>
      <Tag
        fill={background}
        listening={false}
        perfectDrawEnabled={false}
        cornerRadius={cornerRadius}
        pointerDirection={pointerDirection}
        pointerWidth={pointerWidth}
        pointerHeight={pointerHeight}
      />
      <Text text={text} fill={fill} padding={padding} />
    </Label>
  );
};
