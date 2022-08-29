import { FC, useContext, useMemo } from 'react';
import { KONVA_DATASHEET_ID } from '@vikadata/core';
import { ICellProps } from '../cell_value';
import { Rect } from 'pc/components/konva_components';
import { generateTargetName } from 'pc/components/gantt_view';
import { KonvaGridContext } from 'pc/components/konva_grid';

/**
 * 无内容时，作为提供点击事件的占位
 */
export const CellBlank: FC<ICellProps> = (props) => {
  const { x, y, rowHeight, columnWidth, field, recordId, isActive } = props;
  const { setActiveCellBound } = useContext(KonvaGridContext);

  useMemo(() => {
    if (isActive) {
      setActiveCellBound({ height: rowHeight });
    }
  }, [isActive, rowHeight, setActiveCellBound]);

  return (
    <Rect 
      name={generateTargetName({
        targetName: KONVA_DATASHEET_ID.GRID_CELL,
        fieldId: field.id,
        recordId
      })}
      x={x}
      y={y}
      width={columnWidth}
      height={rowHeight}
      fill={'transparent'}
    />
  );
};