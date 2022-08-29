import { useRef, useEffect, FC } from 'react';
import { autoSizerCanvas, Text } from 'pc/components/konva_components';

interface ITaskTitleProps {
  x?: number;
  y?: number;
  height: number;
  title: string;
  sizeMapIndex: number;
  setSizeMap: (index: number, width: number) => void;
  fill: string;
}

export const TaskTitle: FC<ITaskTitleProps> = (props) => {
  const { x, y, height, sizeMapIndex, title: _title, setSizeMap, fill } = props;
  const textSizer = useRef(autoSizerCanvas);
  const title = _title.replace(/\r|\n/g, ' ');

  useEffect(() => {
    const textWidth = textSizer.current.measureText(title).width;
    setSizeMap(sizeMapIndex, textWidth);
  }, [sizeMapIndex, title, setSizeMap]);

  return (
    <Text
      x={x}
      y={y}
      text={title}
      fill={fill}
      height={height}
      fontStyle={'bold'}
      verticalAlign={'middle'}
    />
  );
};