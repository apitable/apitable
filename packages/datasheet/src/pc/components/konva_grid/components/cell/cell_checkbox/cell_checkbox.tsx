import * as React from 'react';
import { KONVA_DATASHEET_ID } from '@apitable/core';
import { ICellProps } from '../cell_value';
import { Rect } from 'pc/components/konva_components';
import { stopPropagation, KeyCode } from 'pc/utils';
import { CellScrollContainer } from '../../cell_scroll_container';
import { IRenderData } from '../interface';
import { generateTargetName } from 'pc/components/gantt_view';

export const CellCheckbox: React.FC<ICellProps> = props => {
  const { x, y, isActive, recordId, field, cellValue, columnWidth, rowHeight, onChange } = props;
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer'
  });
  
  const onClick = () => {
    onChange && onChange(!cellValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      isActive && onChange && onChange(!cellValue);
      stopPropagation(e);
    }
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onTap={onClick}
    >
      {
        isActive &&
        <Rect 
          name={name}
          width={columnWidth}
          height={rowHeight}
          fill={'transparent'}
        />
      }
    </CellScrollContainer>
  );
};
