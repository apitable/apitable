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

const LineComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/line'), { ssr: false });

export const Line: FC<React.PropsWithChildren<ShapeConfig>> = memo((props) => {
  const colors = useThemeColors();
  const {
    x,
    y,
    points,
    dash,
    stroke = colors.primaryColor,
    strokeWidth = 1,
    perfectDrawEnabled = false,
    shadowForStrokeEnabled = false,
    transformsEnabled = 'position',
    lineCap = 'square',
    listening = false,
    ...rest
  } = props;

  const dashEnabled = Boolean(dash);

  return (
    <LineComponent
      x={x}
      y={y}
      points={points}
      dash={dash}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dashEnabled={dashEnabled}
      lineCap={lineCap}
      perfectDrawEnabled={perfectDrawEnabled}
      shadowForStrokeEnabled={shadowForStrokeEnabled}
      transformsEnabled={transformsEnabled}
      hitStrokeWidth={0}
      listening={listening}
      {...rest}
    />
  );
});
