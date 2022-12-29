import { ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { FC, memo, useContext } from 'react';

const RectComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/rect'), { ssr: false });

export const Rect: FC<ShapeConfig> = memo((props) => {
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
