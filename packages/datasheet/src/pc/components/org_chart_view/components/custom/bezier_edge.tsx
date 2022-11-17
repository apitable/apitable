import { useThemeColors } from '@apitable/components';
import { FC, memo } from 'react';
import { EdgeProps, getBezierPath } from '@apitable/react-flow';

export const BezierEdge: FC<EdgeProps> = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const colors = useThemeColors();
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <path
      id={id}
      stroke={colors.primaryColor}
      fill='none'
      strokeWidth={2}
      d={edgePath}
      strokeDasharray={5}
    />
  );
});