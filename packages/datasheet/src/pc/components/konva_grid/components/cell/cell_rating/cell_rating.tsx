import { ConfigConstant, EmojisConfig, KONVA_DATASHEET_ID } from '@apitable/core';
import { Rect, Image } from 'pc/components/konva_components';
import { GRID_CELL_VALUE_PADDING } from '../../../constant';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderData } from '../interface';
import { generateTargetName } from 'pc/components/gantt_view';
import { memo, useContext, useState } from 'react';

export const CellRating: React.FC<ICellProps> = memo((props) => {
  const {
    x,
    y,
    field,
    editable,
    cellValue: _cellValue,
    columnWidth,
    rowHeight,
    onChange,
    recordId,
    style,
    isActive
  } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { icon, max } = field.property;
  const cellValue = _cellValue as number || 0;
  const { setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);

  const getTransValue = (): number => {
    const hasValue = Boolean(cellValue);
    if (hasValue) {
      const v = Math.round(cellValue);
      if (v >= max) return max;
      return v;
    }
    return 0;
  };
  // Rating converted from other cells, possibly as floating point numbers.
  const transValue = getTransValue();
  const [pendingValue, setPendingValue] = useState(transValue);
  const handleClick = (newValue: number) => {
    if (editable && onChange) {
      // Double click on the original rating to clear the rating.
      if (cellValue === newValue) {
        onChange(null);
      } else {
        onChange(newValue);
      }
    }
  };

  const handleMouseEnter = (v: number) => {
    editable && v > cellValue && setPendingValue(v);
    setTooltipInfo({
      title: String(v),
      visible: true,
      x: x + (v - 1) * 20 + GRID_CELL_VALUE_PADDING,
      y: y + 6,
      width: 20,
      height: 1,
    });
  };

  const handleMouseOut = (v: number) => {
    setPendingValue(cellValue);
    clearTooltipInfo();
  };

  const transMax = !editable ? transValue + 1 : max + 1;
  const iconId = typeof icon === 'string' ? icon : icon.id;
  const iconUrl = EmojisConfig[iconId]?.url;
  const commonProps = {
    url: iconUrl,
    width: ConfigConstant.CELL_EMOJI_SIZE,
    height: ConfigConstant.CELL_EMOJI_SIZE,
  };
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId
  });
  const pointerName = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer'
  });

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
    >
      {
        columnWidth != null &&
        <Rect
          name={name}
          width={columnWidth}
          height={rowHeight}
          fill={style?.background || (isActive ? colors.defaultBg : 'transparent')}
        />
      }
      {
        [...Array(transMax).keys()].splice(1).map((item, index) => {
          let willChecked = false;
          let opacity = 1;
          const checked = item <= transValue;
          const unChecked = item <= max && item > transValue;
          if (pendingValue > transValue) willChecked = item > transValue && item <= pendingValue;
          if (pendingValue < transValue) willChecked = item <= transValue && item > pendingValue;
          if (unChecked) opacity = isActive ? 0.2 : 0;
          if (willChecked) opacity = isActive ? 0.6 : 0;
          if (checked) opacity = 1;

          return (
            <Image
              key={index}
              name={pointerName}
              {...commonProps}
              x={index * 20 + GRID_CELL_VALUE_PADDING}
              y={7}
              opacity={opacity}
              onMouseDown={() => handleClick(item)}
              onTap={() => handleClick(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseOut={handleMouseOut}
              listening={isActive}
            />
          );
        })
      }
    </CellScrollContainer>
  );
});
