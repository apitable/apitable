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
import * as React from 'react';
import { memo, useMemo, useRef } from 'react';
import { useImage } from '../hooks';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const ImageComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/image'), { ssr: false });

type Shape = 'square' | 'circle';

export interface IImageProps extends ShapeConfig {
  url: string;
  shape?: Shape;
  sizeMapIndex?: number;
  setSizeMap?: (index: number, width: number) => void;
  clipFunc?: (ctx: any) => void;
  failedDisplay?: React.ReactElement;
}

export const Image: React.FC<React.PropsWithChildren<IImageProps>> = memo((props) => {
  const { name, url, shape = 'square', width = 0, height = 0, x = 0, y = 0, stroke, strokeWidth, listening, failedDisplay, ...rest } = props;
  const { image, width: imageWidth, height: imageHeight, status } = useImage({ url });

  const imageRef = useRef<any>();

  const aspectRatio = useMemo(() => {
    return Math.min(width / imageWidth, height / imageHeight);
  }, [imageWidth, imageHeight, width, height]);

  const finalWidth = Math.min(imageWidth, aspectRatio * imageWidth);
  const finalHeight = Math.min(imageHeight, aspectRatio * imageHeight);

  if (status === 'failed' && failedDisplay) {
    return failedDisplay;
  }

  if (status !== 'loaded') return null;

  const size = width / 2;

  return (
    <Group
      x={x}
      y={y}
      clipFunc={
        shape === 'circle'
          ? (ctx: { arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: boolean) => any }) =>
            ctx.arc(size, size, size, 0, Math.PI * 2, false)
          : undefined
      }
      listening={listening}
    >
      <ImageComponent
        name={name}
        ref={imageRef}
        width={finalWidth}
        height={finalHeight}
        image={image}
        stroke={stroke}
        strokeWidth={strokeWidth}
        perfectDrawEnabled={false}
        transformsEnabled="position"
        {...rest}
      />
    </Group>
  );
});
