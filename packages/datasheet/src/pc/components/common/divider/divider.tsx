import * as React from 'react';
import { useThemeColors } from '@vikadata/components';

interface IDividerProps {
  height?: number;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  className?: string;
}

export const Divider: React.FC<IDividerProps> = props => {
  const colors = useThemeColors();
  const { height = 1, color = colors.lineColor, marginTop = 8, marginBottom = 16 , className } = props;
  const style: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: color,
    marginTop,
    marginBottom,
    flexShrink: 0,
  };
  return <div style={style} className={className}/>;
};
