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
import { FC, memo, useContext } from 'react';
import { KonvaGridContext } from 'pc/components/konva_grid';

const RectComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/rect'), { ssr: false });

export const Rect: FC<React.PropsWithChildren<ShapeConfig>> = memo((props) => {
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const {
    x,
    y,
    width,
    height,
    fill = colors.defaultBg,
    strokeWidth,
    stroke,
    cornerRadius,
    alpha = 1,
    fillEnabled = true,
    hitStrokeWidth = 0,
    transformsEnabled = 'position',
    ...rest
  } = props;

  const strokeEnabled = Boolean(stroke);

  return (
    <RectComponent
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      shadowForStrokeEnabled={false}
      strokeScaleEnabled={false}
      hitStrokeWidth={hitStrokeWidth}
      alpha={alpha}
      fillEnabled={fillEnabled}
      strokeEnabled={strokeEnabled}
      cornerRadius={cornerRadius}
      perfectDrawEnabled={false}
      shadowEnabled={false}
      transformsEnabled={transformsEnabled}
      {...rest}
    />
  );
});
