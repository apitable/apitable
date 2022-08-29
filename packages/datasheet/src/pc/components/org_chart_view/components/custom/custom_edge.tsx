import { useThemeColors } from '@vikadata/components';
import { FC, memo } from 'react';
import { EdgeProps, getSmoothStepPath } from '@vikadata/react-flow-renderer';

export const CustomEdge: FC<EdgeProps> = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}) => {
  const colors = useThemeColors();
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      stroke={colors.primaryColor}
      fill='none'
      strokeWidth={2}
      d={edgePath}
      style={style}
    />
  );
});
