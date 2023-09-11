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

import dynamic from 'next/dynamic';
import { FC, useContext, useState } from 'react';
import { getNextShadeColor, ThemeName } from '@apitable/components';
import { KONVA_DATASHEET_ID } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Rect, Text } from 'pc/components/konva_components';
import { ICellProps, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import {
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE,
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
  GRID_CELL_VALUE_PADDING,
  GRID_OPTION_ITEM_PADDING,
} from '../../../constant';
import { CellScrollContainer } from '../../cell_scroll_container';
import { IRenderContentBase, IRenderData } from '../interface';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const AddOutlinedPath = AddOutlined.toString();
const CloseSmallOutlinedPath = CloseOutlined.toString();

export const CellSingleSelect: FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, recordId, field, rowHeight, columnWidth, renderData, isActive, editable, onChange, toggleEdit } = props;
  const { setCellDown, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { cacheTheme } = useContext(KonvaGridViewContext);
  const isLightTheme = cacheTheme === ThemeName.Light;

  const operatingEnable = isActive && editable;
  const fieldId = field?.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });
  const [isHover, setHover] = useState(false);
  const [isCloseHover, setCloseHover] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { renderContent } = renderData;

  const renderSingleSelect = () => {
    if (renderContent == null) return null;
    const { x, y, width, height, text, style } = renderContent as IRenderContentBase;
    const { background, color } = style;
    const iconColor = isLightTheme ? (color === colors.firstLevelText ? colors.secondLevelText : colors.defaultBg) : colors.textStaticPrimary;

    let iconBg = 'transparent';
    if (isCloseHover) {
      iconBg = getNextShadeColor(background!, 1);
    }
    if (isMouseDown) {
      iconBg = getNextShadeColor(background!, 2);
    }

    return (
      <Group x={x} y={y} listening={isActive}>
        <Rect width={width} height={height} fill={background} cornerRadius={16} listening={false} />
        <Text x={GRID_OPTION_ITEM_PADDING} height={height} text={text} fill={color} fontSize={12} />
        {operatingEnable && (
          <Icon
            name={name}
            x={width - GRID_OPTION_ITEM_PADDING - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET}
            y={2}
            data={CloseSmallOutlinedPath}
            fill={iconColor}
            scaleX={0.75}
            scaleY={0.75}
            transformsEnabled={'all'}
            background={iconBg}
            backgroundHeight={16}
            backgroundWidth={16}
            cornerRadius={2}
            onTap={() => onChange?.(null)}
            onMouseDown={() => {
              setIsMouseDown(true);
            }}
            onMouseUp={() => {
              if (isMouseDown) {
                onChange?.(null);
              }
              setCellDown(false);
              setIsMouseDown(false);
            }}
            onMouseEnter={() => setCloseHover(true)}
            onMouseOut={() => {
              setIsMouseDown(false);
              setCloseHover(false);
            }}
          />
        )}
      </Group>
    );
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
    >
      {operatingEnable && renderContent == null && (
        <Icon
          name={name}
          x={GRID_CELL_VALUE_PADDING}
          y={5}
          data={AddOutlinedPath}
          shape={'circle'}
          backgroundWidth={22}
          backgroundHeight={22}
          background={isHover ? colors.rowSelectedBgSolid : 'transparent'}
          onMouseEnter={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onClick={toggleEdit}
          onTap={toggleEdit}
        />
      )}
      {isActive && renderSingleSelect()}
    </CellScrollContainer>
  );
};
