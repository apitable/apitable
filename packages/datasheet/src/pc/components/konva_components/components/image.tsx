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
  clipFunc?: (ctx) => void;
}

export const Image: React.FC<IImageProps> = memo((props) => {
  const {
    name,
    url,
    shape = 'square',
    width = 0,
    height = 0,
    x = 0,
    y = 0,
    stroke,
    strokeWidth,
    listening,
    ...rest
  } = props;
  const {
    image,
    width: imageWidth,
    height: imageHeight,
    status,
  } = useImage({ url });

  const imageRef = useRef<any>();

  const aspectRatio = useMemo(() => {
    return Math.min(width / imageWidth, height / imageHeight);
  }, [imageWidth, imageHeight, width, height]);

  const finalWidth = Math.min(imageWidth, aspectRatio * imageWidth);
  const finalHeight = Math.min(imageHeight, aspectRatio * imageHeight);

  if (status !== 'loaded') return null;

  const size = width / 2;

  return (
    <Group
      x={x}
      y={y}
      clipFunc={shape === 'circle' ? (ctx) => ctx.arc(size, size, size, 0, Math.PI * 2, false) : undefined}
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
