import { KONVA_DATASHEET_ID } from '@apitable/core';
import dynamic from 'next/dynamic';
import { generateTargetName } from 'pc/components/gantt_view';
import { Rect } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { FC, useContext, useMemo } from 'react';
import { IRenderData } from '../cell/interface';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface ICellScrollContainerProps {
  x: number;
  y: number;
  columnWidth: number;
  rowHeight: number;
  fieldId: string;
  recordId: string;
  renderData: IRenderData;
  [key: string]: any;
}

const SCROLL_BAR_PADDING = 3;

export const CellScrollContainer: FC<ICellScrollContainerProps> = (props) => {
  const { x, y, columnWidth, rowHeight, fieldId, recordId, renderData, children, ...rest } = props;
  const { setActiveCellBound, cellScrollState, setCellScrollState, resetCellScroll, theme } = useContext(KonvaGridContext);
  const { renderContent, isOverflow = false, height: totalHeight = 1 } = renderData;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId
  });
  const { scrollTop } = cellScrollState;

  const height = useMemo(() => {
    if (renderContent == null) return rowHeight;
    return Math.max(Math.min(totalHeight, 130), rowHeight);
  }, [renderContent, rowHeight, totalHeight]);

  // Set the activated cell width and height
  useMemo(() => {
    setActiveCellBound({ height });
    setCellScrollState({
      scrollTop: 0,
      isOverflow,
      totalHeight
    });
    resetCellScroll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveCellBound, height, setCellScrollState, fieldId, recordId, isOverflow, totalHeight]);

  const ratio = (height - 2 * SCROLL_BAR_PADDING) / totalHeight;
  const realScrollTop = Math.min(scrollTop, totalHeight - height);
  const clipProps = {
    clipX: 0,
    clipY: 0,
    clipWidth: columnWidth,
    clipHeight: height,
  };

  return (
    <Group
      x={x}
      y={y}
      {...clipProps}
    >
      {
        isOverflow &&
        <Rect
          name={name}
          x={columnWidth - 7}
          y={ratio * realScrollTop + SCROLL_BAR_PADDING}
          height={ratio * height}
          width={5}
          cornerRadius={8}
          fill={theme.color.black[300]}
          listening={false}
        />
      }
      <Group
        offsetY={isOverflow ? realScrollTop : 0}
        {...rest}
      >
        {children}
      </Group>
    </Group>
  );
};
