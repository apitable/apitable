import dynamic from 'next/dynamic';
import { autoSizerCanvas, Rect, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export interface IOptionItemStyle {
  color?: string;
  background?: any;
  iconColor?: string;
}

interface ILinkItemProps {
  x?: number;
  y?: number;
  itemName: string;
  height: number;
  sizeMapIndex: number;
  setSizeMap: (index: number, width: number) => void;
  style?: IOptionItemStyle;
  isActive?: boolean;
  editable?: boolean;
}

const ITEM_PADDING = 10;

export const LinkItem: React.FC<ILinkItemProps> = props => {
  const { x = 0, y = 0, height, sizeMapIndex, setSizeMap, itemName, style } = props;
  const textSizer = useRef(autoSizerCanvas);
  const [width, setWidth] = useState<number>(0);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  useEffect(() => {
    const textWidth = textSizer.current.measureText(itemName).width;
    const currentWidth = textWidth + ITEM_PADDING * 2;
    setWidth(currentWidth);
    setSizeMap(sizeMapIndex, currentWidth);
  }, [itemName, sizeMapIndex, setSizeMap]);

  return (
    <Group
      x={x}
      y={y}
    >
      <Rect
        width={width}
        height={height}
        fill={colors.shadowColor}
        cornerRadius={4}
      />
      <Text
        x={ITEM_PADDING}
        width={width - 2 * ITEM_PADDING}
        height={height}
        text={itemName}
        fill={style?.color}
      />
    </Group>
  );
};
