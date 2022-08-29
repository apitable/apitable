import { useThemeColors } from '@vikadata/components';
import { ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';

const LineComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/line'), { ssr: false });

export const Line: FC<ShapeConfig> = memo((props) => {
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
