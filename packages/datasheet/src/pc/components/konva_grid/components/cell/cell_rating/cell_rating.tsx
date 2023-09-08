/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { memo, useContext, useState } from 'react';
import { ConfigConstant, KONVA_DATASHEET_ID } from '@apitable/core';
import { generateTargetName } from 'pc/components/gantt_view';
import { Rect, Image } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { emojiUrl } from 'pc/utils';
import { GRID_CELL_VALUE_PADDING } from '../../../constant';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderData } from '../interface';

export const CellRating: React.FC<React.PropsWithChildren<ICellProps>> = memo((props) => {
  const { x, y, field, editable, cellValue: _cellValue, columnWidth, rowHeight, onChange, recordId, style, isActive } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { icon, max } = field.property;
  const cellValue = (_cellValue as number) || 0;
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

  const handleMouseOut = () => {
    setPendingValue(cellValue);
    clearTooltipInfo();
  };

  const transMax = !editable ? transValue + 1 : max + 1;
  const iconId = typeof icon === 'string' ? icon : icon.id;
  const iconUrl = emojiUrl(iconId) as string;
  const commonProps = {
    url: iconUrl,
    width: ConfigConstant.CELL_EMOJI_SIZE,
    height: ConfigConstant.CELL_EMOJI_SIZE,
  };
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
  });
  const pointerName = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
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
      {columnWidth != null && (
        <Rect name={name} width={columnWidth} height={rowHeight} fill={style?.background || (isActive ? colors.defaultBg : 'transparent')} />
      )}
      {[...Array(transMax).keys()].splice(1).map((item, index) => {
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
            alt=""
          />
        );
      })}
    </CellScrollContainer>
  );
});
