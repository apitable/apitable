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

const TextComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/text'), { ssr: false });

export const Text: FC<React.PropsWithChildren<ShapeConfig>> = memo((props) => {
  const colors = useThemeColors();
  const {
    x,
    y,
    width,
    height,
    text,
    padding,
    align = 'left',
    verticalAlign = 'middle',
    fill = colors.firstLevelText,
    textDecoration,
    fontSize = 13,
    fontStyle = 'normal',
    ellipsis = true,
    wrap = 'none',
    transformsEnabled = 'position',
    listening = false,
    fontFamily = `'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
                  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    ...rest
  } = props;

  return (
    <TextComponent
      x={x}
      y={y}
      text={text}
      width={width}
      height={height}
      padding={padding}
      verticalAlign={verticalAlign}
      align={align}
      fill={fill}
      textDecoration={textDecoration}
      fontSize={fontSize}
      fontStyle={fontStyle}
      fontFamily={fontFamily}
      hitStrokeWidth={0}
      ellipsis={ellipsis}
      wrap={wrap}
      transformsEnabled={transformsEnabled}
      perfectDrawEnabled={false}
      listening={listening}
      {...rest}
    />
  );
});
